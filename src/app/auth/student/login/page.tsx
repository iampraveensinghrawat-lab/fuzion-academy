'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore } from '@/lib/authStore';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [emailOrMobile, setEmailOrMobile] = useState('student@fuzion.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = login(emailOrMobile, password, 'student');
      setIsLoading(false);

      if (res.success) {
        router.push('/student/dashboard');
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <AuthCardLayout
      role="student"
      badgeText="Student Portal"
      heroHeadline="Speak Confidently. Unlock Global Opportunities."
      heroDescription="Access your daily speaking streaks, 100+ interactive arcade games, AI Speaking Lab, and teacher feedback in one unified platform."
      portalTitle="STUDENT LOGIN"
      portalSubtitle="Welcome back, student! Continue your English learning journey."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email or Mobile */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Email Address / Registered Mobile
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder="e.g. rahul@example.com or 9876543210"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Password</label>
            <Link
              href="/auth/forgot-password?role=student"
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
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
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <span>Remember Me</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#1a2b6b] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>LOGIN TO STUDENT DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Sign-up link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/student/signup"
              className="font-extrabold text-indigo-600 hover:text-indigo-800"
            >
              Create Student Account
            </Link>
          </p>
        </div>
      </form>
    </AuthCardLayout>
  );
}
