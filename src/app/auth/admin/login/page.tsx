'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore } from '@/lib/authStore';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('admin@fuzion.com');
  const [password, setPassword] = useState('Admin@Secure2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = login(email, password, 'admin');
      setIsLoading(false);

      if (res.success) {
        router.push('/admin/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <AuthCardLayout
      role="admin"
      badgeText="Super Administrator Portal"
      heroHeadline="Institutional Control &amp; Security Operations"
      heroDescription="Manage students, approve faculty registrations, verify parent-child connections, audit security logs, and control academy-wide AI learning models."
      portalTitle="ADMIN LOGIN"
      portalSubtitle="Restricted access for authorized Fuzion Academy administrative personnel only."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700">
          <ShieldAlert className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <span className="font-bold">Security Notice:</span> All access attempts to the administrative control panel are timestamped and logged for institutional audit compliance.
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Registered Administrator Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@fuzion.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Master Password</label>
            <Link
              href="/auth/forgot-password?role=admin"
              className="text-[11px] font-bold text-slate-700 hover:text-black"
            >
              Reset Credentials?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrative master password"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-800 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating Administrative Rights...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>AUTHENTICATE &amp; ENTER ADMIN DASHBOARD</span>
            </>
          )}
        </button>

        {/* IMPORTANT: No Public Sign-up link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            Public registration is disabled. Administrator accounts are issued directly by Super Administration.
          </p>
        </div>
      </form>
    </AuthCardLayout>
  );
}
