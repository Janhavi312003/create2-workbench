import { FaGithub, FaTwitter, FaDiscord, FaEnvelope, FaBug, FaBook, FaExternalLinkAlt  } from 'react-icons/fa'

export function Contact() {
  return (
    <div className="rs-page max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get in <span className="text-orange-500">Touch</span>
        </h1>
        <p className="text-xl rs-muted max-w-3xl mx-auto">
          Have questions? Need help? We're here for you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="rs-card p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaGithub className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">GitHub Issues</h3>
          <p className="rs-muted text-sm mb-4">Report bugs or contribute</p>
          <a 
            href="https://github.com/Janhavi312003/create2-workbench/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center gap-1"
          >
            Open an Issue <FaExternalLinkAlt size={12} />
          </a>
        </div>

        <div className="rs-card p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">Documentation</h3>
          <p className="rs-muted text-sm mb-4">Check our docs first</p>
          <a 
            href="/docs"
            className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center gap-1"
          >
            Read Docs <FaExternalLinkAlt size={12} />
          </a>
        </div>

        <div className="rs-card p-6 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaDiscord className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">Community</h3>
          <p className="rs-muted text-sm mb-4">Join our Discord</p>
          <a 
            href="https://discord.gg/rootstock"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center gap-1"
          >
            Join Discord <FaExternalLinkAlt size={12} />
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="rs-panel-strong p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaEnvelope className="text-orange-500" />
            Contact
          </h2>

          <p className="rs-muted mb-6 leading-relaxed">
            This page does not collect messages in-app. For feedback or questions, use GitHub Issues or the official Rootstock contact page.
          </p>

          <a
            href="https://rootstock.io/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center items-center rs-btn-primary py-4 rounded-2xl font-semibold"
          >
            Contact Rootstock
          </a>
          <p className="text-xs rs-muted mt-4">
            For bugs and feature requests on this workbench, GitHub Issues is usually fastest.
          </p>
        </div>

        {/* Additional Info */}
        <div className="space-y-6">
          <div className="rs-panel p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Support</h2>
            <p className="rs-muted mb-6">
              For technical issues, feature requests, or questions about CREATE2 Workbench, 
              feel free to reach out through any of these channels:
            </p>
            
            <div className="space-y-4">
              <a 
                href="https://github.com/Janhavi312003/create2-workbench/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rs-muted hover:text-orange-300 transition-colors"
              >
                <FaBug className="text-lg" />
                <span>Report a Bug</span>
              </a>
              <a 
                href="https://github.com/Janhavi312003/create2-workbench/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rs-muted hover:text-orange-300 transition-colors"
              >
                <FaGithub className="text-lg" />
                <span>GitHub Discussions</span>
              </a>
              <a 
                href="https://twitter.com/rootstock_io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rs-muted hover:text-orange-300 transition-colors"
              >
                <FaTwitter className="text-lg" />
                <span>Twitter</span>
              </a>
            </div>
          </div>

          <div className="bg-orange-500/8 border border-orange-500/25 rounded-3xl p-8 backdrop-blur-sm shadow-[0_18px_55px_rgba(255,102,0,0.10)]">
            <h2 className="text-2xl font-bold text-white mb-4">Built For</h2>
            <p className="rs-muted mb-4">
              Rootstock Hacktivator Program 2026
            </p>
            <p className="rs-muted text-sm">
              This project demonstrates production-ready tooling for Rootstock developers, 
              implementing full EIP-1014 support for deterministic contract deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}