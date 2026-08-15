import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "../lib/utils"

const links = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/70 backdrop-blur-2xl border-b border-white/[0.05]"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.12] transition-all">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span className="text-base font-bold text-white tracking-tight">WorkFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-white"
                    : "text-slate-400 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20"
            >
              Get started
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white transition"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.04] bg-black/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "block text-sm font-medium py-2 transition-colors",
                    location.pathname === link.href ? "text-white" : "text-slate-400 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/[0.06] pt-5 space-y-3">
                <Link
                  to="/login"
                  className="block text-sm font-medium text-slate-400 hover:text-white py-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
