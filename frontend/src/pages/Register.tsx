import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authApi } from "../api/authApi"
import toast from "react-hot-toast"
import { Eye, EyeOff, Check, X } from "lucide-react"

type Strength = "weak" | "fair" | "good" | "strong"

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" })
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [strength, setStrength] = useState<Strength>("weak")

  useEffect(() => {
    const handle = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload() }
    window.addEventListener("pageshow", handle)
    return () => window.removeEventListener("pageshow", handle)
  }, [])

  const calcStrength = (p: string): Strength => {
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[a-z]/.test(p)) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[@#$%^&+=!]/.test(p)) score++
    if (score <= 2) return "weak"
    if (score <= 4) return "fair"
    if (score <= 5) return "good"
    return "strong"
  }

  const strengthColor = { weak: "bg-red-500/50", fair: "bg-orange-500/50", good: "bg-yellow-500/50", strong: "bg-green-500/50" }
  const strengthLabel = { weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" }
  const strengthWidth = { weak: "25%", fair: "50%", good: "75%", strong: "100%" }

  const requirements = [
    { label: "8+ characters", met: form.password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "Lowercase letter", met: /[a-z]/.test(form.password) },
    { label: "Number", met: /[0-9]/.test(form.password) },
    { label: "Special character", met: /[@#$%^&+=!]/.test(form.password) },
  ]

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.username) e.username = "Username is required"
    else if (form.username.length < 3) e.username = "At least 3 characters"
    if (!form.email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
    if (!form.password) e.password = "Password is required"
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await authApi.register(form)
      if (res.success) {
        toast.success("Registration successful! Check your email to verify.")
        setTimeout(() => navigate("/login"), 2000)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.")
    } finally {
      setLoading(false)
    }
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
            Build better habits.<br />One task at a time.
          </h2>
          <p className="text-sm text-slate-500 max-w-sm">
            Start organizing your work and tracking your progress.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Create account</h2>
            <p className="text-sm text-slate-500">Join WorkFlow today</p>
          </div>

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
              <label className="block text-xs text-slate-400 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => {
                  setForm({ ...form, username: e.target.value })
                  setErrors({ ...errors, username: "" })
                }}
                placeholder="johndoe"
                className={`w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border text-sm text-white placeholder-slate-600 outline-none transition ${errors.username ? "border-red-500/50" : "border-white/[0.08] focus:border-white/[0.15]"}`}
              />
              {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => {
                  setForm({ ...form, email: e.target.value })
                  setErrors({ ...errors, email: "" })
                }}
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
                  onChange={e => {
                    setForm({ ...form, password: e.target.value })
                    setStrength(calcStrength(e.target.value))
                    setErrors({ ...errors, password: "" })
                  }}
                  placeholder="Create a password"
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-white/[0.03] border text-sm text-white placeholder-slate-600 outline-none transition ${errors.password ? "border-red-500/50" : "border-white/[0.08] focus:border-white/[0.15]"}`}
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              {form.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-500">Strength</span>
                    <span className="text-[11px] text-slate-400">{strengthLabel[strength]}</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strengthColor[strength]}`} style={{ width: strengthWidth[strength] }} />
                  </div>
                  <div className="mt-2 space-y-1">
                    {requirements.map((r, i) => (
                      <div key={i} className={`flex items-center gap-1.5 text-[11px] ${r.met ? "text-green-400" : "text-slate-600"}`}>
                        {r.met ? <Check size={12} /> : <X size={12} />}
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={e => {
                    setForm({ ...form, confirmPassword: e.target.value })
                    setErrors({ ...errors, confirmPassword: "" })
                  }}
                  placeholder="Re-enter password"
                  className={`w-full px-4 py-2.5 pr-10 rounded-lg bg-white/[0.03] border text-sm text-white placeholder-slate-600 outline-none transition ${errors.confirmPassword ? "border-red-500/50" : "border-white/[0.08] focus:border-white/[0.15]"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
              {form.confirmPassword && (
                <div className={`mt-1 flex items-center gap-1.5 text-[11px] ${form.password === form.confirmPassword ? "text-green-400" : "text-red-400"}`}>
                  {form.password === form.confirmPassword ? <Check size={12} /> : <X size={12} />}
                  {form.password === form.confirmPassword ? "Passwords match" : "Passwords don't match"}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all disabled:opacity-50">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-slate-400 hover:text-white transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
