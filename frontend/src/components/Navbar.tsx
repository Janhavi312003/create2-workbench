import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-black border-b border-[#2a2a2a] py-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-xl">C2</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">
                CREATE2<span className="text-orange-500">Workbench</span>
              </h1>
              <p className="text-[#a0a0a0] text-xs">Rootstock Deployment Tool</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-orange-500' 
                  : 'text-[#a0a0a0] hover:text-orange-500'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/docs" 
              className={`text-sm font-medium transition-colors ${
                isActive('/docs') 
                  ? 'text-orange-500' 
                  : 'text-[#a0a0a0] hover:text-orange-500'
              }`}
            >
              Docs
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors ${
                isActive('/faq') 
                  ? 'text-orange-500' 
                  : 'text-[#a0a0a0] hover:text-orange-500'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-orange-500' 
                  : 'text-[#a0a0a0] hover:text-orange-500'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-orange-500' 
                  : 'text-[#a0a0a0] hover:text-orange-500'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side - Theme Toggle and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] hover:text-orange-500 hover:border-orange-500/30 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            {/* RainbowKit Connect Button - Keep existing code */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading'
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated')

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
                          >
                            Connect Wallet
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-all"
                          >
                            Wrong Network
                          </button>
                        )
                      }

                      return (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={openChainModal}
                            className="flex items-center space-x-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] px-3 py-2 rounded-xl transition-all"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 20,
                                  height: 20,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 20, height: 20 }}
                                  />
                                )}
                              </div>
                            )}
                            <span className="text-white text-sm font-medium">
                              {chain.name}
                            </span>
                          </button>

                          <button
                            onClick={openAccountModal}
                            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-3 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20"
                          >
                            <span className="text-white text-sm font-medium">
                              {account.displayName}
                            </span>
                            <span className="text-white/80 text-xs bg-white/20 px-2 py-0.5 rounded-lg">
                              {account.displayBalance
                                ? ` ${account.displayBalance}`
                                : ''}
                            </span>
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  )
}