import { useState } from "react";
import CalculateMode from "./components/CalculateMode";
import FindSaltMode from "./components/FindSaltMode";
import InitCodeHelper from "./components/InitCodeHelper";
import WalletConnect from "./components/WalletConnect";

function App() {
  const [activeMode, setActiveMode] = useState<"calculate" | "find">(
    "calculate",
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-950 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black text-orange-400 mb-6 tracking-tight drop-shadow-xl">
                CREATE2 Workbench
              </h1>
              <p className="text-xl md:text-2xl text-orange-300/90 font-semibold max-w-2xl mx-auto drop-shadow-lg">
                Deterministic Contract Deployment Tool for Rootstock
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <WalletConnect />
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl p-1 flex mb-8 border border-gray-700 shadow-xl">
          <button
            className={`flex-1 py-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 ${
              activeMode === "calculate"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 transform scale-105"
                : "text-orange-300 hover:bg-gray-800/50 hover:text-orange-200 hover:shadow-lg"
            }`}
            onClick={() => setActiveMode("calculate")}
          >
            Calculate Address
          </button>
          <button
            className={`flex-1 py-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-300 ${
              activeMode === "find"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/40 transform scale-105"
                : "text-orange-300 hover:bg-gray-800/50 hover:text-orange-200 hover:shadow-lg"
            }`}
            onClick={() => setActiveMode("find")}
          >
            Find Vanity Salt
          </button>
        </div>

        {/* Main Content */}
        <main className="bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-700 grid md:grid-cols-[2fr_1.2fr] gap-8">
          <section>
            {activeMode === "calculate" ? <CalculateMode /> : <FindSaltMode />}
          </section>
          <aside>
            <InitCodeHelper />
          </aside>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 inline-block">
            <p className="text-orange-300 text-sm md:text-base font-semibold drop-shadow-md">
              © 2025 Built for{" "}
              <a
                href="https://dev.rootstock.io"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 font-bold hover:text-orange-300 transition underline"
              >
                Rootstock
              </a>{" "}
              • EIP‑1014 Compliant • Open Source • Education Purpose.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
