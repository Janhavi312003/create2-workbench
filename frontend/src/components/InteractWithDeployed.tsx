import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from './Providers';
import { simpleStorageABI } from '../utils/contracts';
import { FaCopy, FaCheck, FaExternalLinkAlt, FaRedo } from 'react-icons/fa';

interface Props {
  contractAddress: `0x${string}`;
}

export function InteractWithDeployed({ contractAddress }: Props) {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { isConnected } = useAccount();

  // Read current value (retrieve)
  const { data: currentValue, refetch, isLoading: isReading } = useReadContract({
    address: contractAddress,
    abi: simpleStorageABI,
    functionName: 'retrieve',
  });

  // Write new value (store)
  const { writeContract, isPending: isWritePending } = useWriteContract();

  const handleStore = async () => {
    if (!value) return;
    
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi: simpleStorageABI,
        functionName: 'store',
        args: [BigInt(value)],
      });
      
      setTxHash(hash);
      setIsTxLoading(true);
      
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 1,
      });
      
      if (receipt) {
        setIsSuccess(true);
        refetch();
        setValue("");
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsTxLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = isWritePending || isTxLoading;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-6">
      {/* Contract Address */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Contract Address:</span>
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1"
          >
            {copied ? <FaCheck /> : <FaCopy />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="font-mono text-sm text-orange-400 break-all mt-1">
          {contractAddress}
        </p>
        <a 
          href={`https://explorer.testnet.rsk.co/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
        >
          <FaExternalLinkAlt size={10} />
          View on Explorer
        </a>
      </div>
      
      {/* Current Value */}
      <div className="mb-6 p-5 bg-gray-800/30 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-orange-300">Current Value</span>
          <button
            onClick={() => refetch()}
            disabled={isReading}
            className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1"
          >
            <FaRedo className={isReading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
        <p className="text-3xl font-mono text-orange-400 font-bold">
          {isReading ? '...' : currentValue?.toString() || '0'}
        </p>
      </div>

      {/* Set New Value */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Set New Value:
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter number"
            disabled={!isConnected || isLoading}
            className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/30 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleStore}
            disabled={!isConnected || !value || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
          >
            {isLoading ? '⏳' : 'Store'}
          </button>
        </div>
        
        {!isConnected && (
          <p className="text-sm text-yellow-500 mt-3">
            ⚠️ Connect wallet to interact
          </p>
        )}

        {isSuccess && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <FaCheck />
              Transaction successful!
            </p>
            {txHash && (
              <a 
                href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
              >
                <FaExternalLinkAlt size={10} />
                View Transaction
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}