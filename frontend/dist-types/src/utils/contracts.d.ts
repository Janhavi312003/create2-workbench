import { simpleStorageAbi } from "../abi/simpleStorageAbi";
export declare const factoryConfig: {
    readonly address: `0x${string}` | undefined;
    readonly abi: readonly [{
        readonly type: "function";
        readonly name: "computeAddress";
        readonly stateMutability: "view";
        readonly inputs: readonly [{
            readonly name: "salt";
            readonly type: "bytes32";
        }, {
            readonly name: "bytecode";
            readonly type: "bytes";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly type: "function";
        readonly name: "computeAddress";
        readonly stateMutability: "view";
        readonly inputs: readonly [{
            readonly name: "salt";
            readonly type: "bytes32";
        }, {
            readonly name: "initCodeHash";
            readonly type: "bytes32";
        }];
        readonly outputs: readonly [{
            readonly name: "";
            readonly type: "address";
        }];
    }, {
        readonly type: "function";
        readonly name: "deploy";
        readonly stateMutability: "payable";
        readonly inputs: readonly [{
            readonly name: "salt";
            readonly type: "bytes32";
        }, {
            readonly name: "bytecode";
            readonly type: "bytes";
        }];
        readonly outputs: readonly [{
            readonly name: "deployedAddress";
            readonly type: "address";
        }];
    }, {
        readonly type: "event";
        readonly name: "Deployed";
        readonly inputs: readonly [{
            readonly name: "deployed";
            readonly type: "address";
            readonly indexed: true;
        }, {
            readonly name: "salt";
            readonly type: "bytes32";
            readonly indexed: true;
        }];
    }, {
        readonly type: "error";
        readonly name: "Create2DeployFailed";
        readonly inputs: readonly [];
    }, {
        readonly type: "error";
        readonly name: "ReentrantCall";
        readonly inputs: readonly [];
    }];
};
export { simpleStorageAbi, simpleStorageAbi as simpleStorageABI };
