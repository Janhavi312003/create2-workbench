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

export default function FindSaltMode() {
  const factoryAddress = (import.meta as any)?.env?.VITE_FACTORY_ADDRESS || "0xf39e31f414e707f129AdC1E970006E07b07eA3Cc";
  const [deployerAddress, setDeployerAddress] = useState(factoryAddress);
  const [initCodeHash, setInitCodeHash] = useState("0x8f0ef1f921db5807d80fd113060720b50e76aa0123aeef09682060439f5b8d5e");
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

    if (!prefix.trim() || !prefix.startsWith("0x")) {
      setError("Prefix must start with 0x");
      return;
    }

    setIsSearching(true);
    setStatusMessage("Searching for matching salt...");

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    workerRef.current = new Worker(
      new URL("../workers/saltMiner.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.postMessage({
      deployerAddress,
      initCodeHash,
      prefix,
      startNonce: 0,
      maxIterations: 1000000,
    });

    workerRef.current.onmessage = (e) => {
      const { type, salt, address, iterations: iter, current, total, message } = e.data;

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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Find Vanity Salt</h2>
      <p className="text-slate-600 mb-6">Generate a salt for your desired contract address prefix.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Factory Address <span className="text-xs text-slate-500">(VITE_FACTORY_ADDRESS)</span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
            disabled={isSearching}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Init Code Hash <span className="text-xs text-slate-500">(from GetInfo.s.sol)</span>
          </label>
          <input
            type="text"
            placeholder="0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f"
            value={initCodeHash}
            onChange={(e) => setInitCodeHash(e.target.value)}
            disabled={isSearching}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-sm disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Desired Prefix</label>
          <input
            type="text"
            placeholder="0x0000"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={isSearching}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 font-mono text-sm disabled:bg-gray-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={isSearching ? stopSearch : startSearch}
        disabled={!deployerAddress || !initCodeHash || !prefix}
        className={`w-full mt-6 py-3 rounded-lg font-semibold text-white shadow-lg transition-all ${
          isSearching
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        }`}
      >
        {isSearching ? "⏹️ Stop Search" : "Start Search"}
      </button>

      {isSearching && (
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-slate-600 mt-2">
            Checked {iterations.toLocaleString()} salts ({progress}%)
          </p>
        </div>
      )}

      {statusMessage && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          {statusMessage}
        </div>
      )}

      {foundSalt && foundAddress && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
          <h3 className="text-lg font-bold text-green-800 mb-4">✅ PERFECT MATCH FOUND!</h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-slate-700">Salt:</span>
              <div className="flex gap-2 mt-1">
                <code className="flex-1 p-2 bg-white border rounded font-mono text-sm break-all">
                  {foundSalt}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(foundSalt)}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div>
              <span className="text-xs font-medium text-slate-700">Address:</span>
              <div className="flex gap-2 mt-1">
                <code className="flex-1 p-2 bg-white border rounded font-mono text-sm break-all">
                  {foundAddress}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(foundAddress)}
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
