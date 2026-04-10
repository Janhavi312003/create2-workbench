export declare function calculateCreate2Address(deployerAddress: string, salt: string, initCodeHash: string): string;
export declare function hashInitCode(bytecode: string): string;
export declare function isValidAddress(address: string): boolean;
/** Non-empty `0x` hex with even number of nibbles (at least one byte). */
export declare function isValidHex(s: string): boolean;
/** Prefix while typing — allows odd length after `0x`. */
export declare function isValidHexPrefixLoose(value: string): boolean;
