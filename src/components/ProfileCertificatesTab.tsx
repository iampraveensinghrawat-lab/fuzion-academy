'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Award,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Receipt,
  User,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

export default function ProfileCertificatesTab() {
  const {
    studentName,
    studentBatch,
    studentCefr,
    studentAttendance,
    setCertificateModalOpen,
  } = useAppStore();

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [phone, setPhone] = useState('+91 95827 74387');
  const [email, setEmail] = useState('rahul.sharma@fuzionacademy.com');

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Exact Two Column Layout matching Screenshot 2026-11-04 005022.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Profile Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm text-center">
          {/* Avatar Icon */}
          <div className="w-24 h-24 rounded-3xl bg-[#6356e8] text-white text-3xl font-black flex items-center justify-center mx-auto shadow-lg mb-4">
            RS
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {studentName}
          </h2>
          <p className="text-xs font-semibold text-indigo-600 mt-1">
            Batch: {studentBatch} (Sector-11, Ghaziabad)
          </p>

          <div className="w-full h-px bg-gray-100 my-6" />

          {/* Details Table */}
          <div className="space-y-3.5 text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Admission Date:</span>
              <span className="font-bold text-gray-800">15 Jan 2026</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">CEFR Level:</span>
              <span className="font-bold text-emerald-600">{studentCefr}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Attendance Rate:</span>
              <span className="font-bold text-gray-900">{studentAttendance}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Fee Status:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Fully Paid
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Contact Phone:</span>
              <span className="font-semibold text-gray-700">{phone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">Email Address:</span>
              <span className="font-semibold text-gray-700">{email}</span>
            </div>
          </div>

          {/* Edit Contact Info button */}
          <div className="mt-8">
            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingContact ? 'Save Contact Info' : 'Edit Contact Info'}</span>
            </button>
          </div>

          {isEditingContact && (
            <div className="mt-4 p-4 bg-indigo-50/70 rounded-2xl text-left space-y-3 animate-fade-in text-xs">
              <div>
                <label className="font-bold text-indigo-950 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-indigo-950 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Earned Certificates & Fee History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Earned Certificates Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">🌟</span>
                <h2 className="text-base sm:text-lg font-black text-gray-900">
                  Earned Certificates
                </h2>
              </div>

              {/* Orange button matching screenshot */}
              <button
                onClick={() => setCertificateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Official Certificate</span>
              </button>
            </div>

            {/* Certificate Entry */}
            <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Spoken English &amp; Fluency Course Completion
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Issued by Fuzion Academy, Ghaziabad &bull; ID: FA-CERT-2026-889
                </p>
              </div>

              <button
                onClick={() => setCertificateModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* 2. Fee Payment History Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-gray-900">
                Fee Payment History
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                    Installment 1 - Advance
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Paid on 15 Jan 2026 &bull; UPI</p>
                </div>
                <span className="font-black text-sm text-emerald-600">₹4,500 (Paid)</span>
              </div>

              <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                    Installment 2 - Final
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Due on 15 Mar 2026</p>
                </div>
                <span className="font-black text-sm text-emerald-600">₹3,500 (Paid)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
