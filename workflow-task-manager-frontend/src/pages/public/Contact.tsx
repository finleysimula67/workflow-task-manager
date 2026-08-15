import { motion } from "framer-motion"
import PublicNavbar from "../../components/PublicNavbar"
import PublicFooter from "../../components/PublicFooter"
import { Send, Mail, MessageSquare, MapPin, ArrowRight, Zap } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const contactMethods = [
  { icon: Mail, label: "Email", value: "hello@workflow.app" },
  { icon: MessageSquare, label: "Chat", value: "Live chat (coming soon)" },
  { icon: MapPin, label: "Location", value: "Remote · Global team" },
]

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setSending(true)
    // Simulate send
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you soon.")
    setForm({ name: "", email: "", message: "" })
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <PublicNavbar />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <Zap size={12} className="text-primary-400" />
              <span className="text-xs text-primary-300 font-medium">Get in touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              We'd love to{" "}
              <span className="text-gradient">hear from you</span>
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Have a question, feedback, or want to say hello? We're all ears.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {contactMethods.map((method) => (
                <div key={method.label} className="frost-hover p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <method.icon size={18} className="text-primary-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{method.label}</div>
                      <div className="text-sm text-white font-medium mt-0.5">{method.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export default Contact
