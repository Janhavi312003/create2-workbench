// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Create2Factory {
    event Deployed(address indexed addr, bytes32 indexed salt, address indexed deployer);

    /**
     * @dev Deploys a contract using CREATE2
     * @param salt The salt for deterministic address generation
     * @param bytecode The creation bytecode of the contract to deploy
     * @return addr The address of the deployed contract
     */
    function deploy(bytes32 salt, bytes memory bytecode) 
        external 
        payable 
        returns (address addr) 
    {
        require(bytecode.length > 0, "Bytecode cannot be empty");
        
        assembly {
            addr := create2(callvalue(), add(bytecode, 0x20), mload(bytecode), salt)
        }
        
        require(addr != address(0), "CREATE2: Failed to deploy contract");
        
        emit Deployed(addr, salt, msg.sender);
    }

    /**
     * @dev Computes the address where a contract will be deployed
     * @param salt The salt for deterministic address generation
     * @param initCodeHash The keccak256 hash of the contract bytecode
     * @return The predicted address
     */
    function computeAddress(bytes32 salt, bytes32 initCodeHash) 
        external 
        view 
        returns (address) 
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                initCodeHash
            )
        );
        return address(uint160(uint256(hash)));
    }

    /**
     * @dev Returns the bytecode hash of a given bytecode
     * @param bytecode The bytecode to hash
     * @return The keccak256 hash of the bytecode
     */
    function getBytecodeHash(bytes memory bytecode) 
        external 
        pure 
        returns (bytes32) 
    {
        return keccak256(bytecode);
    }
}
