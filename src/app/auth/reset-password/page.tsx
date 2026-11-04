'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore } from '@/lib/authStore';
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const { resetPassword, resetTokens } = useAuthStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Check token existence
  const activeToken = resetTokens.find((r) => r.token === token);
  const isTokenValid = Boolean(activeToken && Date.now() < activeToken.expiresAt);

  // Password strength indicators
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = resetPassword(token, newPassword);
      setIsLoading(false);

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <AuthCardLayout
      role="student"
      badgeText="Security Verification"
      heroHeadline="Create a Secure New Password."
      heroDescription="Ensure your new password uses a combination of letters, numbers, and symbols to protect your English learning achievements and personal reports."
      portalTitle="CREATE NEW PASSWORD"
      portalSubtitle={email ? `Resetting password for: ${email}` : 'Enter your new account password.'}
    >
      {isSuccess ? (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl space-y-4 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-black text-emerald-950">
            Password Successfully Updated!
          </h3>

          <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
            Your credentials have been securely refreshed. The single-use reset token has been invalidated. You can now log in with your new password.
          </p>

          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <span>BACK TO LOGIN PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : !token ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-sm text-rose-900">Missing Reset Token</h3>
          <p className="text-xs text-rose-700">
            No valid password reset token was provided in the URL. Please request a fresh reset link.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
          >
            Request Reset Link &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Live Password Strength Indicator */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5 text-[11px]">
            <p className="font-bold text-gray-700">Password Requirements:</p>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className={hasMinLength ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                {hasMinLength ? '✓' : '•'} At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className={hasUppercase ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                {hasUppercase ? '✓' : '•'} At least one uppercase letter (A-Z)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className={hasNumber ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                {hasNumber ? '✓' : '•'} At least one number or symbol
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !hasMinLength}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>RESET PASSWORD &amp; SECURE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-3 border-t border-gray-100">
            <Link href="/auth" className="text-xs font-bold text-gray-500 hover:text-indigo-600">
              Cancel &amp; Return to Portals
            </Link>
          </div>
        </form>
      )}
    </AuthCardLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8 text-indigo-600 font-bold">Verifying Reset Token...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
