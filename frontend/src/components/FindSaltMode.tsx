import { useState, useRef, useEffect } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "./Providers";
import { isValidAddress } from "../utils/create2";
import { factoryConfig } from "../utils/contracts";
import {
  FaSearch,
  FaStop,
  FaCopy,
  FaCheck,
  FaRocket,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTachometerAlt,
  FaTrash,
  FaCode,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { BsLightningCharge, BsHourglassSplit } from "react-icons/bs";
import { exampleContracts } from "../utils/exampleContracts";

const isValidHex = (value: string): boolean => {
  if (!value.startsWith("0x")) return false;
  const hexPart = value.slice(2);
  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(hexPart)) return false;
  if (hexPart.length % 2 !== 0) return false;
  return true;
};

const isValidHexPrefix = (value: string): boolean => {
  if (!value.startsWith("0x")) return false;
  const hexPart = value.slice(2);
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(hexPart);
};

interface FindSaltModeProps {
  onDeploySuccess?: (address: `0x${string}`) => void;
}

export default function FindSaltMode({ onDeploySuccess }: FindSaltModeProps) {
  const factoryAddress = factoryConfig.address;
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Form states
  const [deployerAddress, setDeployerAddress] = useState<string>(factoryAddress);
  const [initCodeHash, setInitCodeHash] = useState(
    "0x8f0ef1f921db5807d80fd113060720b50e76aa0123aeef09682060439f5b8d5e",
  );
  const [prefix, setPrefix] = useState("0x0000");
  const [bytecode, setBytecode] = useState("");

  // Mining states
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [foundSalt, setFoundSalt] = useState("");
  const [foundAddress, setFoundAddress] = useState("");
  const [iterations, setIterations] = useState(0);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState("");

  // Copy states
  const [copiedSalt, setCopiedSalt] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Performance states
  const [searchSpeed, setSearchSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [prefixDifficulty, setPrefixDifficulty] = useState<string>("");

  // Deployment states
  const [deployStep, setDeployStep] = useState<
    "idle" | "preparing" | "deploying" | "success"
  >("idle");
  const [showDeploy, setShowDeploy] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [isDeploySuccess, setIsDeploySuccess] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  // Add state
  const [selectedExample, setSelectedExample] = useState("");

  // Handler
  const loadExampleBytecode = (key: string) => {
    if (key && exampleContracts[key as keyof typeof exampleContracts]) {
      setBytecode(
        exampleContracts[key as keyof typeof exampleContracts].bytecode,
      );
    }
  };

  // Wagmi v2 hooks
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Calculate prefix difficulty
  useEffect(() => {
    if (prefix && prefix.startsWith("0x")) {
      const prefixLength = prefix.length - 2; // Remove '0x'
      const difficulty = Math.pow(16, prefixLength);
      if (difficulty > 1000000) {
        setPrefixDifficulty(`${(difficulty / 1000000).toFixed(1)}M`);
      } else if (difficulty > 1000) {
        setPrefixDifficulty(`${(difficulty / 1000).toFixed(1)}K`);
      } else {
        setPrefixDifficulty(difficulty.toString());
      }
    }
  }, [prefix]);

  // Listen for hash copied from InitCodeHelper
  useEffect(() => {
    const handleHashCopied = (event: CustomEvent) => {
      setInitCodeHash(event.detail);
    };
    window.addEventListener("hashCopied" as any, handleHashCopied);
    return () =>
      window.removeEventListener("hashCopied" as any, handleHashCopied);
  }, []);

  const startSearch = () => {
    setError("");
    setFoundSalt("");
    setFoundAddress("");
    setProgress(0);
    setIterations(0);
    setStatusMessage("");
    setShowDeploy(false);
    setCopiedSalt(false);
    setCopiedAddress(false);
    startTimeRef.current = Date.now();

    if (!deployerAddress.trim()) {
      setError("Deployer address is required");
      return;
    }

    if (!isValidAddress(deployerAddress)) {
      setError("Invalid deployer (factory) address");
      return;
    }

    if (!initCodeHash.trim()) {
      setError("Init code hash is required");
      return;
    }

    if (!isValidHex(initCodeHash) || initCodeHash.length !== 66) {
      setError("Init code hash must be valid 0x hex (exactly 66 chars)");
      return;
    }
    if (!prefix.trim() || !isValidHexPrefix(prefix)) {
      setError("Prefix must be a valid hex value starting with 0x");
      return;
    }

    setIsSearching(true);
    setStatusMessage("Searching for matching salt...");

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    workerRef.current = new Worker(
      new URL("../workers/saltMiner.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.postMessage({
      deployerAddress,
      initCodeHash,
      prefix,
      startNonce: 0,
      maxIterations: 1000000,
    });

    workerRef.current.onmessage = (e) => {
      const {
        type,
        salt,
        address,
        iterations: iter,
        current,
        total,
        message,
      } = e.data;

      if (type === "found") {
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const speed = Math.round(iter / timeElapsed);
        setSearchSpeed(speed);

        setFoundSalt(salt);
        setFoundAddress(address);
        setIterations(iter);
        setIsSearching(false);
        setShowDeploy(true);
        setStatusMessage(
          `✨ Found match in ${iter.toLocaleString()} iterations! (${speed.toLocaleString()} salts/sec)`,
        );
        workerRef.current?.terminate();
      } else if (type === "progress") {
        setProgress(Math.round((current / total) * 100));
        setIterations(current);

        // Calculate speed and ETA
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const speed = Math.round(current / timeElapsed);
        setSearchSpeed(speed);

        if (speed > 0) {
          const remainingIterations = total - current;
          const etaSeconds = remainingIterations / speed;
          if (etaSeconds > 60) {
            setEstimatedTime(
              `${Math.round(etaSeconds / 60)}m ${Math.round(etaSeconds % 60)}s`,
            );
          } else {
            setEstimatedTime(`${Math.round(etaSeconds)}s`);
          }
        }
      } else if (type === "complete") {
        setIsSearching(false);
        setStatusMessage(
          message || "No match found in 1M iterations. Try a shorter prefix.",
        );
        workerRef.current?.terminate();
      } else if (type === "error") {
        setError(message);
        setIsSearching(false);
        workerRef.current?.terminate();
      }
    };

    workerRef.current.onerror = () => {
      setError("Worker failed. Refresh and try again.");
      setIsSearching(false);
      workerRef.current?.terminate();
    };
  };

  const stopSearch = () => {
    workerRef.current?.terminate();
    setIsSearching(false);
    setStatusMessage("⏸️ Search stopped");
  };

  const resetForm = () => {
    setDeployerAddress(factoryAddress);
    setInitCodeHash(
      "0x8f0ef1f921db5807d80fd113060720b50e76aa0123aeef09682060439f5b8d5e",
    );
    setPrefix("0x0000");
    setBytecode("");
    setError("");
    setFoundSalt("");
    setFoundAddress("");
    setProgress(0);
    setIterations(0);
    setStatusMessage("");
    setShowDeploy(false);
    setTxHash(undefined);
    setIsDeploySuccess(false);
  };

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleCopySalt = () => {
    navigator.clipboard.writeText(foundSalt);
    setCopiedSalt(true);
    setTimeout(() => setCopiedSalt(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(foundAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(initCodeHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first!");
      setErrorDetails("");
      return;
    }

    if (!foundSalt) {
      setError("No salt found yet. Mine a salt first!");
      setErrorDetails("");
      return;
    }

    if (!bytecode) {
      setError("Please paste your contract bytecode!");
      setErrorDetails("");
      return;
    }

    if (!bytecode.startsWith("0x")) {
      setError("Bytecode must start with 0x");
      setErrorDetails("");
      return;
    }

    setDeployStep("preparing");
    setError("");
    setErrorDetails("");
    setTxHash(undefined);
    setIsDeploySuccess(false);

    try {
      const expectedChainId = Number(import.meta.env.VITE_PUBLIC_CHAIN_ID || 31);
      if (Number.isFinite(expectedChainId) && chainId !== expectedChainId) {
        setError(
          `Wrong network. Please switch your wallet to Rootstock Testnet (chainId ${expectedChainId}).`,
        );
        setErrorDetails(`Connected chainId: ${chainId}`);
        setDeployStep("idle");
        return;
      }

      // 1. Write the contract (deploy)
      const hash = await writeContractAsync({
        address: deployerAddress as `0x${string}`,
        abi: factoryConfig.abi,
        functionName: "deploy",
        args: [foundSalt, bytecode],
      });

      setTxHash(hash);
      setDeployStep("deploying");
      setIsTxLoading(true);

      // 2. Wait for transaction receipt
      const receipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 1,
      });

      if (receipt) {
        setIsDeploySuccess(true);
        setDeployStep("success");
        if (onDeploySuccess && foundAddress) {
          onDeploySuccess(foundAddress as `0x${string}`);
        }
      }
    } catch (err) {
      console.error("Deployment error:", err);
      const raw =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);

      // Short, user-friendly message + keep raw in details.
      const lower = raw.toLowerCase();
      if (
        lower.includes("rpc endpoint returned too many errors") ||
        lower.includes("too many errors")
      ) {
        setError(
          "RPC is overloaded/unreliable right now. Please try again or change the RPC URL in your frontend .env.",
        );
      } else if (lower.includes("requested resource not available")) {
        setError(
          "RPC provider rejected the request. This is usually a temporary RPC issue or a network mismatch. Try changing RPC or switching network.",
        );
      } else {
        setError("Deployment failed. Open details for the full error.");
      }

      // Prevent the UI from dumping massive calldata/bytecode.
      const trimmed = raw
        .replace(/data:\s*0x[0-9a-fA-F]+/g, "data: <redacted>")
        .replace(/bytecode\)\s*args:\s*\([^)]*\)/g, "bytecode) args: (<redacted>)");

      setErrorDetails(trimmed);
      setDeployStep("idle");
    } finally {
      setIsTxLoading(false);
    }
  };

  // Get bytecode from SimpleStorage (like GetInfo.s.sol)
  const getSimpleStorageBytecode = () => {
    // This is the bytecode from compiled SimpleStorage
    setBytecode(
      "0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632e64cec114602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60008054905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea2646970667358221220123456789abcdef",
    );
  };

  const isLoading = isWritePending || isTxLoading;

  return (
    <div className="rs-panel-strong p-8">
      {/* Header */}
      <div className="flex items-center mb-6 group">
        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-2xl font-black text-white drop-shadow-lg">
            <FaSearch />
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
            Find Vanity Salt
          </h2>
          <p className="text-orange-300/80 text-lg font-medium flex items-center gap-2">
            <BsLightningCharge className="text-yellow-500" />
            Generate a salt for your desired contract address prefix
          </p>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
          <p className="text-blue-300 flex items-center gap-2">
            <FaInfoCircle />
            Connect wallet to deploy contracts after finding a salt
          </p>
        </div>
      )}

      {/* Difficulty Indicator */}
      {prefix &&
        prefix.startsWith("0x") &&
        prefix.length > 2 &&
        !error &&
        !foundSalt && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaTachometerAlt className="text-purple-400" />
                <span className="text-purple-300 font-medium">
                  Search Difficulty:
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-mono font-bold">
                  {prefixDifficulty} possible combinations
                </span>
                <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                  {prefix.length - 2} chars
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Main Form */}
      <div className="space-y-6 rs-panel p-7 mb-8">
        <div>
          <label className="text-sm font-bold text-orange-300 mb-3 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center border border-orange-500/30">
            Factory Address
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono ml-2">
              VITE_FACTORY_ADDRESS
            </span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
            disabled={isSearching}
            className="w-full p-5 rounded-2xl border-2 border-white/10 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/20 font-mono text-lg bg-black/30 backdrop-blur-sm text-white placeholder-white/40 disabled:bg-black/20 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:border-white/15"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-orange-300 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center border border-orange-500/30">
              Init Code Hash
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono ml-2">
                from Init Code Helper
              </span>
            </label>
            <button
              onClick={handleCopyHash}
              className="text-xs text-gray-400 hover:text-orange-400 flex items-center gap-1"
            >
              {copiedHash ? <FaCheck /> : <FaCopy />}
              {copiedHash ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
              value={initCodeHash}
              onChange={(e) => setInitCodeHash(e.target.value)}
              disabled={isSearching}
              className="w-full p-5 rounded-2xl border-2 border-white/10 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/20 font-mono text-lg bg-black/30 backdrop-blur-sm text-white placeholder-white/40 disabled:bg-black/20 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:border-white/15 pr-24"
            />
            <button
              onClick={() =>
                setInitCodeHash(
                  "0x8f0ef1f921db5807d80fd113060720b50e76aa0123aeef09682060439f5b8d5e",
                )
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-700 rounded-lg text-xs text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-orange-300 mb-3 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center border border-orange-500/30">
            Desired Prefix
          </label>
          <input
            type="text"
            placeholder="0x0000beef"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={isSearching}
            className="w-full p-5 rounded-2xl border-2 border-white/10 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/20 font-mono text-lg bg-black/30 backdrop-blur-sm text-white placeholder-white/40 disabled:bg-black/20 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:border-white/15"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={isSearching ? stopSearch : startSearch}
          disabled={!deployerAddress || !initCodeHash || !prefix}
          className={`flex-1 py-6 rounded-3xl font-black text-xl shadow-2xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border-2 flex items-center justify-center gap-3 ${
            isSearching
              ? "bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white hover:from-red-700/90 hover:to-orange-700/90 border-red-500/50 shadow-red-500/30"
              : "bg-gradient-to-r from-orange-500/90 via-yellow-500/80 to-orange-600/90 text-white hover:from-orange-600/100 hover:via-yellow-600/90 hover:to-orange-700/100 border-orange-500/60 shadow-orange-500/50 disabled:from-gray-800/50 disabled:to-gray-900/50 disabled:shadow-none disabled:cursor-not-allowed disabled:text-gray-500"
          }`}
        >
          {isSearching ? (
            <>
              <FaStop />
              Stop Mining
            </>
          ) : (
            <>
              <FaSearch />
              Start Search
            </>
          )}
        </button>

        <button
          onClick={resetForm}
          disabled={isSearching}
          className="px-6 py-6 rounded-3xl bg-gray-800/50 text-gray-300 font-black text-xl hover:bg-gray-700/50 shadow-xl border border-gray-700 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset to defaults"
        >
          <FaTrash />
        </button>
      </div>

      {/* Progress & Stats */}
      {isSearching && (
        <div className="mt-6 p-6 bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-orange-500/30 shadow-2xl shadow-orange-500/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BsHourglassSplit className="text-orange-400 animate-pulse" />
              <span className="text-orange-300 font-medium">Searching...</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Speed:{" "}
                <span className="text-orange-400 font-mono font-bold">
                  {searchSpeed.toLocaleString()}
                </span>{" "}
                salts/sec
              </span>
              {estimatedTime && (
                <span className="text-sm text-gray-400">
                  ETA:{" "}
                  <span className="text-yellow-400 font-mono">
                    {estimatedTime}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full bg-gray-800/50 rounded-2xl h-12 overflow-hidden shadow-inner border border-gray-700/50">
            <div
              className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 h-12 rounded-2xl shadow-xl flex items-center justify-end pr-6 transition-all duration-500 font-mono font-bold text-lg text-white drop-shadow-2xl"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>

          <div className="mt-3 text-center text-sm text-gray-400">
            Checked {iterations.toLocaleString()} salts
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && !foundSalt && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/40 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-yellow-400 text-xl" />
            <div className="text-yellow-200 font-medium">{statusMessage}</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-400/40 backdrop-blur-sm rounded-2xl shadow-xl max-w-full">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-red-200 font-medium break-words overflow-hidden">
                {error}
              </div>

              {errorDetails && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-red-300/90 hover:text-red-200 transition-colors">
                    Show technical details
                  </summary>
                  <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-red-400/20 bg-black/30 p-3 text-xs text-red-100/90">
                    {errorDetails}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Found Salt Section - Deployment UI */}
      {foundSalt && foundAddress && showDeploy && (
        <div className="mt-8 p-8 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-emerald-500/15 border-4 border-emerald-400/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/30 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 shadow-2xl shadow-emerald-500/50 animate-pulse">
              <span className="text-3xl font-black text-white drop-shadow-2xl">
                ✅
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight drop-shadow-2xl">
                VANITY ADDRESS FOUND!
              </h3>
              <p className="text-emerald-200 font-bold text-lg">
                Ready for Rootstock deployment • {iterations.toLocaleString()}{" "}
                iterations
              </p>
            </div>
          </div>

          {/* Display Info like TestCreate2.s.sol */}
          <div className="space-y-4 mb-8 p-6 bg-gray-900/60 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/40">
            <div>
              <span className="text-sm text-gray-400">Factory Address:</span>
              <p className="font-mono text-orange-400 break-all">
                {factoryAddress}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Salt:</span>
              <p className="font-mono text-orange-400 break-all">{foundSalt}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Predicted Address:</span>
              <p className="font-mono text-orange-400 break-all">
                {foundAddress}
              </p>
            </div>
          </div>

          {/* Bytecode Input Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                <FaCode />
                Contract Bytecode
              </label>
              <button
                onClick={getSimpleStorageBytecode}
                className="px-4 py-2 bg-gray-800 rounded-xl text-sm text-orange-400 hover:bg-gray-700 transition-colors border border-gray-700"
              >
                📋 Load SimpleStorage Example
              </button>
            </div>

            <textarea
              value={bytecode}
              onChange={(e) => setBytecode(e.target.value)}
              placeholder="0x608060405234801561001057600080fd5b50..."
              className="w-full p-5 bg-gray-800 border-2 border-gray-700 rounded-2xl text-white font-mono text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30 transition-all"
              rows={5}
            />

            <p className="text-xs text-gray-400 mt-2">
              ℹ️ Get bytecode from:{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">
                forge inspect SimpleStorage bytecode
              </code>
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <select
              value={selectedExample}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedExample(next);
                loadExampleBytecode(next);
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm"
            >
              <option value="">Load example contract...</option>
              {Object.entries(exampleContracts).map(
                ([key, { name, description }]) => (
                  <option key={key} value={key}>
                    {name} - {description}
                  </option>
                ),
              )}
            </select>
            <a
              href="https://remix.ethereum.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm flex items-center gap-2 hover:bg-blue-600/30 transition-colors"
            >
              <FaExternalLinkAlt /> Remix IDE
            </a>
          </div>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={!isConnected || !bytecode || isLoading || isDeploySuccess}
            className="w-full py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xl rounded-2xl hover:from-orange-600 hover:to-orange-700 shadow-2xl shadow-orange-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border border-orange-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            {!isConnected && (
              <>
                <FaInfoCircle />
                Connect Wallet to Deploy
              </>
            )}
            {isConnected && deployStep === "idle" && !isDeploySuccess && (
              <>
                <FaRocket />
                Deploy Contract (Gas Required)
              </>
            )}
            {isConnected && deployStep === "preparing" && (
              <>
                <span className="animate-spin">⏳</span>
                Preparing Transaction...
              </>
            )}
            {isConnected && deployStep === "deploying" && (
              <>
                <span className="animate-spin">📦</span>
                Deploying...
              </>
            )}
            {isConnected && isDeploySuccess && (
              <>
                <FaCheck />
                Deployed Successfully!
              </>
            )}
          </button>

          {/* Transaction Status */}
          {txHash && (
            <div className="mt-6 p-5 bg-gray-900/60 rounded-2xl border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-sm text-orange-400 bg-gray-800/80 p-3 rounded-xl truncate">
                  {txHash}
                </code>
                <a
                  href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gray-800 rounded-xl text-orange-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FaExternalLinkAlt />
                  View
                </a>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isDeploySuccess && (
            <div className="mt-6 p-6 bg-emerald-500/20 rounded-2xl border-2 border-emerald-500/50">
              <p className="text-emerald-400 font-bold text-xl flex items-center gap-3 mb-3">
                <FaCheck className="text-2xl" />✅ SUCCESS: Contract Deployed!
              </p>
              <p className="text-emerald-300">Address matches prediction ✓</p>
              <p className="text-sm text-gray-400 mt-3">
                You can now interact with your contract using the store() and
                retrieve() functions.
              </p>
            </div>
          )}

          {/* Copy Buttons for Salt/Address */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCopySalt}
              className="flex-1 py-4 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              {copiedSalt ? <FaCheck /> : <FaCopy />}
              Copy Salt
            </button>
            <button
              onClick={handleCopyAddress}
              className="flex-1 py-4 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              {copiedAddress ? <FaCheck /> : <FaCopy />}
              Copy Address
            </button>
          </div>

          {/* Bytecode Help Section */}
          <div className="mt-4 border border-gray-700 rounded-xl overflow-hidden">
            <details className="group">
              <summary className="flex items-center justify-between p-4 bg-gray-800/50 cursor-pointer hover:bg-gray-700/50 transition-colors">
                <span className="text-orange-300 font-medium flex items-center gap-2">
                  <FaInfoCircle />
                  How to get bytecode for your own contract?
                </span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="p-4 bg-gray-900/80 border-t border-gray-700 space-y-4">
                <div>
                  <h4 className="text-white font-bold mb-2">
                    🖥️ Using Remix (Browser)
                  </h4>
                  <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                    <li>
                      Open{" "}
                      <a
                        href="https://remix.ethereum.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:underline"
                      >
                        Remix IDE
                      </a>
                    </li>
                    <li>Create or import your Solidity contract</li>
                    <li>
                      Compile it (Ctrl+S or click the Solidity compiler tab)
                    </li>
                    <li>
                      Click the "Compilation Details" button (or find Bytecode
                      in the compiler tab)
                    </li>
                    <li>
                      Copy the{" "}
                      <code className="bg-gray-800 px-1 py-0.5 rounded">
                        object
                      </code>{" "}
                      field under <code>bytecode</code> (starts with 0x)
                    </li>
                    <li>Paste it here</li>
                  </ol>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">
                    ⚙️ Using Foundry (Local)
                  </h4>
                  <p className="text-sm text-gray-300 mb-1">
                    Run in your terminal:
                  </p>
                  <pre className="bg-gray-950 p-2 rounded text-xs text-orange-400 overflow-x-auto">
                    forge inspect YourContractName bytecode
                  </pre>
                  <p className="text-sm text-gray-300 mt-1">
                    Copy the output and paste it above.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
