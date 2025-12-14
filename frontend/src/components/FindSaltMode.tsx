import { useState, useRef } from "react";
import { isValidAddress, isValidHex } from "../utils/create2";

export default function FindSaltMode() {
  const [deployerAddress, setDeployerAddress] = useState("");
  const [initCodeHash, setInitCodeHash] = useState("");
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

    if (!isValidAddress(deployerAddress)) {
      setError("Invalid deployer address");
      return;
    }

    if (!isValidHex(initCodeHash) || initCodeHash.length !== 66) {
      setError("Invalid init code hash");
      return;
    }

    if (!prefix.startsWith("0x") || prefix.length < 3) {
      setError("Prefix must start with 0x and contain at least one character");
      return;
    }

    setIsSearching(true);
    setStatusMessage("Searching for matching salt...");

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
        setStatusMessage(`Found match in ${iter} iterations!`);
        workerRef.current?.terminate();
      } else if (type === "progress") {
        setProgress(Math.round((current / total) * 100));
        setIterations(current);
      } else if (type === "complete") {
        setIsSearching(false);
        setStatusMessage(message);
        setIterations(iter);
        workerRef.current?.terminate();
      } else if (type === "error") {
        setError(message);
        setIsSearching(false);
        workerRef.current?.terminate();
      }
    };
  };

  const stopSearch = () => {
    workerRef.current?.terminate();
    setIsSearching(false);
    setStatusMessage("Search stopped by user");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Find Vanity Salt
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Search for a salt that generates a contract address matching your desired
        prefix. This may take time depending on complexity.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Deployer Address
            <span className="block text-xs text-slate-500">
              Factory contract address
            </span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
            disabled={isSearching}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Init Code Hash
            <span className="block text-xs text-slate-500">
              keccak256 of contract bytecode
            </span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={initCodeHash}
            onChange={(e) => setInitCodeHash(e.target.value)}
            disabled={isSearching}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Desired Prefix
            <span className="block text-xs text-slate-500">
              Target start (e.g., 0x0000 for leading zeros)
            </span>
          </label>
          <input
            type="text"
            placeholder="0x0000"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            disabled={isSearching}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4">
        {!isSearching ? (
          <button
            onClick={startSearch}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md"
          >
            Start Search
          </button>
        ) : (
          <button
            onClick={stopSearch}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-md"
          >
            Stop Search
          </button>
        )}
      </div>

      {isSearching && (
        <div className="mt-4">
          <div className="w-full h-8 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && `${progress}%`}
            </div>
          </div>
          <p className="text-center text-sm text-slate-600 mt-2">
            Checked {iterations.toLocaleString()} salts... ({progress}%)
          </p>
        </div>
      )}

      {statusMessage && (
        <div className="mt-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          {statusMessage}
        </div>
      )}

      {foundSalt && foundAddress && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-4 space-y-3">
          <h3 className="text-base font-semibold text-green-700">
            ✓ Match Found!
          </h3>

          <div>
            <strong className="block text-xs text-slate-700 mb-1">Salt:</strong>
            <div className="flex flex-col md:flex-row gap-2">
              <code className="flex-1 text-xs break-all font-mono text-slate-800 bg-white rounded-md px-2 py-2 border border-green-200">
                {foundSalt}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(foundSalt)}
                className="inline-flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <strong className="block text-xs text-slate-700 mb-1">Address:</strong>
            <div className="flex flex-col md:flex-row gap-2">
              <code className="flex-1 text-xs break-all font-mono text-slate-800 bg-white rounded-md px-2 py-2 border border-green-200">
                {foundAddress}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(foundAddress)}
                className="inline-flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
