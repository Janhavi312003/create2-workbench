import { useState, useEffect, useRef } from "react";
import { hashInitCode } from "../utils/create2";
import { FaCopy, FaCheck, FaCode, FaLightbulb, FaExclamationTriangle, FaRocket } from 'react-icons/fa';
import { BsLightningCharge } from 'react-icons/bs';

export default function InitCodeHelper() {
  const [bytecode, setBytecode] = useState("");
  const [hash, setHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bytecodeLength, setBytecodeLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [bytecode]);

  // Update bytecode length for character count
  useEffect(() => {
    setBytecodeLength(bytecode.length);
  }, [bytecode]);

  const handleHash = () => {
    if (!bytecode) {
      setHash("Error: Please enter bytecode");
      return;
    }
    
    setIsHashing(true);
    setCopied(false);
    
    // Simulate processing for better UX
    setTimeout(() => {
      try {
        const result = hashInitCode(bytecode);
        setHash(result);
      } catch (error) {
        setHash("Error: Invalid bytecode format");
      } finally {
        setIsHashing(false);
      }
    }, 300);
  };

  const handleCopy = () => {
    if (hash && !hash.startsWith("Error")) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setBytecode("");
    setHash("");
    setCopied(false);
  };

  const handlePasteExample = () => {
    setBytecode("0x608060405234801561001057600080fd5b5061012f806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80632e64cec114602d575b600080fd5b60336047565b604051603e9190605d565b60405180910390f35b60008054905090565b6057816076565b82525050565b6000602082019050607060008301846050565b92915050565b600081905091905056fea2646970667358221220123456789abcdef");
  };

  const getBytecodeStats = () => {
    if (!bytecode) return null;
    const clean = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;
    const bytes = clean.length / 2;
    return {
      bytes: bytes,
      chars: bytecode.length,
      has0x: bytecode.startsWith('0x')
    };
  };

  const stats = getBytecodeStats();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-950 bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 shadow-xl hover:shadow-orange-500/10 transition-all duration-500">
      {/* Header with Icon */}
      <div className="flex items-center mb-6 group">
        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <span className="text-2xl font-black text-white drop-shadow-lg">
            <FaCode />
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
            Init Code Hash Helper
          </h3>
          <p className="text-orange-300/80 text-lg font-medium flex items-center gap-2">
            <BsLightningCharge className="text-yellow-500" />
            Get keccak256 hash of your contract bytecode
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <FaLightbulb className="text-yellow-500 text-xl flex-shrink-0 mt-1" />
          <p className="text-[#a0a0a0] text-sm leading-relaxed">
            <span className="text-white font-bold">Quick tip:</span> Get bytecode from Remix (Compile → Bytecode) or from your compiled contract artifacts. 
            The hash is used in Calculate Mode and Find Salt Mode.
          </p>
        </div>
      </div>

      {/* Bytecode Input */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-orange-300 tracking-wide uppercase bg-gray-800/50 px-4 py-2 rounded-xl inline-flex items-center border border-orange-500/30">
            Contract Bytecode
            <span className="text-xs text-orange-200 ml-3 font-mono bg-orange-500/20 px-2 py-1 rounded-lg">
              {bytecodeLength > 0 ? `${bytecodeLength} chars` : 'Paste your bytecode'}
            </span>
          </label>
          <div className="flex gap-2">
            {bytecode && (
              <button
                onClick={handleClear}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                Clear
              </button>
            )}
            <button
              onClick={handlePasteExample}
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30"
            >
              Paste Example
            </button>
          </div>
        </div>
        
        <textarea
          ref={textareaRef}
          placeholder="0x608060405234801561001057600080fd5b50..."
          value={bytecode}
          onChange={(e) => setBytecode(e.target.value)}
          rows={6}
          className="w-full rounded-2xl border-2 border-gray-600/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-400/30 px-5 py-4 text-lg font-mono bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-400 resize-none shadow-xl hover:shadow-orange-500/20 hover:border-orange-400/70 transition-all duration-300 font-mono text-sm"
        />
      </div>

      {/* Bytecode Stats */}
      {stats && (
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
            <span className="text-xs text-gray-400 block">Bytes</span>
            <span className="text-sm font-mono text-orange-400 font-bold">{stats.bytes}</span>
          </div>
          <div className="px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
            <span className="text-xs text-gray-400 block">Format</span>
            <span className="text-sm font-mono text-orange-400 font-bold">{stats.has0x ? '0x prefix' : 'no prefix'}</span>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={handleHash}
        disabled={!bytecode || isHashing}
        className="w-full mt-4 py-5 rounded-3xl bg-gradient-to-r from-orange-500/90 via-yellow-500/80 to-orange-600/90 text-white font-black text-xl hover:from-orange-600/100 hover:via-yellow-600/90 hover:to-orange-700/100 shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 backdrop-blur-sm border-2 border-orange-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isHashing ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-6 h-6 border-3 border-white/30 border-t-white animate-spin rounded-full"></span>
            Calculating Hash...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <FaRocket className="text-white" />
            Calculate Hash
          </span>
        )}
      </button>

      {/* Result Display */}
      {hash && (
        <div
          className={`mt-8 p-6 rounded-3xl shadow-2xl backdrop-blur-sm border-2 transition-all duration-500 animate-in fade-in-50 slide-in-from-bottom-4 ${
            hash.startsWith("Error")
              ? "bg-red-500/10 border-red-400/40 shadow-red-500/20"
              : "bg-emerald-500/10 border-emerald-400/40 shadow-emerald-500/20"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              hash.startsWith("Error") ? "bg-red-500/20" : "bg-emerald-500/20"
            }`}>
              <span className="text-xl">
                {hash.startsWith("Error") ? "❌" : "✅"}
              </span>
            </div>
            <strong
              className={`text-lg font-bold tracking-wide uppercase ${
                hash.startsWith("Error")
                  ? "text-red-300"
                  : "bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent"
              }`}
            >
              {hash.startsWith("Error") ? "Error:" : "Init Code Hash:"}
            </strong>
          </div>

          <div className="flex flex-col gap-4">
            <code
              className={`text-lg break-all font-mono rounded-2xl px-6 py-5 shadow-xl border font-bold text-white shadow-2xl ${
                hash.startsWith("Error")
                  ? "bg-red-900/50 border-red-400/50"
                  : "bg-gray-800/80 border-emerald-400/50 hover:border-emerald-400 transition-colors"
              }`}
            >
              {hash}
            </code>
            
            {!hash.startsWith("Error") && (
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-green-700 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-emerald-400/50 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-white" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      Copy Hash
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(hash);
                    // Trigger a custom event that other components can listen for
                    window.dispatchEvent(new CustomEvent('hashCopied', { detail: hash }));
                  }}
                  className="px-6 py-4 bg-gray-800 text-white font-bold text-lg rounded-2xl hover:bg-gray-700 shadow-xl border border-gray-600 transform hover:scale-105 active:scale-95 transition-all duration-300"
                  title="Copy and use in other modes"
                >
                  <FaRocket />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Tips */}
      <div className="mt-10 pt-8 border-t-2 border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/30 hover:border-orange-500 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">1️⃣</span>
              </span>
              <p className="text-orange-300 text-sm font-medium">
                Get bytecode from <span className="text-white font-bold">Remix</span> or <span className="text-white font-bold">Foundry</span>
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/30 hover:border-orange-500 transition-all duration-300 group cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">2️⃣</span>
              </span>
              <p className="text-orange-300 text-sm font-medium">
                Use hash in <span className="text-white font-bold">Calculate Mode</span> or <span className="text-white font-bold">Find Salt Mode</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}