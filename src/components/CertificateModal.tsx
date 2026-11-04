'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, Printer, Award, CheckCircle } from 'lucide-react';

export default function CertificateModal() {
  const { certificateModalOpen, setCertificateModalOpen, studentName, studentCefr } = useAppStore();

  if (!certificateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Controls Bar */}
        <div className="p-4 bg-gray-100 border-b flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-gray-800 text-sm">
              Official Fuzion Academy Verified Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setCertificateModalOpen(false)}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 flex items-center justify-center">
          <div className="w-full border-8 border-double border-indigo-900/30 p-8 sm:p-10 bg-white relative shadow-lg rounded-lg text-center">
            {/* Top Emblem */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-700 to-pink-600 flex items-center justify-center text-white shadow-md text-2xl font-black">
                FA
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1a2b6b] tracking-wide uppercase font-serif">
              Fuzion Academy
            </h1>
            <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold mt-1">
              Institute of Spoken English &amp; Soft Skills Training
            </p>
            <p className="text-[11px] text-gray-500">Sector-11, Pratap Vihar, Ghaziabad</p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto my-6" />

            <p className="text-xs sm:text-sm italic text-gray-600 font-serif">
              This is to officially certify that
            </p>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 my-3 font-serif underline decoration-pink-500/50 decoration-wavy">
              {studentName}
            </h2>

            <p className="text-xs sm:text-sm text-gray-700 max-w-xl mx-auto leading-relaxed">
              has successfully completed the comprehensive training program in{' '}
              <span className="font-bold text-indigo-900">
                Spoken English, Fluency &amp; Professional Soft Skills
              </span>{' '}
              achieving proficiency standard{' '}
              <span className="font-bold text-indigo-700">({studentCefr})</span> with{' '}
              <span className="font-semibold text-emerald-600">Grade: Distinction</span>.
            </p>

            <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-end justify-between text-left text-xs text-gray-600 gap-4">
              <div>
                <p className="font-bold text-gray-900">Certificate ID: FA-CERT-2026-889</p>
                <p className="text-[11px] text-gray-500">Issued: November 2026</p>
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] mt-1 font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  <span>Authenticated &amp; Verified</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-script text-indigo-900 font-serif italic mb-1">
                  Praveen Singh Rawat
                </div>
                <div className="w-36 h-0.5 bg-gray-400 ml-auto mb-1" />
                <p className="font-bold text-gray-800">Founder &amp; Master Trainer</p>
                <p className="text-[10px] text-gray-500">Fuzion Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
