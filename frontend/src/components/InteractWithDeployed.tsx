import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import toast from 'react-hot-toast';
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
  const [txError, setTxError] = useState<string | null>(null);
  
  const { isConnected } = useAccount();

  // Read current value (retrieve)
  const { data: currentValue, refetch, isLoading: isReading } = useReadContract({
    address: contractAddress,
    abi: simpleStorageABI,
    functionName: 'retrieve',
  });

  // Write new value (store)
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  const handleStore = async () => {
    if (!value) return;
    setTxError(null);

    try {
      const hash = await writeContractAsync({
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
      const msg =
        error instanceof Error ? error.message : "Transaction failed.";
      setTxError(msg);
      toast.error(msg);
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
    <div className="p-6 bg-[rgba(12,12,18,0.45)]">
      {/* Contract Address */}
      <div className="mb-6 p-4 rounded-2xl border border-white/10 bg-white/5">
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
      <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10">
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
        <label
          className="block text-sm font-medium text-gray-300 mb-2"
          htmlFor="interact-set-value"
        >
          Set New Value:
        </label>
        <div className="flex gap-3">
          <input
            id="interact-set-value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter number"
            disabled={!isConnected || isLoading}
            className="flex-1 p-4 bg-black/25 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleStore}
            disabled={!isConnected || !value || isLoading}
            className="px-8 py-4 rs-btn-primary rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳' : 'Store'}
          </button>
        </div>
        
        {!isConnected && (
          <p className="text-sm text-yellow-500 mt-3">
            ⚠️ Connect wallet to interact
          </p>
        )}

        {txError && (
          <p className="text-sm text-red-400 mt-3 break-words" role="alert">
            {txError}
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