import { useState, useEffect } from "react";
import {
  calculateCreate2Address,
  isValidAddress,
  isValidHex,
} from "../utils/create2";
import { FaCopy, FaCheck, FaExclamationTriangle, FaRocket, FaCalculator, FaTrash, FaHistory } from 'react-icons/fa';
import { BsLightningCharge } from 'react-icons/bs';

export default function CalculateMode() {
  const [deployerAddress, setDeployerAddress] = useState("");
  const [salt, setSalt] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  );
  const [initCodeHash, setInitCodeHash] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [recentCalculations, setRecentCalculations] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    deployer: "",
    salt: "",
    initCode: ""
  });

  // Load factory address from env
  useEffect(() => {
    const factoryAddress = (import.meta as any)?.env?.VITE_FACTORY_ADDRESS || 
      "0xf39e31f414e707f129AdC1E970006E07b07eA3Cc";
    setDeployerAddress(factoryAddress);
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

      setIsCalculating(true);
      
      try {
        const address = calculateCreate2Address(
          deployerAddress,
          salt,
          initCodeHash,
        );
        setResult(address);
        setError("");
        
        // Add to recent calculations
        setRecentCalculations(prev => {
          const newPrev = [address, ...prev].slice(0, 5);
          return newPrev;
        });
      } catch {
        setError("Failed to calculate address");
        setResult("");
      } finally {
        setIsCalculating(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [deployerAddress, salt, initCodeHash]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    const factoryAddress = (import.meta as any)?.env?.VITE_FACTORY_ADDRESS || 
      "0xf39e31f414e707f129AdC1E970006E07b07eA3Cc";
    setDeployerAddress(factoryAddress);
    setSalt("0x0000000000000000000000000000000000000000000000000000000000000001");
    setInitCodeHash("");
    setResult("");
    setError("");
    setValidationErrors({ deployer: "", salt: "", initCode: "" });
  };

  const loadFromRecent = (address: string) => {
    // This would need to store full params, simplified for demo
    console.log("Load recent:", address);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl hover:shadow-orange-500/10 transition-all duration-500">
      {/* Header */}
      <div className="flex items-center mb-6 group">
        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-2xl font-black text-white drop-shadow-lg">
            <FaCalculator />
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
            Calculate Address
          </h2>
          <p className="text-orange-300/80 text-lg font-medium flex items-center gap-2">
            <BsLightningCharge className="text-yellow-500" />
            Predict your contract address before deployment
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-orange-300 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
              Deployer Address
              <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
                Factory contract
              </span>
            </label>
            {validationErrors.deployer && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.deployer}
              </span>
            )}
          </div>
          <input
            className={`w-full rounded-2xl border-2 transition-all duration-300 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 ${
              validationErrors.deployer
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 hover:border-orange-400/80"
            }`}
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-orange-300 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
              Salt (bytes32)
              <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
                32‑byte hex
              </span>
            </label>
            {validationErrors.salt && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.salt}
              </span>
            )}
          </div>
          <input
            className={`w-full rounded-2xl border-2 transition-all duration-300 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 ${
              validationErrors.salt
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                : "border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 hover:border-orange-400/80"
            }`}
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-orange-300 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
              Init Code Hash
              <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
                keccak256 of bytecode
              </span>
            </label>
            {validationErrors.initCode && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                <FaExclamationTriangle /> {validationErrors.initCode}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              className={`w-full rounded-2xl border-2 transition-all duration-300 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 pr-24 ${
                validationErrors.initCode
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
                  : "border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 hover:border-orange-400/80"
              }`}
              placeholder="0x..."
              value={initCodeHash}
              onChange={(e) => setInitCodeHash(e.target.value)}
            />
            <button
              onClick={() => setInitCodeHash("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gray-700 rounded-lg text-xs text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 flex items-center gap-2 text-sm"
        >
          <FaTrash />
          Reset to Defaults
        </button>
      </div>

      {/* Recent Calculations */}
      {recentCalculations.length > 0 && (
        <div className="mt-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <FaHistory className="text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">Recent</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentCalculations.map((addr, i) => (
              <button
                key={i}
                onClick={() => loadFromRecent(addr)}
                className="text-xs font-mono bg-gray-800 px-3 py-2 rounded-lg text-orange-400 hover:bg-gray-700 transition-colors border border-gray-600 truncate max-w-[200px]"
                title={addr}
              >
                {addr.slice(0, 10)}...{addr.slice(-8)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-400/40 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
            <div className="text-red-200 font-medium">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Result State */}
      {result && (
        <div className="mt-8 p-8 bg-emerald-900/50 border-2 border-emerald-500/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-900/40 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <h3 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Calculated Address
            </h3>
          </div>
          
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <code className="flex-1 text-base lg:text-xl font-mono break-all font-bold text-emerald-200 bg-gray-900/80 backdrop-blur-sm border border-emerald-500/60 rounded-2xl px-6 py-5 shadow-xl">
              {result}
            </code>
            <button
              onClick={handleCopy}
              className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-emerald-700 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-500/70 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>
        </div>
      )}

      {/* Formula Section */}
      <div className="mt-8 p-6 bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-orange-500/40 shadow-xl">
        <h4 className="text-lg font-bold text-orange-300 mb-4 tracking-wide uppercase drop-shadow-md flex items-center gap-2">
          <BsLightningCharge />
          Formula (EIP‑1014)
        </h4>
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/50">
          <code className="text-sm lg:text-base font-mono text-orange-400 font-bold break-all block drop-shadow-lg">
            address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]
          </code>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
          <span className="text-xs text-blue-300 block">Factory</span>
          <span className="text-xs font-mono text-blue-400">0xf39e3...A3Cc</span>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
          <span className="text-xs text-purple-300 block">Default Salt</span>
          <span className="text-xs font-mono text-purple-400">0x0000...0001</span>
        </div>
      </div>
    </div>
  );
}