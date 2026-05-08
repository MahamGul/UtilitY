import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertCircle, Wrench } from 'lucide-react';
import { adminAuth } from '../services/api';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero-illustration.png';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await adminAuth.login(email, password);
      if (res.data.status === 'success') {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        setTimeout(() => navigate('/admin-dashboard'), 1200);
      } else {
        setError('Invalid credentials or not authorized as admin');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">

      {/* ── LEFT PANEL (ILLUSTRATION) ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            Utilit<span className="text-teal-600">Y</span> <span className="text-sm text-gray-600 font-semibold ml-1">Admin</span>
          </span>
        </div>

        {/* Center Illustration */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <img 
            src={heroImg} 
            alt="Platform Management" 
            className="w-full max-w-sm drop-shadow-xl opacity-95 object-contain"
          />
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-extrabold mb-2" style={{
            backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Manage Your Platform
          </h3>
          <p className="text-gray-700 text-sm max-w-sm leading-relaxed">
            Verify service providers, review customer reports, and monitor your entire marketplace — all in one powerful dashboard.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            {[['15K+', 'Verified'], ['98K+', 'Services'], ['4.9★', 'Trust']].map(([v, l]) => (
              <div key={l} className="bg-white rounded-xl px-4 py-2 shadow-sm">
                <p className="text-sm font-extrabold text-teal-600">{v}</p>
                <p className="text-xs text-gray-600">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (LOGIN FORM) ── */}
      <div className="w-full lg:w-[480px] flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900">Utilit<span className="text-teal-500">Y</span> Admin</span>
          </div>

          {/* Card */}
          <div className="border border-gray-200 rounded-2xl p-8 shadow-sm bg-white">

            {/* Icon + title */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold" style={{
                backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Admin Access
              </h2>
              <p className="text-gray-500 text-sm mt-2">Secure login for authorized administrators</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex gap-2.5">
                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-5 p-3.5 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="text-teal-700 text-sm font-semibold">{success}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors bg-white text-sm text-gray-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPwd ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors bg-white text-sm text-gray-800 placeholder-gray-400"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 text-white font-bold text-sm transition-all hover:shadow-lg shadow-md duration-200"
              >
                {loading ? 'Verifying...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                Need help? <a href="#" className="text-teal-600 font-semibold hover:text-teal-700">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
