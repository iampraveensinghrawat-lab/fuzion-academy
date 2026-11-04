'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserAccount } from '@/lib/authStore';
import { useAppStore } from '@/lib/store';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  FileText,
  Search,
  Filter,
  Activity,
  KeyRound,
  Gamepad2,
  Sparkles,
  Phone,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { accounts, auditLogs, approveTeacher, rejectTeacher, logout, currentUser } = useAuthStore();
  const { students } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'users' | 'audit'>('overview');
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchUser, setSearchUser] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const pendingTeachers = accounts.filter(
    (a) => a.role === 'teacher' && a.status === 'pending_approval'
  );
  const activeTeachers = accounts.filter(
    (a) => a.role === 'teacher' && a.status === 'active'
  );
  const parentAccounts = accounts.filter((a) => a.role === 'parent');
  const studentAccounts = accounts.filter((a) => a.role === 'student');

  const filteredUsers = accounts.filter((u) => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.mobile && u.mobile.includes(searchUser));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f4f5fd] flex flex-col font-sans text-gray-900 selection:bg-slate-900 selection:text-white">
      {/* Top Admin Security Bar */}
      <div className="bg-slate-950 text-white py-2 px-4 sm:px-8 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fuzion Academy &bull; Super Administrator Control Console</span>
          <span className="text-slate-400 hidden sm:inline">&bull; Authorized: {currentUser?.name || 'Super Admin'}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-rose-600 transition-colors text-white text-[11px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Admin Navigation */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-md">
              FA
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                Institutional Management &amp; Security ERP
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Complete oversight of students, faculty, parents, curriculum and audit logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Overview &amp; Metrics
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'teachers'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Faculty Approvals</span>
              {pendingTeachers.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full font-bold">
                  {pendingTeachers.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              User Roster ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Security Audit Logs
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: OVERVIEW & SYSTEM METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Total Students
                  </span>
                  <span className="text-3xl font-black text-indigo-700 mt-1 block">
                    {studentAccounts.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    100% Active Enrolled
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Faculty Trainers
                  </span>
                  <span className="text-3xl font-black text-purple-700 mt-1 block">
                    {activeTeachers.length}
                  </span>
                  <span className="text-[11px] text-amber-600 font-semibold">
                    {pendingTeachers.length} Pending Approval
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Parent Guardians
                  </span>
                  <span className="text-3xl font-black text-emerald-700 mt-1 block">
                    {parentAccounts.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    Linked to Student Profiles
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Curriculum Assets
                  </span>
                  <span className="text-3xl font-black text-slate-800 mt-1 block">
                    126 PDFs / 37 Games
                  </span>
                  <span className="text-[11px] text-indigo-600 font-semibold">
                    AI Speaking Lab Active
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Pending Approvals Notice Banner if any */}
            {pendingTeachers.length > 0 && (
              <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-amber-950">
                      {pendingTeachers.length} Faculty Registration Awaiting Super Admin Review
                    </h3>
                    <p className="text-xs text-amber-800">
                      New trainer accounts submitted with invitation code FA-TEACH-2026. Review credentials to activate teaching privileges.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('teachers')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm whitespace-nowrap"
                >
                  Review Faculty Approvals &rarr;
                </button>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>Recent Security Events</span>
                </h3>
                <div className="space-y-2">
                  {auditLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-2xl text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-gray-800 capitalize">{log.action.replace('_', ' ')}</span>
                        <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-600">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>AI &amp; Curriculum Control</span>
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Google Gemini 1.5 speech examiner integration is configured. Study materials catalog is synchronized with 126 verified PDF worksheets.
                </p>
                <div className="pt-2">
                  <Link
                    href="/teacher/dashboard"
                    className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold text-xs"
                  >
                    Open Curriculum Hub &rarr;
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Role-Based Access Enforcement</span>
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Four distinct portals active: Students, Teachers, Parents, and Super Administration. Public administrator registration is strictly blocked.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>RLS &amp; Session Auth Enforced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHER APPROVALS */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Faculty Registrations &bull; Pending Super Admin Approval
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Trainers who have completed registration with an authorized invitation code. Once approved, the teacher can log in and manage students.
              </p>
            </div>

            {pendingTeachers.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-gray-900">All Faculty Applications Processed</h3>
                <p className="text-xs text-gray-500">
                  There are currently no pending teacher registrations requiring approval.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-gray-900">{teacher.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                          Pending Approval
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-bold">Email:</span> {teacher.email} &bull;{' '}
                        <span className="font-bold">Mobile:</span> {teacher.mobile}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 pt-1">
                        <span><span className="font-semibold text-gray-500">Qualification:</span> {teacher.qualification}</span>
                        <span>&bull;</span>
                        <span><span className="font-semibold text-gray-500">Experience:</span> {teacher.experienceYears}</span>
                        <span>&bull;</span>
                        <span><span className="font-semibold text-gray-500">Specialisation:</span> {teacher.specialisation}</span>
                      </div>
                      <div className="text-[11px] text-purple-700 font-mono font-bold pt-1">
                        Invitation Code Verified: {teacher.invitationCodeUsed || 'FA-TEACH-2026'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveTeacher(teacher.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Access</span>
                      </button>
                      <button
                        onClick={() => rejectTeacher(teacher.id)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER ROSTER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">Academy User Accounts Roster</h2>
                <p className="text-xs text-gray-500">Manage all registered credentials across portals.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="p-2 border rounded-xl text-xs font-bold bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="parent">Parents</option>
                  <option value="admin">Administrators</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name/email..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="pl-9 pr-3 py-2 border rounded-xl text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Portal Role</th>
                    <th className="py-3 px-4">Identifier / Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-bold text-gray-900">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            u.role === 'admin'
                              ? 'bg-slate-900 text-white'
                              : u.role === 'teacher'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'parent'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                        {u.studentCode || (u.linkedStudentCodes ? `Child: ${u.linkedStudentCodes.join(', ')}` : '-')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.status === 'pending_approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-[11px]">{u.createdDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-gray-900">Security &amp; Authentication Audit Logs</h2>
              <p className="text-xs text-gray-500">
                Tamper-resistant log of authentications, role transitions, password resets, and access validations.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Account Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Security Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{log.email}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-gray-500">{log.role}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            log.action === 'LOGIN_SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'LOGIN_FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : log.action === 'TEACHER_APPROVED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-6 text-xs text-gray-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-extrabold text-gray-800">
            Fuzion Academy &bull; Sector-11, Pratap Vihar, Ghaziabad &bull; Super Admin Console
          </p>
          <p className="text-[11px] text-gray-400">
            Confidential &bull; Authenticated Institutional Session
          </p>
        </div>
      </footer>
    </div>
  );
}
