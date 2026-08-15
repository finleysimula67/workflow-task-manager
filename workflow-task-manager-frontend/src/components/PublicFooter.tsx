import { Link } from "react-router-dom"
import { Globe, ExternalLink, Mail } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
  ],
  Company: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "Status", href: "#" },
  ],
}

function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.05] bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.12] transition-all">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">WorkFlow</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              A clean, fast workspace for managing tasks and staying organized with your team.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <Globe size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <ExternalLink size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-600 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">&copy; 2026 WorkFlow. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-xs text-slate-600 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-slate-600 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
