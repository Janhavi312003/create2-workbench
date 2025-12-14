import { useState, useEffect } from "react";
import {
  calculateCreate2Address,
  isValidAddress,
  isValidHex,
} from "../utils/create2";

export default function CalculateMode() {
  const [deployerAddress, setDeployerAddress] = useState("");
  const [salt, setSalt] = useState(
    "0x0000000000000000000000000000000000000000000000000000000000000001"
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
        initCodeHash
      );
      setResult(address);
      setError("");
    } catch {
      setError("Failed to calculate address");
      setResult("");
    }
  }, [deployerAddress, salt, initCodeHash]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Calculate CREATE2 Address
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Enter the deployer address, salt, and init code hash to compute the
        deterministic contract address.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Deployer Address
            <span className="block text-xs text-slate-500">
              Address that will call CREATE2
            </span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0x..."
            value={deployerAddress}
            onChange={(e) => setDeployerAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Salt (bytes32)
            <span className="block text-xs text-slate-500">
              32‑byte value used for address generation
            </span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800 mb-1">
            Init Code Hash (keccak256)
            <span className="block text-xs text-slate-500">
              keccak256 of your contract bytecode
            </span>
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="0x..."
            value={initCodeHash}
            onChange={(e) => setInitCodeHash(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-3">
          <h3 className="text-sm font-semibold text-indigo-700 mb-2">
            Calculated Address
          </h3>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <code className="flex-1 text-xs md:text-sm break-all font-mono text-slate-800 bg-white rounded-md px-2 py-2">
              {result}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-2 md:mt-0 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2">
        <h4 className="text-xs font-semibold text-slate-700 mb-1">
          Formula (EIP‑1014)
        </h4>
        <code className="text-xs text-indigo-600">
          keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]
        </code>
      </div>
    </div>
  );
}
