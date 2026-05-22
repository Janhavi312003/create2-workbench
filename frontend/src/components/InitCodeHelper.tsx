import { useState, useEffect, useRef } from "react";
import { hashInitCode } from "../utils/create2";
import { exampleContracts } from "../utils/exampleContracts";
import { FaCopy, FaCheck, FaCode, FaLightbulb, FaRocket } from 'react-icons/fa';

export default function InitCodeHelper() {
  const [bytecode, setBytecode] = useState("");
  const [hash, setHash] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
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
      } catch {
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
    setBytecode(exampleContracts.simpleStorage.bytecode);
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
    <div className="rs-panel-strong p-8">
      <div className="rs-wb-head">
        <div className="rs-wb-icon" aria-hidden>
          <FaCode className="text-lg" />
        </div>
        <div>
          <h3 className="rs-wb-title">Init code hash</h3>
          <p className="rs-wb-desc">
            Keccak256 of deployment bytecode for use in Calculate and Find salt.
          </p>
        </div>
      </div>

      <div className="rs-wb-callout mb-6">
        <div className="flex items-start gap-2">
          <FaLightbulb className="mt-0.5 shrink-0 text-[#FF6600]" aria-hidden />
          <p className="text-sm leading-relaxed text-[#a0a0a0]">
            Paste bytecode from Remix (compile details) or{" "}
            <code className="font-mono text-xs text-white/90">
              forge inspect &lt;Contract&gt; bytecode
            </code>
            .
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="rs-wb-label mb-0" htmlFor="init-bytecode">
            Contract bytecode{" "}
            <span className="rs-wb-badge">
              {bytecode.length > 0 ? `${bytecode.length} chars` : "hex"}
            </span>
          </label>
          <div className="flex gap-2">
            {bytecode && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs font-medium text-[#a0a0a0] hover:text-white"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handlePasteExample}
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1 text-xs font-medium text-[#FF6600] hover:border-[#FF6600]/40"
            >
              Paste example
            </button>
          </div>
        </div>

        <textarea
          id="init-bytecode"
          ref={textareaRef}
          placeholder="0x608060405234801561001057600080fd5b50..."
          value={bytecode}
          onChange={(e) => setBytecode(e.target.value)}
          rows={6}
          className="rs-wb-input-mono min-h-[8rem] resize-y"
        />
      </div>

      {stats && (
        <div className="mb-6 flex flex-wrap gap-2">
          <div className="rounded-xl border border-[#2a2a2a] bg-black/30 px-3 py-2">
            <span className="block text-xs text-[#a0a0a0]">Bytes</span>
            <span className="font-mono text-sm text-white">{stats.bytes}</span>
          </div>
          <div className="rounded-xl border border-[#2a2a2a] bg-black/30 px-3 py-2">
            <span className="block text-xs text-[#a0a0a0]">Format</span>
            <span className="font-mono text-sm text-white">
              {stats.has0x ? "0x prefix" : "no 0x"}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleHash}
        disabled={!bytecode || isHashing}
        className="rs-wb-btn-accent mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isHashing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Hashing…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <FaRocket className="text-base" aria-hidden />
            Compute hash
          </span>
        )}
      </button>

      {hash && (
        <div
          className={`rs-wb-output mt-6 ${
            hash.startsWith("Error") ? "border-red-500/30" : ""
          }`}
        >
          <p
            className={`rs-wb-output-h ${
              hash.startsWith("Error") ? "text-red-300" : ""
            }`}
          >
            {hash.startsWith("Error") ? "Error" : "Init code hash"}
          </p>
          <code
            className={`rs-wb-code ${
              hash.startsWith("Error") ? "text-red-200/90" : ""
            }`}
          >
            {hash}
          </code>

          {!hash.startsWith("Error") && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={handleCopy} className="rs-wb-btn-accent flex-1 sm:flex-none">
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(hash);
                  window.dispatchEvent(
                    new CustomEvent("hashCopied", { detail: hash }),
                  );
                }}
                className="rs-wb-btn-ghost"
                title="Copy and broadcast to other modes"
                aria-label="Copy hash for other modes"
              >
                <FaRocket className="text-[#FF6600]" aria-hidden />
                Use in modes
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-[#2a2a2a] pt-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="rs-wb-callout">
            <span className="text-xs font-medium text-[#a0a0a0]">1</span>
            <p className="mt-1 text-sm text-[#a0a0a0]">
              Bytecode from Remix or Foundry artifacts.
            </p>
          </div>
          <div className="rs-wb-callout">
            <span className="text-xs font-medium text-[#a0a0a0]">2</span>
            <p className="mt-1 text-sm text-[#a0a0a0]">
              Use the hash in Calculate and Find salt on the left.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}