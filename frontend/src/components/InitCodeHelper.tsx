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
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        Init Code Hash Helper
      </h3>
      <p className="text-xs text-slate-600 mb-3">
        Paste your contract bytecode to get the keccak256 hash
      </p>

      <textarea
        placeholder="0x608060405234801561001057600080fd5b50..."
        value={bytecode}
        onChange={(e) => setBytecode(e.target.value)}
        rows={5}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />

      <button
        onClick={handleHash}
        className="w-full mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Calculate Hash
      </button>

      {hash && (
        <div className="mt-3">
          <strong className="block text-xs font-medium text-slate-700 mb-2">
            {hash.startsWith("Error") ? "Error:" : "Init Code Hash:"}
          </strong>
          <div
            className={`flex flex-col gap-2 ${
              hash.startsWith("Error") ? "text-red-700" : ""
            }`}
          >
            <code
              className={`text-xs break-all font-mono rounded-md px-2 py-2 border ${
                hash.startsWith("Error")
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-200"
              }`}
            >
              {hash}
            </code>
            {!hash.startsWith("Error") && (
              <button
                onClick={() => navigator.clipboard.writeText(hash)}
                className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Copy Hash
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          <strong>Tip:</strong> Get bytecode from Remix (compile → copy bytecode)
          or from your compiled contract artifacts.
        </p>
      </div>
    </div>
  );
}
