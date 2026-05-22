import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { hasWalletConnectProjectId } from '../wagmiConfig'
import { InjectedWalletControls } from './InjectedWalletControls'

export function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-orange-500'
        : 'text-[#a0a0a0] hover:text-orange-500'
    }`

  return (
    <nav className="bg-black border-b border-[#2a2a2a] py-4 px-6">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-orange-600 focus:text-white"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
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

          {/* Navigation Links — desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>
              Dashboard
            </Link>
            <Link to="/docs" className={navLinkClass('/docs')}>
              Docs
            </Link>
            <Link to="/faq" className={navLinkClass('/faq')}>
              FAQ
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              About
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')}>
              Contact
            </Link>
          </div>

          {/* Right side — wallet */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              type="button"
              className="md:hidden p-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] hover:text-orange-500"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            {hasWalletConnectProjectId ? (
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
            ) : (
              <InjectedWalletControls />
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="md:hidden mt-4 pb-2 flex flex-col gap-3 border-t border-[#2a2a2a] pt-4"
          >
            <Link to="/" className={navLinkClass('/')} onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link to="/docs" className={navLinkClass('/docs')} onClick={() => setMobileOpen(false)}>
              Docs
            </Link>
            <Link to="/faq" className={navLinkClass('/faq')} onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link to="/about" className={navLinkClass('/about')} onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link to="/contact" className={navLinkClass('/contact')} onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}