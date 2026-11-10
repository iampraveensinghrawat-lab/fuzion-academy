'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore } from '@/lib/authStore';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle, Info } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setIsPendingApproval(false);

    setTimeout(() => {
      const res = login(emailOrMobile, password, 'teacher');
      setIsLoading(false);

      if (res.success) {
        router.push('/teacher/dashboard');
      } else {
        if (res.message.includes('pending Administrator approval')) {
          setIsPendingApproval(true);
        } else {
          setErrorMessage(res.message);
        }
      }
    }, 600);
  };

  return (
    <AuthCardLayout
      role="teacher"
      badgeText="Faculty &amp; Trainer Portal"
      heroHeadline="Empower Students. Track Real-World Spoken Growth."
      heroDescription="Manage classroom batches, review speaking recordings, assign targeted grammar games, mark attendance, and upload customized curriculum materials."
      portalTitle="TEACHER LOGIN"
      portalSubtitle="Welcome, Faculty Member! Sign in to access your teaching hub."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isPendingApproval && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Registration Under Review</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your teacher registration has been received and is awaiting Super Administrator approval. You will be activated shortly.
            </p>
          </div>
        )}

        {/* Email or Mobile */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Registered Faculty Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder="e.g. praveen@fuzion.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Password</label>
            <Link
              href="/auth/forgot-password?role=teacher"
              className="text-[11px] font-bold text-purple-600 hover:text-purple-800"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your faculty password"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
            />
            <span>Remember Me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Faculty Authorization...</span>
            </>
          ) : (
            <>
              <span>LOGIN TO TEACHER DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Sign-up link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Invited by administration?{' '}
            <Link
              href="/auth/teacher/signup"
              className="font-extrabold text-purple-700 hover:text-purple-900"
            >
              Teacher Registration
            </Link>
          </p>
        </div>
      </form>
    </AuthCardLayout>
  );
}
