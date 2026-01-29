// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Create2Factory is ReentrancyGuard {
    event Deployed(address indexed proxy, bytes32 indexed salt, address indexed implementation);

    function computeAddress(bytes32 salt, bytes memory bytecode) public view returns (address) {
        bytes32 initCodeHash = keccak256(bytecode);
        return computeAddress(salt, initCodeHash);
    }

    function computeAddress(bytes32 salt, bytes32 initCodeHash) public view returns (address addr) {
    assembly {
        let ptr := mload(0x40)
        mstore(add(ptr, 0x40), initCodeHash)
        mstore(add(ptr, 0x20), salt)
        mstore(ptr, address())
        let start := add(ptr, 0x0b)
        mstore8(start, 0xff)
        addr := and(keccak256(start, 85), 0xffffffffffffffffffffffffffffffffffffffff)
    }
}

    function deploy(bytes32 salt, bytes memory bytecode) 
        public payable nonReentrant returns (address deployedAddress) 
    {
        assembly {
            deployedAddress := create2(callvalue(), add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(deployedAddress)) { revert(0, 0) }
        }
        emit Deployed(deployedAddress, salt, deployedAddress);
    }

    receive() external payable {}
}
