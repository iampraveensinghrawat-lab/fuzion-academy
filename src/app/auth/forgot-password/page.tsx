'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore, UserRole } from '@/lib/authStore';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle, KeyRound, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'student';

  const { requestPasswordReset } = useAuthStore();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<{ message: string; token?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessData(null);

    setTimeout(() => {
      const res = requestPasswordReset(email);
      setIsLoading(false);

      if (res.success) {
        setSuccessData({ message: res.message, token: res.token });
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <AuthCardLayout
      role={role}
      badgeText="Account Security"
      heroHeadline="Recover Your Account Securely."
      heroDescription="Enter your verified Fuzion Academy email address. We will generate a cryptographically secure, time-limited single-use reset token."
      portalTitle="FORGOT PASSWORD"
      portalSubtitle="Enter your registered email address to receive a password reset link."
    >
      {successData ? (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl space-y-4 animate-scale-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
              Reset Link Dispatched
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {successData.message}
            </p>
          </div>

          {/* Instant Test Link */}
          {successData.token && (
            <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Direct Password Reset Link (Click to Test):
              </span>
              <Link
                href={`/auth/reset-password?token=${successData.token}&email=${encodeURIComponent(email)}`}
                className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 break-all text-[11px]"
              >
                <span>/auth/reset-password?token={successData.token.substring(0, 18)}...</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href={`/auth/${role}/login`}
              className="text-xs font-bold text-indigo-700 hover:underline"
            >
              &larr; Back to {role.toUpperCase()} Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select User Portal</label>
            <div className="grid grid-cols-4 gap-2">
              {(['student', 'teacher', 'admin', 'parent'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
                    role === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Cryptographic Token...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>SEND PASSWORD RESET LINK</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <Link
              href={`/auth/${role}/login`}
              className="text-xs font-bold text-gray-600 hover:text-indigo-600"
            >
              &larr; Remember your password? Return to login
            </Link>
          </div>
        </form>
      )}
    </AuthCardLayout>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8 text-indigo-600 font-bold">Loading Password Reset...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
