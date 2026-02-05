import { useState } from "react";
import { hashInitCode } from "../utils/create2";

export default function InitCodeHelper() {
  const [bytecode, setBytecode] = useState("");
  const [hash, setHash] = useState("");

  const handleHash = () => {
    if (!bytecode) {
      setHash("Error: Please enter bytecode");
      return;
    }
    try {
      const result = hashInitCode(bytecode);
      setHash(result);
    } catch (error) {
      setHash("Error: Invalid bytecode format");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
          <span className="text-xl font-black text-white drop-shadow-lg">
            🔐
          </span>
        </div>
        <h3 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
          Init Code Hash Helper
        </h3>
      </div>

      <p className="text-orange-300/80 text-lg mb-6 font-medium leading-relaxed drop-shadow-md">
        Paste your contract bytecode to get the keccak256 hash
      </p>

      <textarea
        placeholder="0x608060405234801561001057600080fd5b50..."
        value={bytecode}
        onChange={(e) => setBytecode(e.target.value)}
        rows={6}
        className="w-full rounded-2xl border-2 border-gray-600/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/30 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 resize-none shadow-xl hover:shadow-orange-500/20 hover:border-orange-400/70 transition-all duration-300 shadow-inner"
      />

      <button
        onClick={handleHash}
        className="w-full mt-6 py-5 rounded-3xl bg-gradient-to-r from-orange-500/90 via-yellow-500/80 to-orange-600/90 text-white font-black text-xl hover:from-orange-600/100 hover:via-yellow-600/90 hover:to-orange-700/100 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-sm border-2 border-orange-500/60"
      >
        Calculate Hash
      </button>

      {hash && (
        <div
          className={`mt-8 p-6 rounded-3xl shadow-2xl backdrop-blur-sm border-2 transition-all duration-300 ${
            hash.startsWith("Error")
              ? "bg-red-500/10 border-red-400/40 shadow-red-500/20"
              : "bg-emerald-500/10 border-emerald-400/40 shadow-emerald-500/20"
          }`}
        >
          <strong
            className={`block text-lg font-bold mb-4 tracking-wide uppercase ${
              hash.startsWith("Error")
                ? "text-red-300 drop-shadow-lg"
                : "bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent drop-shadow-xl"
            }`}
          >
            {hash.startsWith("Error") ? "❌ Error:" : "✅ Init Code Hash:"}
          </strong>
          <div className="flex flex-col gap-4">
            <code
              className={`text-lg break-all font-mono rounded-2xl px-6 py-5 shadow-xl border font-bold text-white shadow-2xl ${
                hash.startsWith("Error")
                  ? "bg-red-900/50 border-red-400/50 shadow-red-500/30"
                  : "bg-gray-800/80 border-emerald-400/50 shadow-emerald-500/30 backdrop-blur-sm"
              }`}
            >
              {hash}
            </code>
            {!hash.startsWith("Error") && (
              <button
                onClick={() => navigator.clipboard.writeText(hash)}
                className="w-max px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-green-700 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-emerald-400/50"
              >
                Copy Hash
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 pt-8 border-t-2 border-gray-700/50">
        <div className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/30">
          <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-white font-bold text-lg">💡</span>
          </span>
          <p className="text-orange-300 text-base font-semibold leading-relaxed drop-shadow-md">
            <strong>Tip:</strong> Get bytecode from Remix (compile → copy
            bytecode) or from your compiled contract artifacts.
          </p>
        </div>
      </div>
    </div>
  );
}
