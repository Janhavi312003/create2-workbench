declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { ROOTSTOCK_TESTNET } from "../config/networks";

export default function WalletConnect() {
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          const network = await provider.getNetwork();
          setChainId(network.chainId.toString());
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount("");
      setIsConnected(false);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet");
    }
  };

  const switchToRootstock = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ROOTSTOCK_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [ROOTSTOCK_TESTNET],
          });
        } catch (addError) {
          console.error("Error adding Rootstock network:", addError);
          alert("Failed to add Rootstock network");
        }
      } else {
        console.error("Error switching network:", switchError);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setChainId("");
    setIsConnected(false);
  };

  const isRootstockNetwork = chainId === "31" || chainId === "30";
  const shortenAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="flex items-center gap-4">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-orange-500/50"
        >
          🔗 Connect Wallet
        </button>
      ) : (
        <>
          {!isRootstockNetwork && (
            <button
              onClick={switchToRootstock}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg animate-pulse border border-orange-500/50 transition-all duration-300"
            >
              Switch to Rootstock
            </button>
          )}

          <div className="flex items-center gap-3 bg-gray-900/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-700 shadow-lg">
            <div
              className={`w-3 h-3 rounded-full shadow-lg ${isRootstockNetwork ? "bg-emerald-400 shadow-emerald-500/50" : "bg-amber-400 shadow-amber-500/50"}`}
            ></div>
            <span className="text-sm font-mono text-orange-200 font-semibold tracking-wide">
              {shortenAddress(account)}
            </span>
            <button
              onClick={disconnectWallet}
              className="p-1.5 bg-gray-800/50 hover:bg-red-500/50 hover:text-red-200 rounded-xl text-orange-300 hover:text-white font-bold transition-all duration-200 shadow-md hover:shadow-red-500/30 ml-2"
              title="Disconnect"
            >
              ✕
            </button>
          </div>

          {isRootstockNetwork && (
            <span className="text-sm text-orange-300 font-semibold bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-orange-500/30 shadow-md">
              {chainId === "31"
                ? "🟢 Rootstock Testnet"
                : "🟢 Rootstock Mainnet"}
            </span>
          )}
        </>
      )}
    </div>
  );
}
