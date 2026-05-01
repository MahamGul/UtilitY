import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { adminAuth } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminAuth.login(email, password);

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.status === "success") {
        setSuccess('Login successful! Redirecting...');

        // IMPORTANT: store user (NOT token)
        localStorage.setItem(
          'adminUser',
          JSON.stringify(response.data.user)
        );

setTimeout(() => {
          navigate('/admin-dashboard'); // FIXED: Correct route from App.jsx
        }, 1200);

      } else {
        setError('Invalid credentials or not authorized as admin');
      }

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-cyan-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4">
              <Shield className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white text-opacity-90">
            Utility Platform Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Utility</h2>
            <p className="text-gray-600 text-sm">Administrator Access</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@utility.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              🔐 {loading ? 'Logging in...' : 'Login as Admin'}
            </button>

          </form>

          {/* Demo */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold text-sm mb-2">
              Demo Credentials:
            </p>
            <p className="text-blue-600 text-sm">
              Email: admin@utility.com
            </p>
            <p className="text-blue-600 text-sm">
              Password: admin123
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          🔒 Secure Admin System
        </div>

      </div>
    </div>
  );
}