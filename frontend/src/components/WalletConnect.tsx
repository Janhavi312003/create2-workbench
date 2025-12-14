declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { ROOTSTOCK_TESTNET } from '../config/networks';

export default function WalletConnect() {
  const [account, setAccount] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
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
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setAccount('');
      setIsConnected(false);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      alert('Please install MetaMask to use this feature!');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const switchToRootstock = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ROOTSTOCK_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ROOTSTOCK_TESTNET],
          });
        } catch (addError) {
          console.error('Error adding Rootstock network:', addError);
          alert('Failed to add Rootstock network');
        }
      } else {
        console.error('Error switching network:', switchError);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setChainId('');
    setIsConnected(false);
  };

  const isRootstockNetwork = chainId === '31' || chainId === '30';
  const shortenAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="flex items-center gap-3">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="px-4 mt-6 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          {!isRootstockNetwork && (
            <button
              onClick={switchToRootstock}
              className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors animate-pulse"
            >
              Switch to Rootstock
            </button>
          )}
          
          <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${isRootstockNetwork ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs font-mono text-white">
              {shortenAddress(account)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-white hover:text-red-300 text-xs ml-2"
              title="Disconnect"
            >
              ✕
            </button>
          </div>

          {isRootstockNetwork && (
            <span className="text-xs text-white/90 font-medium">
              {chainId === '31' ? '🟢 Rootstock Testnet' : '🟢 Rootstock Mainnet'}
            </span>
          )}
        </>
      )}
    </div>
  );
}
