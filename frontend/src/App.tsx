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
      
      <Routes>
        <Route path="/" element={
          <div className="rs-page flex-grow">
            {/* Header */}
            <header className="text-center mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1"></div>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl text-orange-300/90 font-semibold max-w-2xl mx-auto drop-shadow-lg">
                    Deterministic Contract Deployment Tool for Rootstock
                  </p>
                </div>
                <div className="flex-1 flex justify-end">
                  {/* Deployed Contracts Toggle */}
                  {deployedContracts.length > 0 && (
                    <button
                      onClick={() => setShowDeployedList(!showDeployedList)}
                      className="rs-btn px-4 py-2 text-orange-300 hover:text-orange-200"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      {deployedContracts.length} Deployed
                    </button>
                  )}
                </div>
              </div>
            </header>

            {/* Tab Bar */}
            <div className="rs-panel p-1 flex mb-8">
              <button
                className={`flex-1 py-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 ${
                  activeMode === "calculate"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 transform scale-105"
                    : "text-orange-200/90 hover:bg-white/5 hover:text-orange-200"
                }`}
                onClick={() => setActiveMode("calculate")}
              >
                Calculate Address
              </button>
              <button
                className={`flex-1 py-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 ${
                  activeMode === "find"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 transform scale-105"
                    : "text-orange-200/90 hover:bg-white/5 hover:text-orange-200"
                }`}
                onClick={() => setActiveMode("find")}
              >
                Find Vanity Salt
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
                  {deployedContracts.map((contract, index) => (
                    <div key={index} className="border rounded-2xl overflow-hidden border-white/10">
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

      <Footer />
    </div>
  );
}

export default App;