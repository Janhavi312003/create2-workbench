import React, { useState, useRef, useCallback, useEffect } from "react";
import { isValidAddress } from "../utils/create2";

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

export default function FindSaltMode() {
  const factoryAddress =
    (import.meta as any)?.env?.VITE_FACTORY_ADDRESS ||
    "0xf39e31f414e707f129AdC1E970006E07b07eA3Cc";
  const [deployerAddress, setDeployerAddress] = useState(factoryAddress);
  const [initCodeHash, setInitCodeHash] = useState(
    "0x8f0ef1f921db5807d80fd113060720b50e76aa0123aeef09682060439f5b8d5e",
  );
  const [prefix, setPrefix] = useState("0x0000");
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [foundSalt, setFoundSalt] = useState("");
  const [foundAddress, setFoundAddress] = useState("");
  const [iterations, setIterations] = useState(0);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const workerRef = useRef<Worker | null>(null);

  const startSearch = () => {
    setError("");
    setFoundSalt("");
    setFoundAddress("");
    setProgress(0);
    setIterations(0);
    setStatusMessage("");

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

    // if (!prefix.trim() || !isValidHex(prefix)) {
    //   setError("Prefix must be a valid hex value starting with 0x");
    //   return;
    // }

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
        setFoundSalt(salt);
        setFoundAddress(address);
        setIterations(iter);
        setIsSearching(false);
        setStatusMessage(`Found match in ${iter.toLocaleString()} iterations!`);
        workerRef.current?.terminate();
      } else if (type === "progress") {
        setProgress(Math.round((current / total) * 100));
        setIterations(current);
      } else if (type === "complete") {
        setIsSearching(false);
        setStatusMessage(message || "No match found");
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
    setStatusMessage("⏹️ Search stopped");
  };

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      {/* Rootstock Header */}
      <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-xl rounded-3xl border border-orange-500/30 shadow-2xl">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
            <span className="text-2xl font-black text-white drop-shadow-lg">
              ⛓️
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
              Find Vanity Salt
            </h2>
            <p className="text-orange-200/80 text-lg font-medium drop-shadow-md">
              Generate a salt for your desired contract address prefix.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form - Dark Glassmorphism */}
      <div className="space-y-6 bg-gray-900/50 backdrop-blur-xl rounded-3xl p-7 border border-gray-700/50 shadow-2xl shadow-black/30 mb-12">
        <div>
          <label className="block text-sm font-bold text-orange-300 mb-3 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center">
            Factory Address{" "}
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono ml-2">
              (VITE_FACTORY_ADDRESS)
            </span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
            disabled={isSearching}
            className="w-full p-5 rounded-2xl border-2 border-gray-600/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/30 font-mono text-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 disabled:bg-gray-900/50 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:border-orange-400/70"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-orange-300 mb-3 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center">
            Init Code Hash{" "}
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-mono ml-2">
              (from GetInfo.s.sol)
            </span>
          </label>
          <input
            type="text"
            placeholder="0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
            value={initCodeHash}
            onChange={(e) => setInitCodeHash(e.target.value)}
            disabled={isSearching}
            className="w-full p-5 rounded-2xl border-2 border-gray-600/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/30 font-mono text-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 disabled:bg-gray-900/50 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:border-orange-400/70"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-orange-300 mb-3 tracking-wide uppercase bg-gray-800/50 px-3 py-1 rounded-xl inline-flex items-center">
            Desired Prefix
          </label>
          <input
            type="text"
            placeholder="0x0000beef"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={isSearching}
            className="w-full p-5 rounded-2xl border-2 border-gray-600/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/30 font-mono text-lg bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 disabled:bg-gray-900/50 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:border-orange-400/70"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 bg-red-500/10 border-2 border-red-400/40 backdrop-blur-sm rounded-3xl shadow-2xl shadow-red-500/20 mb-8">
          <div className="flex items-start">
            <span className="text-2xl mr-4 mt-0.5 text-red-400 drop-shadow-lg">
              ⚠️
            </span>
            <div className="text-red-200 font-semibold leading-relaxed drop-shadow-md">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Action Button - Added spacing */}
      <div className="mb-12">
        <button
          onClick={isSearching ? stopSearch : startSearch}
          disabled={!deployerAddress || !initCodeHash || !prefix}
          className={`w-full py-6 rounded-3xl font-black text-xl shadow-2xl shadow-orange-500/40 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border-2 ${
            isSearching
              ? "bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white hover:from-red-700/90 hover:to-orange-700/90 border-red-500/50 shadow-red-500/30"
              : "bg-gradient-to-r from-orange-500/90 via-yellow-500/80 to-orange-600/90 text-white hover:from-orange-600/100 hover:via-yellow-600/90 hover:to-orange-700/100 border-orange-500/60 shadow-orange-500/50 disabled:from-gray-800/50 disabled:to-gray-900/50 disabled:shadow-none disabled:cursor-not-allowed disabled:text-gray-500"
          }`}
        >
          {isSearching ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-white/30 border-t-white animate-spin rounded-2xl drop-shadow-lg"></span>
              Stop Mining
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              🚀 <span>Start Search</span>
            </span>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isSearching && (
        <div className="mt-10 p-8 bg-gray-900/40 backdrop-blur-xl rounded-3xl border border-orange-500/30 shadow-2xl shadow-orange-500/20">
          <div className="w-full bg-gray-800/50 rounded-2xl h-10 overflow-hidden shadow-inner border border-gray-700/50">
            <div
              className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 h-10 rounded-2xl shadow-xl flex items-center pl-6 transition-all duration-1000 font-mono font-bold text-lg text-white drop-shadow-2xl"
              style={{ width: `${progress}%` }}
            >
              {progress}% • Checked {iterations.toLocaleString()} salts
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="mt-8 p-8 bg-yellow-500/10 border-2 border-yellow-400/40 backdrop-blur-sm rounded-3xl shadow-2xl shadow-yellow-500/20">
          <div className="flex items-start">
            <span className="text-2xl mr-5 mt-0.5 text-yellow-400 drop-shadow-lg">
              ℹ️
            </span>
            <div className="text-yellow-200 font-semibold leading-relaxed drop-shadow-md">
              {statusMessage}
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {foundSalt && foundAddress && (
        <div className="mt-12 p-12 bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-emerald-500/15 border-4 border-emerald-400/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/30 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <div className="flex items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mr-6 shadow-2xl shadow-emerald-500/50 animate-bounce">
              <span className="text-4xl font-black text-white drop-shadow-2xl">
                ✅
              </span>
            </div>
            <div>
              <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight drop-shadow-2xl mb-2">
                VANITY ADDRESS FOUND!
              </h3>
              <p className="text-emerald-200 font-bold text-2xl drop-shadow-lg">
                Ready for Rootstock deployment
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Salt */}
            <div className="group">
              <span className="text-lg font-bold text-emerald-300 uppercase tracking-wider mb-6 block bg-emerald-500/20 px-6 py-3 rounded-2xl inline-flex items-center backdrop-blur-sm border border-emerald-400/50">
                🔑 Salt Value
              </span>
              <div className="flex gap-6 p-8 bg-gray-900/60 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/40 shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-500">
                <code className="flex-1 p-6 bg-gray-800/80 backdrop-blur-sm border border-emerald-400/50 rounded-2xl font-mono text-xl break-all font-bold text-emerald-300 shadow-2xl">
                  {foundSalt}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(foundSalt)}
                  className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xl rounded-2xl hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap backdrop-blur-sm border border-emerald-400/50"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="group">
              <span className="text-lg font-bold text-emerald-300 uppercase tracking-wider mb-6 block bg-emerald-500/20 px-6 py-3 rounded-2xl inline-flex items-center backdrop-blur-sm border border-emerald-400/50">
                🏠 Target Address
              </span>
              <div className="flex gap-6 p-8 bg-gray-900/60 backdrop-blur-xl rounded-3xl border-2 border-emerald-400/40 shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-500">
                <code className="flex-1 p-6 bg-gray-800/80 backdrop-blur-sm border border-emerald-400/50 rounded-2xl font-mono text-xl break-all font-bold text-emerald-300 shadow-2xl">
                  {foundAddress}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(foundAddress)}
                  className="px-8 py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xl rounded-2xl hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap backdrop-blur-sm border border-emerald-400/50"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          </div>

          {/* Deploy CTA */}
          <div className="mt-12 pt-12 border-t-4 border-emerald-400/30">
            <p className="text-center text-emerald-300 font-black text-2xl bg-emerald-500/20 px-12 py-8 rounded-3xl inline-block backdrop-blur-xl border-2 border-emerald-400/50 shadow-2xl">
              🎉 Deploy on Rootstock Mainnet/Testnet Now!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
