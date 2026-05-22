import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";
import { rootstockTestnet } from "wagmi/chains";
import { FaCopy, FaCheck } from "react-icons/fa";

/**
 * Fallback wallet UI when `VITE_WALLET_CONNECT_PROJECT_ID` is unset (injected / browser extension only).
 */
export function InjectedWalletControls() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const wrongNetwork = isConnected && chainId !== rootstockTestnet.id;

  const handleCopyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 disabled:opacity-60"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>
    );
  }

  const shortAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "";

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {wrongNetwork && (
        <span className="text-xs text-amber-400 max-w-[140px]">
          Switch network to Rootstock Testnet in your wallet
        </span>
      )}
      <button
        type="button"
        onClick={handleCopyAddress}
        title={address}
        aria-label={copied ? "Address copied" : "Copy wallet address"}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-2.5 py-1.5 text-xs font-mono text-white hover:border-orange-500/40"
      >
        <span className="max-w-[120px] truncate">{shortAddress}</span>
        {copied ? (
          <FaCheck className="shrink-0 text-emerald-400" aria-hidden />
        ) : (
          <FaCopy className="shrink-0 text-[#a0a0a0]" aria-hidden />
        )}
      </button>
      <button
        type="button"
        onClick={() => disconnect()}
        className="text-xs px-3 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:text-orange-400"
      >
        Disconnect
      </button>
    </div>
  );
}
