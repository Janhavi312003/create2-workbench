import { useState, useEffect, useRef } from "react";
import {
  calculateCreate2Address,
  isValidAddress,
  isValidHex,
} from "../utils/create2";
import { FaCopy, FaCheck, FaExclamationTriangle, FaCalculator, FaTrash, FaHistory } from 'react-icons/fa';

type RecentCalc = {
  id: string;
  deployerAddress: string;
  salt: string;
  initCodeHash: string;
  result: string;
};

export default function CalculateMode() {
  const [deployerAddress, setDeployerAddress] = useState("");
  const [salt, setSalt] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  );
  const [initCodeHash, setInitCodeHash] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [recentCalculations, setRecentCalculations] = useState<RecentCalc[]>([]);
  const [validationErrors, setValidationErrors] = useState({
    deployer: "",
    salt: "",
    initCode: ""
  });
  const lastRecentKey = useRef<string>("");

  // Load factory address from env only (no silent on-chain fallback).
  useEffect(() => {
    const fromEnv = import.meta.env.VITE_FACTORY_ADDRESS?.trim() ?? "";
    setDeployerAddress(fromEnv);
  }, []);

  // Listen for hash copied from InitCodeHelper
  useEffect(() => {
    const handleHashCopied = (event: CustomEvent) => {
      setInitCodeHash(event.detail);
    };
    window.addEventListener('hashCopied' as any, handleHashCopied);
    return () => window.removeEventListener('hashCopied' as any, handleHashCopied);
  }, []);

  // Validate inputs in real-time
  useEffect(() => {
    const errors = {
      deployer: "",
      salt: "",
      initCode: ""
    };

    if (deployerAddress && !isValidAddress(deployerAddress)) {
      errors.deployer = "Invalid address format";
    }

    if (salt && !isValidHex(salt)) {
      errors.salt = "Invalid hex format";
    }

    if (initCodeHash && (!isValidHex(initCodeHash) || initCodeHash.length !== 66)) {
      errors.initCode = "Must be 32 bytes (66 chars with 0x)";
    }

    setValidationErrors(errors);
  }, [deployerAddress, salt, initCodeHash]);

  // Calculate address with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!deployerAddress || !salt || !initCodeHash) {
        setResult("");
        setError("");
        return;
      }

      // Check validation
      if (!isValidAddress(deployerAddress)) {
        setError("Invalid deployer address");
        setResult("");
        return;
      }

      if (!isValidHex(salt)) {
        setError("Invalid salt format (must be hex)");
        setResult("");
        return;
      }

      if (!isValidHex(initCodeHash) || initCodeHash.length !== 66) {
        setError("Invalid init code hash (must be 32 bytes hex)");
        setResult("");
        return;
      }

      try {
        const address = calculateCreate2Address(
          deployerAddress,
          salt,
          initCodeHash,
        );
        setResult(address);
        setError("");
      } catch {
        setError("Failed to calculate address");
        setResult("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [deployerAddress, salt, initCodeHash]);

  useEffect(() => {
    if (!result) return;
    const key = JSON.stringify({
      deployerAddress,
      salt,
      initCodeHash,
      result,
    });
    if (key === lastRecentKey.current) return;
    lastRecentKey.current = key;

    setRecentCalculations((prev) => {
      const exists = prev.some(
        (p) =>
          p.result === result &&
          p.salt === salt &&
          p.initCodeHash === initCodeHash &&
          p.deployerAddress === deployerAddress,
      );
      if (exists) return prev;
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;
      const entry: RecentCalc = {
        id,
        deployerAddress,
        salt,
        initCodeHash,
        result,
      };
      return [entry, ...prev].slice(0, 5);
    });
  }, [result, deployerAddress, salt, initCodeHash]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setDeployerAddress(import.meta.env.VITE_FACTORY_ADDRESS?.trim() ?? "");
    setSalt("0x0000000000000000000000000000000000000000000000000000000000000001");
    setInitCodeHash("");
    setResult("");
    setError("");
    setValidationErrors({ deployer: "", salt: "", initCode: "" });
  };

  const loadFromRecent = (entry: RecentCalc) => {
    setDeployerAddress(entry.deployerAddress);
    setSalt(entry.salt);
    setInitCodeHash(entry.initCodeHash);
  };

  return (
    <div className="rs-panel-strong p-8">
      <div className="rs-wb-head">
        <div className="rs-wb-icon" aria-hidden>
          <FaCalculator className="text-lg" />
        </div>
        <div>
          <h2 className="rs-wb-title">Calculate address</h2>
          <p className="rs-wb-desc">
            Predict the contract address from deployer, salt, and init code hash
            (CREATE2 / EIP‑1014).
          </p>
        </div>
      </div>

      {!import.meta.env.VITE_FACTORY_ADDRESS?.trim() && (
        <div className="rs-wb-callout mb-6 border-amber-500/25" role="status">
          <p className="text-sm text-[#a0a0a0]">
            Optional: set{" "}
            <code className="font-mono text-xs text-white/90">
              VITE_FACTORY_ADDRESS
            </code>{" "}
            to your factory, or paste any deployer address.
          </p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="calc-deployer" className="rs-wb-label mb-0">
              Deployer address{" "}
              <span className="rs-wb-badge">Factory</span>
            </label>
            {validationErrors.deployer && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.deployer}
              </span>
            )}
          </div>
          <input
            id="calc-deployer"
            autoComplete="off"
            className={`rs-wb-input-mono pr-20 ${
              validationErrors.deployer ? "border-red-500/45" : ""
            }`}
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="calc-salt" className="rs-wb-label mb-0">
              Salt (bytes32) <span className="rs-wb-badge">32-byte hex</span>
            </label>
            {validationErrors.salt && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.salt}
              </span>
            )}
          </div>
          <input
            id="calc-salt"
            autoComplete="off"
            className={`rs-wb-input-mono ${
              validationErrors.salt ? "border-red-500/45" : ""
            }`}
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="calc-init-hash" className="rs-wb-label mb-0">
              Init code hash{" "}
              <span className="rs-wb-badge">keccak256(init code)</span>
            </label>
            {validationErrors.initCode && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.initCode}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="calc-init-hash"
              autoComplete="off"
              className={`rs-wb-input-mono pr-20 ${
                validationErrors.initCode ? "border-red-500/45" : ""
              }`}
              placeholder="0x..."
              value={initCodeHash}
              onChange={(e) => setInitCodeHash(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setInitCodeHash("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1 text-xs font-medium text-[#a0a0a0] hover:text-white"
              aria-label="Clear init code hash"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 flex items-center gap-2 text-sm"
        >
          <FaTrash />
          Reset to Defaults
        </button>
      </div>

      {/* Recent Calculations */}
      {recentCalculations.length > 0 && (
        <div className="mt-6 p-4 rs-card">
          <div className="flex items-center gap-2 mb-3">
            <FaHistory className="text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Recent</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentCalculations.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => loadFromRecent(entry)}
                className="max-w-[220px] truncate rounded-lg border border-[#2a2a2a] bg-black/40 px-3 py-2 font-mono text-xs text-[#a0a0a0] hover:border-[#FF6600]/30 hover:text-white"
                title={`${entry.result} — click to restore inputs`}
              >
                {entry.result.slice(0, 10)}...{entry.result.slice(-8)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rs-wb-callout mt-6 border-red-500/35">
          <div className="flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-400" aria-hidden />
            <div className="text-sm font-medium text-red-200">{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div className="rs-wb-output">
          <h3 className="rs-wb-output-h">Calculated address</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="rs-wb-code flex-1">{result}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="rs-wb-btn-accent shrink-0"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="rs-wb-callout mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#a0a0a0]">
          Formula (EIP‑1014)
        </p>
        <code className="block break-all font-mono text-sm leading-relaxed text-[#a0a0a0]">
          address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]
        </code>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[#2a2a2a] bg-black/30 p-3">
          <span className="block text-xs text-[#a0a0a0]">Deployer</span>
          <span className="mt-1 block font-mono text-xs text-white break-all">
            {deployerAddress
              ? `${deployerAddress.slice(0, 6)}…${deployerAddress.slice(-4)}`
              : "—"}
          </span>
        </div>
        <div className="rounded-xl border border-[#2a2a2a] bg-black/30 p-3">
          <span className="block text-xs text-[#a0a0a0]">Default salt</span>
          <span className="mt-1 block font-mono text-xs text-white">
            0x0000…0001
          </span>
        </div>
      </div>
    </div>
  );
}