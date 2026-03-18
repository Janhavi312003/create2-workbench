// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Create2Factory is ReentrancyGuard {
    event Deployed(address indexed deployed, bytes32 indexed salt);

    // Use assembly (fixes asm-keccak256 lint)
    function computeAddress(bytes32 salt, bytes memory bytecode)
        public
        view
        returns (address)
    {
        bytes32 initCodeHash;
        assembly {
            initCodeHash := keccak256(add(bytecode, 0x20), mload(bytecode))
        }

        return computeAddress(salt, initCodeHash);
    }

    function computeAddress(bytes32 salt, bytes32 initCodeHash)
        public
        view
        returns (address addr)
    {
        assembly {
            let ptr := mload(0x40)

            // Layout per EIP-1014:
            // keccak256(0xff ++ deployingAddress ++ salt ++ initCodeHash)
            mstore8(ptr, 0xff)
            mstore(add(ptr, 0x01), shl(96, address()))
            mstore(add(ptr, 0x15), salt)
            mstore(add(ptr, 0x35), initCodeHash)

            addr := and(
                keccak256(ptr, 0x55),
                0xffffffffffffffffffffffffffffffffffffffff
            )
        }
    }

    function deploy(bytes32 salt, bytes memory bytecode)
        public
        payable
        nonReentrant
        returns (address deployedAddress)
    {
        assembly {
            deployedAddress := create2(
                callvalue(),
                add(bytecode, 0x20),
                mload(bytecode),
                salt
            )

            if iszero(extcodesize(deployedAddress)) {
                revert(0, 0)
            }
        }

        emit Deployed(deployedAddress, salt);
    }

    receive() external payable {}
}
