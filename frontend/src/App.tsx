import { useState } from "react";
import CalculateMode from "./components/CalculateMode";
import FindSaltMode from "./components/FindSaltMode";
import InitCodeHelper from "./components/InitCodeHelper";
import WalletConnect from "./components/WalletConnect";

function App() {
  const [activeMode, setActiveMode] = useState<"calculate" | "find">("calculate");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        <header className="text-center text-white mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-5 mt-5">
                CREATE2 Workbench
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Deterministic Contract Deployment Tool for Rootstock
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <WalletConnect />
            </div>
          </div>
        </header>

        <div className="bg-white/10 rounded-2xl p-1 flex mb-4">
          <button
            className={`flex-1 py-2 rounded-xl text-sm md:text-base font-medium transition ${
              activeMode === "calculate"
                ? "bg-white text-indigo-600 shadow"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveMode("calculate")}
          >
            Calculate Address
          </button>
          <button
            className={`flex-1 py-2 rounded-xl text-sm md:text-base font-medium transition ${
              activeMode === "find"
                ? "bg-white text-indigo-600 shadow"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setActiveMode("find")}
          >
            Find Vanity Salt
          </button>
        </div>

        <main className="bg-white rounded-2xl shadow-xl p-5 md:p-8 grid md:grid-cols-[2fr_1.2fr] gap-6">
          <section>
            {activeMode === "calculate" ? <CalculateMode /> : <FindSaltMode />}
          </section>
          <aside>
            <InitCodeHelper />
          </aside>
        </main>

        <footer className="text-center text-white text-xs md:text-sm mt-6 mb-5 opacity-90">
          <p>
            © 2025 Built for{" "}
            <a
              href="https://dev.rootstock.io"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Rootstock
            </a>{" "}
            • EIP‑1014 Compliant • Open Source • Education Purpose.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
