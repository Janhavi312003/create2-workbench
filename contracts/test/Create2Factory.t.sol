// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {Create2Factory} from "../src/Create2Factory.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

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
}
