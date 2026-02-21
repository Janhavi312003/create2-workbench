import { useState } from 'react'
import { FaGithub, FaTwitter, FaDiscord, FaEnvelope, FaBug, FaBook, FaExternalLinkAlt  } from 'react-icons/fa'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - you can integrate with a form service
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Get in <span className="text-orange-500">Touch</span>
        </h1>
        <p className="text-xl text-[#a0a0a0] max-w-3xl mx-auto">
          Have questions? Need help? We're here for you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaGithub className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">GitHub Issues</h3>
          <p className="text-[#a0a0a0] text-sm mb-4">Report bugs or contribute</p>
          <a 
            href="https://github.com/Janhavi312003/create2-workbench/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center gap-1"
          >
            Open an Issue <FaExternalLinkAlt size={12} />
          </a>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaBook className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">Documentation</h3>
          <p className="text-[#a0a0a0] text-sm mb-4">Check our docs first</p>
          <a 
            href="/docs"
            className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center gap-1"
          >
            Read Docs <FaExternalLinkAlt size={12} />
          </a>
        </div>

        <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaDiscord className="text-orange-500 text-2xl" />
          </div>
          <h3 className="text-white font-bold mb-2">Community</h3>
          <p className="text-[#a0a0a0] text-sm mb-4">Join our Discord</p>
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
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaEnvelope className="text-orange-500" />
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="How can we help you?"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="space-y-6">
          <div className="bg-gray-900/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Support</h2>
            <p className="text-[#a0a0a0] mb-6">
              For technical issues, feature requests, or questions about CREATE2 Workbench, 
              feel free to reach out through any of these channels:
            </p>
            
            <div className="space-y-4">
              <a 
                href="https://github.com/Janhavi312003/create2-workbench/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#a0a0a0] hover:text-orange-500 transition-colors"
              >
                <FaBug className="text-lg" />
                <span>Report a Bug</span>
              </a>
              <a 
                href="https://github.com/Janhavi312003/create2-workbench/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#a0a0a0] hover:text-orange-500 transition-colors"
              >
                <FaGithub className="text-lg" />
                <span>GitHub Discussions</span>
              </a>
              <a 
                href="https://twitter.com/rootstock_io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#a0a0a0] hover:text-orange-500 transition-colors"
              >
                <FaTwitter className="text-lg" />
                <span>Twitter</span>
              </a>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Built For</h2>
            <p className="text-[#a0a0a0] mb-4">
              Rootstock Hacktivator Program 2026
            </p>
            <p className="text-[#a0a0a0] text-sm">
              This project demonstrates production-ready tooling for Rootstock developers, 
              implementing full EIP-1014 support for deterministic contract deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}