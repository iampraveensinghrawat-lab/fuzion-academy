'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthCardLayout from '@/components/auth/AuthCardLayout';
import { useAuthStore } from '@/lib/authStore';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  BookOpen,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function StudentSignUpPage() {
  const router = useRouter();
  const { registerStudent } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ageOrDob, setAgeOrDob] = useState('22');
  const [cefrLevel, setCefrLevel] = useState('Intermediate');
  const [course, setCourse] = useState('Spoken English');
  const [batchCode, setBatchCode] = useState('B1-Evening');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const proficiencyLevels = [
    'Beginner',
    'Elementary',
    'Pre-Intermediate',
    'Intermediate',
    'Upper-Intermediate',
    'Advanced',
  ];

  const courses = [
    'Spoken English',
    'Grammar',
    'Communication Skills',
    'Public Speaking',
    'Interview Preparation',
    'IELTS Preparation',
    'Personality Development',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters with mixed characters.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Academy Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerStudent({
        name: fullName,
        email,
        mobile,
        password,
        ageOrDob,
        cefrLevel,
        course,
        batchCode,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          router.push('/student/dashboard');
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    }, 700);
  };

  return (
    <AuthCardLayout
      role="student"
      badgeText="Student Enrollment"
      heroHeadline="Join Fuzion Academy. Learn English Naturally."
      heroDescription="Join 5,000+ confident speakers across Ghaziabad and NCR. Benefit from individual AI speech diagnostics, structured CEFR modules, and interactive practice."
      portalTitle="STUDENT REGISTRATION"
      portalSubtitle="Create your student profile and start speaking fluently."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aman Verma"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* Email & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aman@example.com"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-9 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* English Proficiency & Course Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              English Proficiency Level
            </label>
            <select
              value={cefrLevel}
              onChange={(e) => setCefrLevel(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {proficiencyLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Course Selection</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full p-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age & Batch Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Age / Date of Birth</label>
            <input
              type="text"
              required
              value={ageOrDob}
              onChange={(e) => setAgeOrDob(e.target.value)}
              placeholder="e.g. 21 or 15/06/2004"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Batch Code (Optional)</label>
            <input
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              placeholder="e.g. B1-Evening"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-600 cursor-pointer">
            I agree to the Fuzion Academy Terms of Service and Privacy Policy.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#1a2b6b] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Student Account...</span>
            </>
          ) : (
            <>
              <span>COMPLETE REGISTRATION &amp; ENTER LMS</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Already have account */}
        <div className="text-center pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Already registered?{' '}
            <Link
              href="/auth/student/login"
              className="font-extrabold text-indigo-600 hover:text-indigo-800"
            >
              Sign in to Student Portal
            </Link>
          </p>
        </div>
      </form>
    </AuthCardLayout>
  );
}
