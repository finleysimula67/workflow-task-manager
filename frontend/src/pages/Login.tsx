import { useState, useEffect } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { authApi } from "../api/authApi"
import toast from "react-hot-toast"
import { Eye, EyeOff, Clock } from "lucide-react"

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({ email: "", password: "", rememberMe: false })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lastLogin, setLastLogin] = useState<string | null>(null)

  useEffect(() => {
    const handle = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload() }
    window.addEventListener("pageshow", handle)
    const remembered = authApi.getRememberedEmail()
    if (remembered) setForm(prev => ({ ...prev, email: remembered, rememberMe: true }))
    const stored = authApi.getLastLogin()
    if (stored) setLastLogin(stored)
    return () => window.removeEventListener("pageshow", handle)
  }, [])

  useEffect(() => {
    const error = searchParams.get("error")
    const message = searchParams.get("message")
    if (error === "oauth2_failed") toast.error(message || "Google login failed.")
  }, [searchParams])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
    if (!form.password) e.password = "Password is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authApi.login(form)
      if (res.success) {
        toast.success(res.message || "Login successful!")
        setTimeout(() => window.location.href = '/dashboard', 500)
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const formatLastLogin = (s: string) => {
    const diff = Date.now() - new Date(s).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "Just now"
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-black flex">
      <div className="hidden md:flex w-1/2 items-center justify-center px-16">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">W</span>
            </div>
            <span className="text-lg font-semibold text-white">WorkFlow</span>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Stay organized.<br />Stay consistent.
          </h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Manage your tasks, track progress, and build a better workflow.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to your account</p>
          </div>

          {lastLogin && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <Clock size={14} />
              <span>Last login: {formatLastLogin(lastLogin)}</span>
            </div>
          )}

          <button
            onClick={() => window.location.assign("http://localhost:8080/oauth2/authorization/google")}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white transition mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-black text-slate-600">or email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border text-sm text-white placeholder-slate-600 outline-none transition ${errors.email ? "border-red-500/50" : "border-white/[0.08] focus:border-white/[0.15]"}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-white/[0.03] border text-sm text-white placeholder-slate-600 outline-none transition ${errors.password ? "border-red-500/50" : "border-white/[0.08] focus:border-white/[0.15]"}`}
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                <input type="checkbox" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} className="w-3.5 h-3.5 rounded border-white/[0.15] bg-white/[0.03]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-slate-300 transition">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-50">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-slate-400 hover:text-white transition">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
