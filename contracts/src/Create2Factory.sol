// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @dev Minimal reentrancy guard (avoids external submodule dependency for reproducible builds).
abstract contract ReentrancyGuardLocal {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status = _NOT_ENTERED;

    error ReentrantCall();

    modifier nonReentrant() {
        if (_status == _ENTERED) revert ReentrantCall();
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract Create2Factory is ReentrancyGuardLocal {
    event Deployed(address indexed deployed, bytes32 indexed salt);

    error Create2DeployFailed();

    // Use assembly (fixes asm-keccak256 lint)
    function computeAddress(bytes32 salt, bytes memory bytecode) public view returns (address) {
        bytes32 initCodeHash;
        assembly {
            initCodeHash := keccak256(add(bytecode, 0x20), mload(bytecode))
        }

        return computeAddress(salt, initCodeHash);
    }

    function computeAddress(bytes32 salt, bytes32 initCodeHash) public view returns (address addr) {
        assembly {
            let ptr := mload(0x40)

            // Layout per EIP-1014:
            // keccak256(0xff ++ deployingAddress ++ salt ++ initCodeHash)
            mstore8(ptr, 0xff)
            mstore(add(ptr, 0x01), shl(96, address()))
            mstore(add(ptr, 0x15), salt)
            mstore(add(ptr, 0x35), initCodeHash)

            addr := and(keccak256(ptr, 0x55), 0xffffffffffffffffffffffffffffffffffffffff)
        }
    }

    function deploy(bytes32 salt, bytes memory bytecode) public payable nonReentrant returns (address deployedAddress) {
        assembly {
            deployedAddress := create2(callvalue(), add(bytecode, 0x20), mload(bytecode), salt)
        }

        if (deployedAddress == address(0)) {
            revert Create2DeployFailed();
        }

        uint256 size;
        assembly {
            size := extcodesize(deployedAddress)
        }
        if (size == 0) {
            revert Create2DeployFailed();
        }

        emit Deployed(deployedAddress, salt);
    }
}
