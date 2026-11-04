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
  GraduationCap,
  Briefcase,
  Key,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function TeacherSignUpPage() {
  const router = useRouter();
  const { registerTeacher } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState('3+ Years');
  const [specialisation, setSpecialisation] = useState('Spoken English');
  const [invitationCode, setInvitationCode] = useState('FA-TEACH-2026');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingSuccess, setIsPendingSuccess] = useState(false);

  const specialisations = [
    'Spoken English',
    'Grammar',
    'Communication Skills',
    'Public Speaking',
    'Interview Preparation',
    'IELTS',
    'Personality Development',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerTeacher({
        name: fullName,
        email,
        mobile,
        password,
        qualification,
        experienceYears,
        specialisation,
        invitationCode,
      });

      setIsLoading(false);

      if (res.success) {
        setIsPendingSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    }, 700);
  };

  return (
    <AuthCardLayout
      role="teacher"
      badgeText="Faculty Registration"
      heroHeadline="Join Our Renowned Faculty Team."
      heroDescription="Fuzion Academy values passionate trainers who combine academic rigor with conversational confidence building. Registration requires an authorized invitation code."
      portalTitle="TEACHER REGISTRATION"
      portalSubtitle="Register your faculty profile for institutional review."
    >
      {isPendingSuccess ? (
        <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl space-y-4 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-lg font-black text-amber-950">
            Registration Submitted &bull; Pending Approval
          </h3>

          <p className="text-xs text-amber-800 leading-relaxed max-w-sm mx-auto">
            Thank you, <span className="font-bold">{fullName}</span>! Your faculty registration with invitation code <span className="font-mono font-bold">{invitationCode}</span> has been logged and sent to Super Administration for verification.
          </p>

          <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-left text-[11px] text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">Next Steps:</p>
            <p>&bull; The administrator reviews qualifications and assigns batches.</p>
            <p>&bull; Once approved, you can log in immediately with your email and password.</p>
          </div>

          <Link
            href="/auth/teacher/login"
            className="inline-block px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            Go to Teacher Login Screen &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
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
                placeholder="e.g. Vikram Malhotra"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Faculty Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@fuzion.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                  placeholder="9812345678"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Qualification & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Highest Qualification</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. M.A. English / CELTA"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teaching Experience</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 4+ Years"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Specialisation & Invitation Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teaching Specialisation</label>
              <select
                value={specialisation}
                onChange={(e) => setSpecialisation(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {specialisations.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teacher Invitation Code</label>
              <div className="relative">
                <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  placeholder="e.g. FA-TEACH-2026"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-purple-300 text-xs font-mono font-bold text-purple-900 bg-purple-50/60 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm */}
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
                  className="w-full pl-10 pr-9 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white"
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
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Registration for Admin Review...</span>
              </>
            ) : (
              <>
                <span>SUBMIT FACULTY APPLICATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Already approved?{' '}
              <Link
                href="/auth/teacher/login"
                className="font-extrabold text-purple-700 hover:text-purple-900"
              >
                Sign in to Teacher Dashboard
              </Link>
            </p>
          </div>
        </form>
      )}
    </AuthCardLayout>
  );
}
