import { FaRocket, FaCalculator, FaSearch, FaCode, FaWallet, FaExternalLinkAlt } from 'react-icons/fa'
import { useState } from 'react'
import { BsLightningCharge } from 'react-icons/bs'
import {
  ROOTSTOCK_TESTNET_CREATE2_FACTORY,
  rootstockTestnetExplorerAddress,
} from '../constants/deployments'

export function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const factoryExplorer = rootstockTestnetExplorerAddress(ROOTSTOCK_TESTNET_CREATE2_FACTORY)

  const sections = {
    'getting-started': {
      title: 'Getting Started',
      icon: <FaRocket />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Quick Start Guide</h3>
          
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Prerequisites</h4>
            <ul className="list-disc list-inside space-y-2 text-[#a0a0a0]">
              <li>Node.js 18+ or higher</li>
              <li>npm or yarn package manager</li>
              <li>MetaMask browser extension</li>
              <li>Git for cloning the repository</li>
            </ul>
          </div>

          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Installation</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[#a0a0a0] mb-2">1. Clone the repository:</p>
                <div className="bg-gray-950 rounded-lg p-3 font-mono text-sm text-orange-400">
                  git clone https://github.com/Janhavi312003/create2-workbench.git<br />
                  cd create2-workbench
                </div>
              </div>
              <div>
                <p className="text-[#a0a0a0] mb-2">2. Install OpenZeppelin Dependencies:</p>
                <div className="bg-gray-950 rounded-lg p-3 font-mono text-sm text-orange-400">
                  cd contracts<br />
                  git submodule update --init --recursive<br />
                  # OR<br />
                  forge install OpenZeppelin/openzeppelin-contracts --no-commit<br />
                  forge install
                </div>
              </div>
              <div>
                <p className="text-[#a0a0a0] mb-2">3. Environment Setup:</p>
                <div className="bg-gray-950 rounded-lg p-3 font-mono text-sm text-orange-400">
                  cd contracts<br />
                  cp .env.example .env<br />
                  cd frontend<br />
                  cp .env.example .env
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'calculate-mode': {
      title: 'Calculate Mode',
      icon: <FaCalculator />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Using Calculate Mode</h3>
          
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Step-by-step Guide</h4>
            <ol className="list-decimal list-inside space-y-3 text-[#a0a0a0]">
              <li>Click "Calculate Mode" tab</li>
              <li>Enter Factory Address: <code className="bg-gray-950 px-2 py-1 rounded text-orange-400 text-sm">{ROOTSTOCK_TESTNET_CREATE2_FACTORY}</code></li>
              <li>Enter Salt: Any 32-byte hex value (e.g., 0x0000...0001)</li>
              <li>Enter Init Code Hash: Bytecode hash from Init Helper</li>
              <li>Result: Predicted CREATE2 address shown instantly</li>
              <li>Copy the address for deployment</li>
            </ol>
          </div>

          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Example</h4>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm space-y-2">
              <p><span className="text-orange-500">Factory:</span> {ROOTSTOCK_TESTNET_CREATE2_FACTORY}</p>
              <p><span className="text-orange-500">Salt:</span> 0x0000000000000000000000000000000000000000000000000000000000000001</p>
              <p><span className="text-orange-500">Init Code Hash:</span> 0x1a2b3c...</p>
              <p><span className="text-orange-500">Predicted Address:</span> 0x4e5a... (calculated instantly)</p>
            </div>
          </div>
        </div>
      )
    },
    'find-salt-mode': {
      title: 'Find Salt Mode',
      icon: <FaSearch />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Vanity Salt Mining</h3>
          
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">How to Mine Vanity Addresses</h4>
            <ol className="list-decimal list-inside space-y-3 text-[#a0a0a0]">
              <li>Click "Find Salt Mode" tab</li>
              <li>Enter Factory Address: {ROOTSTOCK_TESTNET_CREATE2_FACTORY}</li>
              <li>Enter Init Code Hash: Bytecode hash from Init Helper</li>
              <li>Enter Target Prefix: Desired address start (e.g., 0000 for 0x0000...)</li>
              <li>Click "Start Mining"</li>
              <li>Wait: Web Worker searches for matching salt</li>
              <li>Result: Salt and address displayed when found</li>
              <li>Copy both values for deployment</li>
            </ol>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BsLightningCharge className="text-orange-500" />
              Pro Tips
            </h4>
            <ul className="space-y-2 text-[#a0a0a0]">
              <li>• Each character adds 16x more difficulty</li>
              <li>• Use 2-4 character prefixes for faster results</li>
              <li>• Mining runs in background - UI stays responsive</li>
              <li>• You can stop and resume mining anytime</li>
            </ul>
          </div>
        </div>
      )
    },
    'init-helper': {
      title: 'Init Code Helper',
      icon: <FaCode />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Calculate Bytecode Hash</h3>
          
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">How to use:</h4>
            <ol className="list-decimal list-inside space-y-3 text-[#a0a0a0]">
              <li>Get your contract bytecode from:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Remix: Compile → Copy bytecode</li>
                  <li>Foundry: forge inspect ContractName bytecode</li>
                  <li>Hardhat: artifacts JSON file</li>
                </ul>
              </li>
              <li>Paste bytecode into text area</li>
              <li>Click "Calculate Hash"</li>
              <li>Copy the hash for use in Calculate/Find Salt modes</li>
            </ol>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Example (SimpleStorage)</h4>
            <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-orange-400 break-all">
              0x608060405234801561001057600080fd5b5061012f806100206000396000f3...
            </div>
            <p className="text-[#a0a0a0] text-sm mt-2">→ Hash: 0x1a2b3c4d5e6f7g8h9i0j...</p>
          </div>
        </div>
      )
    },
    'deployed-contracts': {
      title: 'Deployed Contracts',
      icon: <FaWallet />,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Rootstock Testnet</h3>
          
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-white">Contract</th>
                  <th className="text-left py-3 text-white">Address</th>
                  <th className="text-left py-3 text-white">Explorer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 text-[#a0a0a0]">CREATE2 Factory</td>
                  <td className="py-4">
                    <code className="bg-gray-950 px-2 py-1 rounded text-orange-400 text-sm">
                      {ROOTSTOCK_TESTNET_CREATE2_FACTORY}
                    </code>
                  </td>
                  <td className="py-4">
                    <a 
                      href={factoryExplorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 flex items-center gap-1"
                    >
                      View <FaExternalLinkAlt size={12} />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
            <h4 className="text-lg font-bold text-white mb-3">Network Details</h4>
            <ul className="space-y-2 text-[#a0a0a0]">
              <li>• Chain ID: 31</li>
              <li>• Currency: tRBTC</li>
              <li>• Block Time: ~30 seconds</li>
              <li>• Gas Price: ~0.06 Gwei</li>
              <li>• RPC: https://public-node.testnet.rsk.co</li>
            </ul>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="rs-page">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <span className="text-orange-500">Documentation</span>
        </h1>
        <p className="text-xl rs-muted max-w-3xl mx-auto">
          Everything you need to know about using CREATE2 Workbench on Rootstock
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="rs-panel p-4 sticky top-24">
            <h3 className="text-white font-bold mb-3 px-3">Sections</h3>
            <nav className="space-y-1">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeSection === key
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-500 border border-orange-500/30'
                      : 'rs-muted hover:bg-white/5 hover:text-orange-300'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="rs-panel-strong p-8 md:p-12">
            {sections[activeSection as keyof typeof sections]?.content}
          </div>
        </div>
      </div>
    </div>
  )
}