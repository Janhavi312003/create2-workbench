import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CalculateMode from "./components/CalculateMode";
import FindSaltMode from "./components/FindSaltMode";
import InitCodeHelper from "./components/InitCodeHelper";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { About } from "./pages/About";
import { Docs } from "./pages/Docs";
import { FAQ } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { InteractWithDeployed } from "./components/InteractWithDeployed";

interface DeployedContract {
  address: `0x${string}`;
  timestamp: number;
  salt?: string;
}

function App() {
  const [activeMode, setActiveMode] = useState<"calculate" | "find">(
    "calculate",
  );
  
  // Track deployed contracts
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);
  const [showDeployedList, setShowDeployedList] = useState(false);

  // FIXED VERSION - with proper syntax
  const handleDeploySuccess = (address: `0x${string}`, salt?: string) => {
    setDeployedContracts(prev => {
      const newContracts = [
        { address, timestamp: Date.now(), salt },
        ...prev
      ];
      return newContracts.slice(0, 10); // Keep last 10 deployments
    });
  };

  const clearDeployed = () => {
    setDeployedContracts([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0B0B0F] text-white">
      {/* Rootstock-inspired subtle backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(900px_420px_at_15%_-10%,rgba(91,108,255,0.18),transparent_60%),radial-gradient(700px_360px_at_88%_12%,rgba(255,102,0,0.12),transparent_55%),radial-gradient(900px_520px_at_50%_115%,rgba(120,80,255,0.10),transparent_60%)]" />
      <Navbar />

      <main id="main-content" className="flex-grow w-full min-w-0">
      <Routes>
        <Route path="/" element={
          <div className="rs-page flex-grow">
            {/* Header */}
            <header className="text-center mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1 hidden sm:block" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base text-[#a0a0a0] font-normal max-w-2xl mx-auto leading-relaxed">
                    Deterministic contract deployment for Rootstock — predict
                    addresses (CREATE2) or mine a vanity salt.
                  </p>
                </div>
                <div className="flex-1 flex justify-center sm:justify-end">
                  {deployedContracts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowDeployedList(!showDeployedList)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm font-medium text-[#a0a0a0] hover:border-orange-500/40 hover:text-orange-300 transition-colors"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      {deployedContracts.length} deployed
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Mode switch — compact labels, Rootstock-style bar */}
            <div
              className="mb-8 flex flex-col gap-1 rounded-2xl border border-[#2a2a2a] bg-black/50 p-1 sm:flex-row"
              role="tablist"
              aria-label="Workbench mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === "calculate"}
                className={`rounded-xl px-3 py-2.5 text-left transition-colors sm:flex-1 sm:text-center ${
                  activeMode === "calculate"
                    ? "bg-[#FF6600] text-white shadow-[0_0_0_1px_rgba(255,102,0,0.35)]"
                    : "text-[#a0a0a0] hover:bg-white/[0.04] hover:text-white"
                }`}
                onClick={() => setActiveMode("calculate")}
              >
                <span className="block text-sm font-medium">Calculate</span>
                <span
                  className={`mt-0.5 block text-xs font-normal ${
                    activeMode === "calculate"
                      ? "text-white/85"
                      : "text-[#a0a0a0]"
                  }`}
                >
                  Predict CREATE2 address
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeMode === "find"}
                className={`rounded-xl px-3 py-2.5 text-left transition-colors sm:flex-1 sm:text-center ${
                  activeMode === "find"
                    ? "bg-[#FF6600] text-white shadow-[0_0_0_1px_rgba(255,102,0,0.35)]"
                    : "text-[#a0a0a0] hover:bg-white/[0.04] hover:text-white"
                }`}
                onClick={() => setActiveMode("find")}
              >
                <span className="block text-sm font-medium">Find salt</span>
                <span
                  className={`mt-0.5 block text-xs font-normal ${
                    activeMode === "find" ? "text-white/85" : "text-[#a0a0a0]"
                  }`}
                >
                  Vanity prefix search
                </span>
              </button>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-[2fr_1.2fr] gap-8">
              <section>
                {activeMode === "calculate" ? (
                  <CalculateMode />
                ) : (
                  <FindSaltMode onDeploySuccess={handleDeploySuccess} />
                )}
              </section>
              <aside>
                <InitCodeHelper />
              </aside>
            </div>

            {/* Deployed Contracts List */}
            {showDeployedList && deployedContracts.length > 0 && (
              <div className="mt-12 rs-panel-strong p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Your Deployed Contracts
                  </h3>
                  <button
                    onClick={clearDeployed}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
                
                <div className="space-y-6">
                  {deployedContracts.map((contract) => (
                    <div
                      key={`${contract.address}-${contract.timestamp}`}
                      className="border rounded-2xl overflow-hidden border-white/10"
                    >
                      <div className="bg-white/5 p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 font-mono text-sm">
                            Deployed {new Date(contract.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                      <InteractWithDeployed contractAddress={contract.address} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        } />
        
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;