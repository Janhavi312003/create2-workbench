export declare const factoryConfig: {
    address: `0x${string}`;
    abi: ({
        type: string;
        stateMutability: string;
        name?: undefined;
        inputs?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            indexed: boolean;
            internalType: string;
        }[];
        anonymous: boolean;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        name: string;
        inputs: never[];
        stateMutability?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
    })[];
};
export declare const simpleStorageABI: ({
    type: string;
    name: string;
    inputs: never[];
    outputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        internalType: string;
    }[];
    outputs: never[];
    stateMutability: string;
    anonymous?: undefined;
} | {
    type: string;
    name: string;
    inputs: {
        name: string;
        type: string;
        indexed: boolean;
        internalType: string;
    }[];
    anonymous: boolean;
    outputs?: undefined;
    stateMutability?: undefined;
})[];
