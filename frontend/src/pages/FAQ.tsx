import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaRocket,
  FaWallet,
  FaShieldAlt,
} from "react-icons/fa";
import {
  ROOTSTOCK_TESTNET_CREATE2_FACTORY,
  rootstockTestnetExplorerAddress,
} from "../constants/deployments";

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const factoryExplorer = rootstockTestnetExplorerAddress(
    ROOTSTOCK_TESTNET_CREATE2_FACTORY,
  );

  const faqCategories = [
    {
      title: "General Questions",
      icon: <FaQuestionCircle />,
      items: [
        {
          q: "What is CREATE2 Workbench?",
          a: "CREATE2 Workbench is a production-ready web application that implements EIP-1014 (CREATE2 opcode) for deterministic contract deployment on Rootstock. It allows developers to predict contract addresses before deployment, create vanity addresses with custom prefixes, and deploy contracts to the same address across multiple chains.",
        },
        {
          q: "What is Rootstock (RSK)?",
          a: "Rootstock (RSK) is a smart contract platform secured by the Bitcoin network through merge-mining. It's the first smart contract platform that enables smart contracts to be secured by the Bitcoin network's hashing power. Rootstock brings Ethereum-compatible smart contracts to Bitcoin, allowing developers to build decentralized applications with Bitcoin-level security.",
        },
        {
          q: "Is this tool free to use?",
          a: "Yes! CREATE2 Workbench is completely free and open-source. All calculations happen client-side in your browser, and there are no fees for using the tool. You only pay regular gas fees when deploying contracts on the Rootstock network.",
        },
        {
          q: "Do I need to install anything?",
          a: "You only need MetaMask wallet installed in your browser. The tool runs entirely in your browser - no additional installation required. For developers who want to run locally, you can clone the repository and run it with npm.",
        },
      ],
    },
    {
      title: "Technical Questions",
      icon: <FaRocket />,
      items: [
        {
          q: "How does CREATE2 work?",
          a: "CREATE2 uses the formula: address = keccak256(0xff ++ deployer ++ salt ++ keccak256(init_code))[12:]. Where 0xff is a constant prefix, deployer is the factory address, salt is a 32-byte value you provide, and init_code is your contract's bytecode. This makes contract addresses completely deterministic and predictable.",
        },
        {
          q: "What's the difference between Calculate and Find Salt modes?",
          a: "Calculate Mode instantly predicts the contract address when you provide a specific salt value. Find Salt Mode searches for a salt that produces an address with your desired prefix (vanity address) - it's like mining for a custom address.",
        },
        {
          q: "How long does vanity address mining take?",
          a: "It depends on your prefix length. Each character (hex digit) adds 16x more difficulty. For example: 2 characters takes ~1 second, 3 characters ~16 seconds, 4 characters ~4 minutes. We recommend using 2-4 character prefixes for reasonable mining times.",
        },
        {
          q: "Is my private key safe?",
          a: "Absolutely! All calculations happen locally in your browser. Your private key is never transmitted or stored. We only use it through MetaMask for signing transactions when you actually deploy contracts.",
        },
      ],
    },
    {
      title: "Rootstock Specific",
      icon: <FaWallet />,
      items: [
        {
          q: "Which Rootstock networks are supported?",
          a: "Both Rootstock Mainnet (Chain ID: 30) and Rootstock Testnet (Chain ID: 31) are fully supported. The tool automatically detects which network you're connected to through MetaMask.",
        },
        {
          q: "Where can I get tRBTC for testnet?",
          a: "You can get free tRBTC from the Rootstock faucet: https://faucet.rootstock.io. This allows you to test deployments without using real funds.",
        },
        {
          q: "What's the factory contract address?",
          a: `The CREATE2 factory on Rootstock Testnet is ${ROOTSTOCK_TESTNET_CREATE2_FACTORY}. Verify on the explorer: ${factoryExplorer}. Set the same address as VITE_FACTORY_ADDRESS in your frontend .env.`,
        },
      ],
    },
    {
      title: "Troubleshooting",
      icon: <FaShieldAlt />,
      items: [
        {
          q: "Why am I getting 'Wrong Network' error?",
          a: "This means your MetaMask is connected to a different network. Click the 'Wrong Network' button or manually switch to Rootstock Testnet (Chain ID: 31) or Mainnet (Chain ID: 30) in MetaMask.",
        },
        {
          q: "The vanity miner is taking too long!",
          a: "Try using a shorter prefix (2-3 characters). Also, you can increase the max attempts or try again - sometimes you get lucky! Remember that each additional character makes it 16x harder.",
        },
        {
          q: "My calculated address doesn't match?",
          a: `Double-check your inputs: factory address must match your deployment (documented default: ${ROOTSTOCK_TESTNET_CREATE2_FACTORY}), salt (32-byte hex), and init code hash (from Init Helper). No extra spaces; hex must use a 0x prefix.`,
        },
        {
          q: "The Init Code Helper gives wrong hash?",
          a: "Ensure you're copying the full bytecode from Remix or Foundry, including the '0x' prefix. The bytecode should be the creation code, not the runtime code.",
        },
      ],
    },
  ];

  return (
    <div className="rs-page max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Frequently Asked <span className="text-orange-500">Questions</span>
        </h1>
        <p className="text-xl rs-muted max-w-3xl mx-auto">
          Everything you need to know about CREATE2 Workbench and Rootstock
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {faqCategories.map((category, catIndex) => (
          <div
            key={catIndex}
            className="rs-panel-strong overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-gradient-to-r from-orange-500/18 to-transparent p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-orange-500">{category.icon}</span>
                {category.title}
              </h2>
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-white/10">
              {category.items.map((item, itemIndex) => {
                const globalIndex = catIndex * 100 + itemIndex;
                const isOpen = openItems.includes(globalIndex);

                return (
                  <div key={itemIndex} className="p-6">
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-500 transition-colors pr-8">
                        {item.q}
                      </h3>
                      <div
                        className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? "bg-orange-500 rotate-180" : "group-hover:bg-white/10"}`}
                      >
                        {isOpen ? (
                          <FaChevronUp className="text-white" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-4 rs-muted leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 text-center">
        <div className="bg-orange-500/8 border border-orange-500/25 rounded-3xl p-8 backdrop-blur-sm shadow-[0_18px_55px_rgba(255,102,0,0.10)]">
          <h2 className="text-2xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="rs-muted mb-6">
            Can't find what you're looking for? Reach out to us!
          </p>
          <a
            href="https://rootstock.io/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
