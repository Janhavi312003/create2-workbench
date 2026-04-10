import { useState, useRef, useEffect } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "./Providers";
import {
  isValidAddress,
  isValidHex,
  isValidHexPrefixLoose,
} from "../utils/create2";
import { factoryConfig } from "../utils/contracts";
import {
  exampleContracts,
  SIMPLE_STORAGE_INIT_CODE_HASH,
} from "../utils/exampleContracts";
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
import { BsHourglassSplit } from "react-icons/bs";

interface FindSaltModeProps {
  onDeploySuccess?: (address: `0x${string}`) => void;
}

export default function FindSaltMode({ onDeploySuccess }: FindSaltModeProps) {
  const envFactory = factoryConfig.address;
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Form states
  const [deployerAddress, setDeployerAddress] = useState<string>(
    envFactory ?? "",
  );
  const [initCodeHash, setInitCodeHash] = useState<string>(
    SIMPLE_STORAGE_INIT_CODE_HASH,
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
    if (!prefix.trim() || !isValidHexPrefixLoose(prefix)) {
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

    const rand = new Uint8Array(16);
    crypto.getRandomValues(rand);
    const startNonceHex =
      "0x" +
      [...rand].map((b) => b.toString(16).padStart(2, "0")).join("");
    const startNonce = BigInt(startNonceHex).toString();

    workerRef.current.postMessage({
      type: "run",
      payload: {
        deployerAddress,
        initCodeHash,
        prefix,
        startNonce,
        maxIterations: 1000000,
      },
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
    workerRef.current?.postMessage({ type: "cancel" });
    workerRef.current?.terminate();
    workerRef.current = null;
    setIsSearching(false);
    setStatusMessage("⏸️ Search stopped");
  };

  const resetForm = () => {
    setDeployerAddress(envFactory ?? "");
    setInitCodeHash(SIMPLE_STORAGE_INIT_CODE_HASH);
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
        args: [foundSalt as `0x${string}`, bytecode as `0x${string}`],
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
    setBytecode(exampleContracts.simpleStorage.bytecode);
  };

  const isLoading = isWritePending || isTxLoading;

  return (
    <div className="rs-panel-strong p-8">
      <div className="rs-wb-head">
        <div className="rs-wb-icon" aria-hidden>
          <FaSearch className="text-lg" />
        </div>
        <div>
          <h2 className="rs-wb-title">Find salt</h2>
          <p className="rs-wb-desc">
            Search for a salt so the CREATE2 address matches your hex prefix.
          </p>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="rs-wb-callout mb-6">
          <p className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <FaInfoCircle className="shrink-0 text-[#FF6600]" aria-hidden />
            Connect a wallet to deploy after you find a salt.
          </p>
        </div>
      )}

      {!envFactory && (
        <div
          className="mb-6 p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10"
          role="status"
        >
          <p className="text-amber-100 text-sm leading-relaxed">
            No <code className="font-mono text-amber-200">VITE_FACTORY_ADDRESS</code>{" "}
            in <code className="font-mono text-amber-200">.env</code>. Paste your
            deployed Create2 factory address above (the app does not assume a
            testnet default).
          </p>
        </div>
      )}

      {/* Difficulty Indicator */}
      {prefix &&
        prefix.startsWith("0x") &&
        prefix.length > 2 &&
        !error &&
        !foundSalt && (
          <div className="rs-wb-callout mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                <FaTachometerAlt className="text-[#FF6600]" aria-hidden />
                <span>Search space (approx.)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white">
                  ~{prefixDifficulty}
                </span>
                <span className="rs-wb-badge">{prefix.length - 2} hex chars</span>
              </div>
            </div>
          </div>
        )}

      <div className="rs-panel mb-8 space-y-5 p-5 sm:p-6">
        <div>
          <label className="rs-wb-label">
            Factory address{" "}
            <span className="rs-wb-badge">CREATE2 deployer</span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
            disabled={isSearching}
            className="rs-wb-input-mono disabled:opacity-60"
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label className="rs-wb-label mb-0">
              Init code hash <span className="rs-wb-badge">bytes32</span>
            </label>
            <button
              type="button"
              onClick={handleCopyHash}
              className="text-xs font-medium text-[#a0a0a0] hover:text-[#FF6600] flex items-center gap-1"
            >
              {copiedHash ? <FaCheck /> : <FaCopy />}
              {copiedHash ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="0x…"
              value={initCodeHash}
              onChange={(e) => setInitCodeHash(e.target.value)}
              disabled={isSearching}
              className="rs-wb-input-mono pr-20 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setInitCodeHash(SIMPLE_STORAGE_INIT_CODE_HASH)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-[#a0a0a0] hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <label className="rs-wb-label">Address prefix</label>
          <input
            type="text"
            placeholder="0x0000"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={isSearching}
            className="rs-wb-input-mono disabled:opacity-60"
          />
        </div>
      </div>

      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={isSearching ? stopSearch : startSearch}
          disabled={!deployerAddress || !initCodeHash || !prefix}
          className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
            isSearching
              ? "border-red-500/40 bg-red-950/40 text-red-200 hover:bg-red-950/60"
              : "rs-wb-btn-accent disabled:cursor-not-allowed disabled:opacity-40"
          }`}
        >
          {isSearching ? (
            <>
              <FaStop aria-hidden />
              Stop
            </>
          ) : (
            <>
              <FaSearch aria-hidden />
              Search
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetForm}
          disabled={isSearching}
          className="rs-wb-btn-ghost min-h-[44px] px-4 disabled:cursor-not-allowed disabled:opacity-50"
          title="Reset"
          aria-label="Reset form"
        >
          <FaTrash />
        </button>
      </div>

      {/* Progress & Stats */}
      {isSearching && (
        <div className="rs-wb-output">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
              <BsHourglassSplit className="animate-pulse text-[#FF6600]" aria-hidden />
              Searching…
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#a0a0a0]">
              <span>
                Speed:{" "}
                <span className="font-mono text-white">
                  {searchSpeed.toLocaleString()}
                </span>
                /s
              </span>
              {estimatedTime && (
                <span>
                  ETA:{" "}
                  <span className="font-mono text-white">{estimatedTime}</span>
                </span>
              )}
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full border border-[#2a2a2a] bg-black/50">
            <div
              className="h-full rounded-full bg-[#FF6600] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-center text-xs text-[#a0a0a0]">
            Tried {iterations.toLocaleString()} salts
          </p>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && !foundSalt && (
        <div className="rs-wb-callout mt-6 border-amber-500/20">
          <div className="flex items-start gap-2 text-sm text-[#a0a0a0]">
            <FaInfoCircle className="mt-0.5 shrink-0 text-amber-500/90" aria-hidden />
            {statusMessage}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rs-wb-callout mt-6 max-w-full border-red-500/35">
          <div className="flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-400" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-200 break-words">
                {error}
              </p>

              {errorDetails && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-red-300/90 hover:text-red-200">
                    Technical details
                  </summary>
                  <pre className="rs-wb-code mt-2 max-w-full overflow-x-auto border-red-500/20 bg-black/40 p-3 text-xs text-red-100/90">
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
        <div className="rs-wb-output mt-8">
          <div className="rs-wb-head mb-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-950/30 text-lg text-emerald-400"
              aria-hidden
            >
              ✓
            </div>
            <div>
              <h3 className="rs-wb-title">Match found</h3>
              <p className="rs-wb-desc">
                {iterations.toLocaleString()} iterations — deploy with the salt
                and bytecode below.
              </p>
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0a0]">
                Factory
              </span>
              <code className="rs-wb-code mt-1 block text-[#FF6600]">
                {deployerAddress}
              </code>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0a0]">
                Salt
              </span>
              <code className="rs-wb-code mt-1 block">{foundSalt}</code>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0a0]">
                Address
              </span>
              <code className="rs-wb-code mt-1 block">{foundAddress}</code>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="rs-wb-label mb-0 flex items-center gap-2">
                <FaCode aria-hidden />
                Bytecode
              </label>
              <button
                type="button"
                onClick={getSimpleStorageBytecode}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-[#a0a0a0] hover:text-[#FF6600]"
              >
                Load SimpleStorage example
              </button>
            </div>

            <textarea
              value={bytecode}
              onChange={(e) => setBytecode(e.target.value)}
              placeholder="0x6080…"
              className="rs-wb-input-mono min-h-[7rem] resize-y"
              rows={5}
            />

            <p className="mt-2 text-xs text-[#a0a0a0]">
              From{" "}
              <code className="font-mono text-white/80">
                forge inspect &lt;Contract&gt; bytecode
              </code>
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <select
              value={selectedExample}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedExample(next);
                loadExampleBytecode(next);
              }}
              className="rs-wb-input-mono max-w-full py-2 text-sm"
            >
              <option value="">Example contract…</option>
              {Object.entries(exampleContracts).map(
                ([key, { name, description }]) => (
                  <option key={key} value={key}>
                    {name} — {description}
                  </option>
                ),
              )}
            </select>
            <a
              href="https://remix.ethereum.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="rs-wb-btn-ghost text-xs"
            >
              <FaExternalLinkAlt aria-hidden /> Remix
            </a>
          </div>

          <button
            type="button"
            onClick={handleDeploy}
            disabled={!isConnected || !bytecode || isLoading || isDeploySuccess}
            className="rs-wb-btn-accent mb-6 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!isConnected && (
              <>
                <FaInfoCircle aria-hidden />
                Connect wallet
              </>
            )}
            {isConnected && deployStep === "idle" && !isDeploySuccess && (
              <>
                <FaRocket aria-hidden />
                Deploy
              </>
            )}
            {isConnected && deployStep === "preparing" && (
              <>Preparing…</>
            )}
            {isConnected && deployStep === "deploying" && (
              <>Deploying…</>
            )}
            {isConnected && isDeploySuccess && (
              <>
                <FaCheck aria-hidden />
                Done
              </>
            )}
          </button>

          {/* Transaction Status */}
          {txHash && (
            <div className="rs-wb-callout mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#a0a0a0]">
                Transaction
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="rs-wb-code flex-1 min-w-0 text-[13px]">
                  {txHash}
                </code>
                <a
                  href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rs-wb-btn-ghost shrink-0 py-2 text-xs"
                >
                  <FaExternalLinkAlt aria-hidden /> Explorer
                </a>
              </div>
            </div>
          )}

          {isDeploySuccess && (
            <div className="rs-wb-callout mb-6 border-emerald-500/25">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <FaCheck className="text-emerald-400" aria-hidden />
                Deployed — address matches prediction.
              </p>
              <p className="mt-2 text-sm text-[#a0a0a0]">
                You can call <code className="font-mono text-xs">store</code> /{" "}
                <code className="font-mono text-xs">retrieve</code> on the
                contract.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopySalt}
              className="rs-wb-btn-ghost flex-1 min-w-[120px] py-2.5 text-sm"
            >
              {copiedSalt ? <FaCheck /> : <FaCopy />}
              Copy salt
            </button>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="rs-wb-btn-ghost flex-1 min-w-[120px] py-2.5 text-sm"
            >
              {copiedAddress ? <FaCheck /> : <FaCopy />}
              Copy address
            </button>
          </div>

          <details className="rs-wb-callout mt-4 group">
            <summary className="cursor-pointer list-none text-sm font-medium text-[#a0a0a0] marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2">
                <FaInfoCircle className="text-[#FF6600]" aria-hidden />
                How to get bytecode
              </span>
            </summary>
            <div className="mt-3 space-y-3 border-t border-[#2a2a2a] pt-3 text-sm text-[#a0a0a0]">
              <p>
                <a
                  href="https://remix.ethereum.org"
                  className="text-[#FF6600] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Remix
                </a>
                : compile → copy bytecode object.
              </p>
              <p className="font-mono text-xs text-white/85">
                forge inspect YourContract bytecode
              </p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
