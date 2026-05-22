// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {Create2Factory} from "../src/Create2Factory.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

/// @dev Constructor re-enters the factory during CREATE2 init to exercise `nonReentrant`.
contract ReentrantInit {
    constructor(Create2Factory factory, bytes32 innerSalt, bytes memory innerBytecode) {
        factory.deploy(innerSalt, innerBytecode);
    }
}

/// @dev Accepts ETH sent with CREATE2 deployment (`callvalue()` forwarded at creation).
contract PayableInit {
    constructor() payable {}
}

contract Create2FactoryTest is Test {
    event Deployed(address indexed deployed, bytes32 indexed salt);

    Create2Factory internal factory;

    function setUp() public {
        factory = new Create2Factory();
    }

    function test_computeAddress_fromBytecode_matches_fromInitCodeHash() public view {
        bytes32 salt = bytes32(uint256(1));
        bytes memory bytecode = type(SimpleStorage).creationCode;

        bytes32 initCodeHash;
        assembly {
            initCodeHash := keccak256(add(bytecode, 0x20), mload(bytecode))
        }

        address a = factory.computeAddress(salt, bytecode);
        address b = factory.computeAddress(salt, initCodeHash);
        assertEq(a, b);
    }

    function test_computeAddress_matches_vm_create2_formula() public view {
        bytes32 salt = bytes32(uint256(99));
        bytes memory bytecode = type(SimpleStorage).creationCode;
        bytes32 initCodeHash = keccak256(bytecode);

        address fromFactory = factory.computeAddress(salt, initCodeHash);
        address fromVm = vm.computeCreate2Address(salt, initCodeHash, address(factory));

        assertEq(fromFactory, fromVm);
    }

    function test_deploy_matches_offchain_create2_prediction() public {
        bytes32 salt = bytes32(uint256(42));
        bytes memory bytecode = type(SimpleStorage).creationCode;

        address predicted = factory.computeAddress(salt, bytecode);
        address deployed = factory.deploy{value: 0}(salt, bytecode);

        assertEq(deployed, predicted);
        assertGt(deployed.code.length, 0);
    }

    function test_deploy_emits_event() public {
        bytes32 salt = bytes32(uint256(7));
        bytes memory bytecode = type(SimpleStorage).creationCode;
        address predicted = factory.computeAddress(salt, bytecode);

        vm.expectEmit(true, true, false, false);
        emit Deployed(predicted, salt);
        factory.deploy{value: 0}(salt, bytecode);
    }

    function test_deploy_reverts_on_duplicate_salt() public {
        bytes32 salt = bytes32(uint256(100));
        bytes memory bytecode = type(SimpleStorage).creationCode;

        factory.deploy{value: 0}(salt, bytecode);

        vm.expectRevert(Create2Factory.Create2DeployFailed.selector);
        factory.deploy{value: 0}(salt, bytecode);
    }

    function test_deploy_reverts_on_empty_bytecode() public {
        bytes32 salt = bytes32(uint256(101));
        bytes memory emptyBytecode = hex"";

        vm.expectRevert(Create2Factory.Create2DeployFailed.selector);
        factory.deploy{value: 0}(salt, emptyBytecode);
    }

    function test_deploy_forwards_eth_to_deployed_contract() public {
        bytes32 salt = bytes32(uint256(202));
        bytes memory bytecode = type(PayableInit).creationCode;
        uint256 sendValue = 0.01 ether;

        vm.deal(address(this), sendValue);
        address deployed = factory.deploy{value: sendValue}(salt, bytecode);

        assertEq(deployed.balance, sendValue);
    }

    function test_deploy_reverts_on_reentrancy() public {
        bytes32 outerSalt = bytes32(uint256(303));
        bytes32 innerSalt = bytes32(uint256(304));
        bytes memory innerBytecode = type(SimpleStorage).creationCode;

        bytes memory initCode =
            abi.encodePacked(type(ReentrantInit).creationCode, abi.encode(factory, innerSalt, innerBytecode));

        // Inner constructor hits `ReentrantCall`; CREATE2 init failure surfaces as `Create2DeployFailed`.
        vm.expectRevert(Create2Factory.Create2DeployFailed.selector);
        factory.deploy{value: 0}(outerSalt, initCode);
    }
}
