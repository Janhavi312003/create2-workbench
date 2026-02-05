import { useState, useEffect } from "react";
import {
  calculateCreate2Address,
  isValidAddress,
  isValidHex,
} from "../utils/create2";

export default function CalculateMode() {
  const [deployerAddress, setDeployerAddress] = useState("");
  const [salt, setSalt] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  );
  const [initCodeHash, setInitCodeHash] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!deployerAddress || !salt || !initCodeHash) {
      setResult("");
      setError("");
      return;
    }

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
  }, [deployerAddress, salt, initCodeHash]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
          <span className="text-2xl font-black text-white drop-shadow-lg">
            📐
          </span>
        </div>
        <h2 className="text-2xl font-black text-orange-400 tracking-tight drop-shadow-xl">
          Calculate Address
        </h2>
      </div>

      <p className="text-orange-300/90 text-lg mb-8 font-medium leading-relaxed drop-shadow-md">
        Enter the deployer address, salt, and init code hash to compute the
        deterministic contract address.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-orange-300 mb-2 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
            Deployer Address
            <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
              Address that will call CREATE2
            </span>
          </label>
          <input
            className="w-full rounded-2xl border-2 border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 hover:border-orange-400/80 transition-all duration-300"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-orange-300 mb-2 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
            Salt (bytes32)
            <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
              32‑byte value used for address generation
            </span>
          </label>
          <input
            className="w-full rounded-2xl border-2 border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 hover:border-orange-400/80 transition-all duration-300"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-orange-300 mb-2 tracking-wide uppercase bg-gray-800/60 px-4 py-2 rounded-2xl inline-flex items-center border border-orange-500/40">
            Init Code Hash (keccak256)
            <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-0.5 rounded-xl">
              keccak256 of your contract bytecode
            </span>
          </label>
          <input
            className="w-full rounded-2xl border-2 border-gray-600/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/30 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 shadow-lg hover:shadow-orange-400/25 hover:border-orange-400/80 transition-all duration-300"
            placeholder="0x..."
            value={initCodeHash}
            onChange={(e) => setInitCodeHash(e.target.value)}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-8 p-6 bg-red-900/40 border-2 border-red-500/60 backdrop-blur-sm rounded-3xl shadow-xl shadow-red-900/30">
          <div className="flex items-start">
            <span className="text-2xl mr-4 mt-0.5 text-red-400 drop-shadow-md">
              ⚠️
            </span>
            <div className="text-red-200 font-semibold text-lg leading-relaxed drop-shadow-md">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Result State */}
      {result && (
        <div className="mt-8 p-8 bg-emerald-900/50 border-2 border-emerald-500/70 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-900/40">
          <h3 className="text-xl font-black text-emerald-300 mb-6 tracking-tight drop-shadow-xl">
            Calculated Address
          </h3>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <code className="flex-1 text-xl font-mono break-all font-bold text-emerald-200 bg-gray-900/80 backdrop-blur-sm border border-emerald-500/60 rounded-2xl px-8 py-6 shadow-xl">
              {result}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="px-10 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xl rounded-2xl hover:from-emerald-600 hover:to-emerald-700 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-500/70"
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}

      {/* Formula Section */}
      <div className="mt-10 p-6 bg-gray-900/70 backdrop-blur-sm rounded-3xl border border-orange-500/40 shadow-xl">
        <h4 className="text-lg font-bold text-orange-300 mb-4 tracking-wide uppercase drop-shadow-md">
          Formula (EIP‑1014)
        </h4>
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/50">
          <code className="text-lg font-mono text-orange-400 font-bold break-all block drop-shadow-lg">
            keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]
          </code>
        </div>
      </div>
    </div>
  );
}
