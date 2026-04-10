import { FaBitcoin, FaEthereum, FaShieldAlt, FaCode, FaHeart } from 'react-icons/fa'
import { BsLightningCharge } from 'react-icons/bs'
import { GiMining } from 'react-icons/gi'

export function About() {
  return (
    <div className="rs-page max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          About <span className="text-orange-500">Rootstock</span> & CREATE2
        </h1>
        <p className="text-xl rs-muted max-w-3xl mx-auto">
          Empowering Bitcoin with Ethereum-compatible smart contracts through deterministic deployment
        </p>
      </div>

      {/* Rootstock Section */}
      <div className="rs-panel-strong p-8 md:p-12 mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <FaBitcoin className="text-orange-500" />
          About Rootstock (RSK)
        </h2>
        <p className="rs-muted text-lg leading-relaxed mb-6">
          Rootstock (RSK) is a smart contract platform secured by the Bitcoin network through merge-mining. 
          It's the first smart contract platform that enables smart contracts to be secured by the Bitcoin 
          network's hashing power. Rootstock brings Ethereum-compatible smart contracts to Bitcoin, allowing 
          developers to build decentralized applications with Bitcoin-level security.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="rs-card p-6">
            <FaShieldAlt className="text-orange-500 text-2xl mb-4" />
            <h3 className="text-white font-bold mb-2">Bitcoin Security</h3>
            <p className="rs-muted text-sm">Secured by merge-mining with Bitcoin's massive hashing power</p>
          </div>
          <div className="rs-card p-6">
            <FaEthereum className="text-orange-500 text-2xl mb-4" />
            <h3 className="text-white font-bold mb-2">EVM Compatible</h3>
            <p className="rs-muted text-sm">Full support for Ethereum smart contracts and development tools</p>
          </div>
          <div className="rs-card p-6">
            <BsLightningCharge className="text-orange-500 text-2xl mb-4" />
            <h3 className="text-white font-bold mb-2">Native RBTC</h3>
            <p className="rs-muted text-sm">1:1 Bitcoin-pegged native currency for transactions</p>
          </div>
        </div>
      </div>

      {/* CREATE2 Section */}
      <div className="rs-panel-strong p-8 md:p-12 mb-8">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <GiMining className="text-orange-500" />
          What is CREATE2 Workbench?
        </h2>
        <p className="rs-muted text-lg leading-relaxed mb-6">
          CREATE2 Workbench is a production-ready web application that implements EIP-1014 (CREATE2 opcode) 
          for deterministic contract deployment on Rootstock. It allows developers to predict contract 
          addresses before deployment, create vanity addresses with custom prefixes, and deploy contracts 
          to the same address across multiple chains.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">🔮</div>
            <h3 className="text-white font-bold mb-2">Predictable Addresses</h3>
            <p className="rs-muted text-sm">Know contract addresses before deploying</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">💎</div>
            <h3 className="text-white font-bold mb-2">Vanity Mining</h3>
            <p className="rs-muted text-sm">Find custom address prefixes like 0x0000...</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">⚡</div>
            <h3 className="text-white font-bold mb-2">Non-Blocking</h3>
            <p className="rs-muted text-sm">Web Workers for background vanity search</p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="rs-panel-strong p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <FaCode className="text-orange-500" />
          Built For Developers
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Frontend</h3>
            <ul className="space-y-3 rs-muted">
              <li className="flex items-center gap-2">• React 19 with TypeScript</li>
              <li className="flex items-center gap-2">• Vite for lightning-fast builds</li>
              <li className="flex items-center gap-2">• Tailwind CSS for styling</li>
              <li className="flex items-center gap-2">• ethers.js v6 for blockchain interaction</li>
              <li className="flex items-center gap-2">• Web Workers for background computation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Smart Contracts</h3>
            <ul className="space-y-3 rs-muted">
              <li className="flex items-center gap-2">• Solidity 0.8.20</li>
              <li className="flex items-center gap-2">• Foundry development framework</li>
              <li className="flex items-center gap-2">• EIP-1014 CREATE2 implementation</li>
              <li className="flex items-center gap-2">• Minimal audited patterns (reentrancy guard in-factory)</li>
              <li className="flex items-center gap-2">• Comprehensive test suite</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
           <p className="rs-muted text-sm flex items-center gap-2">
                Built with <FaHeart className="text-[#FF6600]" /> for Rootstock Community • Rootstock Hacktivator Program 2026
           </p>
        </div>
      </div>
    </div>
  )
}