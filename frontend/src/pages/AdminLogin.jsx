import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '@/redux/slices/auth/authSlice';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isLoading = status === 'loading';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      const result = await dispatch(adminLogin({ email: form.email, password: form.password }));

      if (adminLogin.fulfilled.match(result)) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.payload || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-amber-600/8 blur-[100px]" />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Header bar */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-6">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner flex-shrink-0">
                <img
                  src="/brgrhut-logo.png"
                  alt="brgrhut"
                  className="w-8 h-8 object-contain drop-shadow"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div>
                <h1
                  className="text-white font-extrabold text-xl leading-tight tracking-tight"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  brgrhut
                </h1>
                <p className="text-orange-100 text-[11px] font-bold uppercase tracking-widest mt-0.5">
                  Admin Portal
                </p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-8">

            {/* Title */}
            <div className="mb-7 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-500/15 flex items-center justify-center border border-orange-500/20">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2
                  className="text-white font-bold text-lg leading-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sign in to Dashboard
                </h2>
                <p className="text-zinc-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Admin access only
                </p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="admin@brgrhut.com"
                    disabled={isLoading}
                    className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-150 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-150 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-orange-500/20 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6">
            <div className="border-t border-zinc-800/60 pt-5 text-center">
              <Link
                to="/"
                className="text-zinc-500 hover:text-orange-400 text-xs transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ← Back to brgrhut.com
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-zinc-700 text-xs mt-5" style={{ fontFamily: "'Inter', sans-serif" }}>
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
