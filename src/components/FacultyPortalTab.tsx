'use client';

import React, { useState } from 'react';
import { useAppStore, StudentRecord } from '@/lib/store';
import {
  Users,
  CalendarCheck,
  FileQuestion,
  BookOpen,
  DollarSign,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle,
  XCircle,
  Save,
  Gamepad2,
} from 'lucide-react';

export default function FacultyPortalTab() {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    homeworks,
    addHomework,
    customMaterials,
    addMaterial,
    deleteMaterial,
    setActiveTab,
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'students' | 'attendance' | 'quizzes' | 'homework' | 'uploader' | 'pdf-uploader' | 'reports'
  >('students');

  const [batchFilter, setBatchFilter] = useState('All Batches');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Student Modal / Form state
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('B1-Evening');
  const [newStudentRemarks, setNewStudentRemarks] = useState('');

  // Editing state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editMarks, setEditMarks] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  // Quiz creator state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizUrl, setQuizUrl] = useState('');
  const [quizList, setQuizList] = useState([
    {
      id: 'q-1',
      title: 'Tenses & Irregular Verbs Mastery Quiz',
      url: 'https://gemini.google.com',
      batch: 'All Batches',
      questions: 15,
    },
    {
      id: 'q-2',
      title: 'Business Idioms & Phrasal Verbs Challenge',
      url: 'https://gemini.google.com',
      batch: 'B1-Evening',
      questions: 20,
    },
  ]);

  // Uploader state
  const [uploadedGameTitle, setUploadedGameTitle] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // PDF Uploader state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfLevel, setPdfLevel] = useState('A1-A2');
  const [pdfCategory, setPdfCategory] = useState('Speaking & Discussion');
  const [pdfDescription, setPdfDescription] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUploadSuccess, setPdfUploadSuccess] = useState(false);
  const [pdfErrorMessage, setPdfErrorMessage] = useState('');

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      setPdfErrorMessage('Please select a PDF file to upload.');
      return;
    }
    setPdfUploading(true);
    setPdfErrorMessage('');
    setPdfUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('title', pdfTitle || pdfFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('level', pdfLevel);
      formData.append('category', pdfCategory);
      formData.append('description', pdfDescription);

      const res = await fetch('/api/materials-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      addMaterial(data.material);
      setPdfUploadSuccess(true);
      setPdfFile(null);
      setPdfTitle('');
      setPdfDescription('');
    } catch (err: any) {
      setPdfErrorMessage(err.message || 'An error occurred during upload.');
    } finally {
      setPdfUploading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchesBatch = batchFilter === 'All Batches' || std.batch === batchFilter;
    const matchesSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    addStudent({
      name: newStudentName.trim(),
      batch: newStudentBatch,
      attendance: 90,
      testMarks: '85/100',
      xp: 250,
      remarks: newStudentRemarks.trim() || 'Enrolled in Spoken English Program.',
      cefrLevel: 'B1 Intermediate',
    });

    setNewStudentName('');
    setNewStudentRemarks('');
    setIsAddingStudent(false);
  };

  const handleStartEdit = (std: StudentRecord) => {
    setEditingStudentId(std.id);
    setEditMarks(std.testMarks);
    setEditRemarks(std.remarks);
  };

  const handleSaveEdit = (id: string) => {
    updateStudent(id, {
      testMarks: editMarks,
      remarks: editRemarks,
    });
    setEditingStudentId(null);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Batch', 'Attendance', 'Test Marks', 'XP', 'Remarks'];
    const rows = students.map((s) => [
      s.id,
      `"${s.name}"`,
      s.batch,
      `${s.attendance}%`,
      s.testMarks,
      s.xp,
      `"${s.remarks}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Fuzion_Academy_Student_Records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header Banner (Exact layout from Screenshot 2026-11-04 004922.png) */}
      <div className="rounded-3xl gradient-hero text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-pink-300">
              Faculty Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Fuzion Academy Management Hub
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              Manage student records, mark attendance, create online quizzes, assign homework, collect fees, upload HTML games, and generate reports.
            </p>
          </div>

          {/* Quick Stat Counters Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex items-center justify-around gap-6 text-center min-w-[280px]">
            <div>
              <div className="text-3xl font-black text-white">{students.length}</div>
              <div className="text-[11px] font-bold text-indigo-200 uppercase mt-0.5">Students</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-3xl font-black text-yellow-300">4</div>
              <div className="text-[11px] font-bold text-indigo-200 uppercase mt-0.5">Batches</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-3xl font-black text-pink-300">100+</div>
              <div className="text-[11px] font-bold text-indigo-200 uppercase mt-0.5">Games</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Bar (Exact match to screenshot) */}
      <div className="bg-white rounded-2xl p-2 border border-indigo-100 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'students'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Attendance</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'quizzes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>Tests &amp; Quizzes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('homework')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Homework</span>
        </button>

        <button
          onClick={() => setActiveSubTab('uploader')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'uploader'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>HTML Game Uploader</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pdf-uploader')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'pdf-uploader'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-500" />
          <span>PDF Study Uploader</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeSubTab === 'reports'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Reports &amp; Export</span>
        </button>
      </div>

      {/* 3. Sub-Tab Content: Students Records Management */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          {/* Controls Bar: Batch dropdown, Search, Add Student */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-gray-900">Student Records Management</h2>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700 shadow-sm"
              >
                <option value="All Batches">All Batches</option>
                <option value="B1-Evening">B1-Evening</option>
                <option value="A2-Morning">A2-Morning</option>
                <option value="B2-Advanced">B2-Advanced</option>
                <option value="IELTS-Batch">IELTS-Batch</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Green button matching screenshot */}
              <button
                onClick={() => setIsAddingStudent(!isAddingStudent)}
                className="px-4 py-2 rounded-xl bg-[#00895e] hover:bg-[#00704d] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Add Student Form */}
          {isAddingStudent && (
            <form
              onSubmit={handleCreateStudent}
              className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 animate-scale-in"
            >
              <h3 className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
                Enroll New Student
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="p-2.5 rounded-xl border border-indigo-200 text-xs bg-white"
                />
                <select
                  value={newStudentBatch}
                  onChange={(e) => setNewStudentBatch(e.target.value)}
                  className="p-2.5 rounded-xl border border-indigo-200 text-xs bg-white"
                >
                  <option value="B1-Evening">B1-Evening</option>
                  <option value="A2-Morning">A2-Morning</option>
                  <option value="B2-Advanced">B2-Advanced</option>
                  <option value="IELTS-Batch">IELTS-Batch</option>
                </select>
                <input
                  type="text"
                  placeholder="Initial Teacher Remarks"
                  value={newStudentRemarks}
                  onChange={(e) => setNewStudentRemarks(e.target.value)}
                  className="p-2.5 rounded-xl border border-indigo-200 text-xs bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00895e] text-white font-bold text-xs rounded-lg shadow-sm"
                >
                  Save &amp; Enroll
                </button>
              </div>
            </form>
          )}

          {/* Student Records Table (Exact layout from Screenshot 2026-11-04 004922.png) */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9ff] text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Test Marks</th>
                  <th className="py-3 px-4">XP</th>
                  <th className="py-3 px-4 min-w-[260px]">Teacher Remarks</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredStudents.map((std) => {
                  const isEditing = editingStudentId === std.id;
                  return (
                    <tr key={std.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {std.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="font-bold text-gray-900">{std.name}</span>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                          {std.batch}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#00895e] font-black">{std.attendance}%</span>
                      </td>

                      {/* Test Marks */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editMarks}
                            onChange={(e) => setEditMarks(e.target.value)}
                            className="w-20 p-1 border rounded text-xs"
                          />
                        ) : (
                          <span className="font-bold text-gray-800">{std.testMarks}</span>
                        )}
                      </td>

                      {/* XP */}
                      <td className="py-3.5 px-4">
                        <span className="text-indigo-600 font-black">{std.xp} XP</span>
                      </td>

                      {/* Remarks */}
                      <td className="py-3.5 px-4 text-gray-600 text-[11px] leading-relaxed italic">
                        {isEditing ? (
                          <textarea
                            value={editRemarks}
                            onChange={(e) => setEditRemarks(e.target.value)}
                            rows={2}
                            className="w-full p-1 border rounded text-xs"
                          />
                        ) : (
                          std.remarks
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(std.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(std)}
                              className="px-2.5 py-1 rounded bg-[#4338ca] text-white font-bold text-[11px] hover:bg-[#3730a3]"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            onClick={() => deleteStudent(std.id)}
                            className="px-2.5 py-1 rounded bg-[#e11d48] text-white font-bold text-[11px] hover:bg-[#be123c]"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Sub-Tab: Attendance Marker */}
      {activeSubTab === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Mark Daily Attendance</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="space-y-2">
            {students.map((std) => (
              <div
                key={std.id}
                className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {std.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{std.name}</h4>
                    <span className="text-[10px] text-gray-500">{std.batch}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200">
                    Present
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-bold hover:bg-red-200">
                    Absent
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200">
                    Late
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Sub-Tab: Tests & Quizzes (With Google Gemini Quiz Link Embedder) */}
      {activeSubTab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Publish Gemini Quiz Links</h2>
            <p className="text-xs text-gray-500 mt-1">
              Paste online quizzes generated via Google Gemini, Google Forms, or Quizizz to assign directly to student batches.
            </p>
          </div>

          {/* Form */}
          <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
            <h3 className="font-bold text-xs text-indigo-950 uppercase">New Online Quiz Link</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Quiz Title (e.g. Advanced Passive Voice Challenge)"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="p-2.5 rounded-xl border border-indigo-200 text-xs bg-white"
              />
              <input
                type="url"
                placeholder="Paste Gemini / Form Quiz URL"
                value={quizUrl}
                onChange={(e) => setQuizUrl(e.target.value)}
                className="p-2.5 rounded-xl border border-indigo-200 text-xs bg-white"
              />
            </div>
            <button
              onClick={() => {
                if (!quizTitle || !quizUrl) return;
                setQuizList([
                  {
                    id: `q-${Date.now()}`,
                    title: quizTitle,
                    url: quizUrl,
                    batch: 'All Batches',
                    questions: 10,
                  },
                  ...quizList,
                ]);
                setQuizTitle('');
                setQuizUrl('');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Add Quiz to Library
            </button>
          </div>

          {/* Quiz list */}
          <div className="space-y-3">
            {quizList.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">{q.title}</h4>
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    {q.url}
                  </a>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {q.batch}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Sub-Tab: HTML Game Uploader */}
      {activeSubTab === 'uploader' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Upload New HTML ESL Game</h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload standalone single-file HTML5 games. They are automatically sandboxed and added to the 100+ Games Arcade without touching code!
            </p>
          </div>

          <div className="border-2 border-dashed border-indigo-300 rounded-3xl p-8 text-center bg-indigo-50/40 space-y-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                Drag and drop your standalone .html game here
              </p>
              <p className="text-xs text-gray-500 mt-1">or browse files from your computer</p>
            </div>
            <input
              type="file"
              accept=".html"
              className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setUploadedGameTitle(e.target.files[0].name.replace('.html', ''));
                  setUploadSuccess(true);
                }
              }}
            />
          </div>

          {uploadSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>
                Game &ldquo;{uploadedGameTitle}&rdquo; registered and ready for catalog assignment!
              </span>
            </div>
          )}
        </div>
      )}

      {/* 7. Sub-Tab: PDF Study Material Uploader */}
      {activeSubTab === 'pdf-uploader' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                📄
              </span>
              <h2 className="text-lg font-black text-gray-900">Upload PDF Study Material from Computer</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select or drag &amp; drop any PDF worksheet, discussion card, or grammar guide from your device. It will be stored in the academy library and made immediately accessible to students.
            </p>
          </div>

          <form onSubmit={handleUploadPdf} className="space-y-5">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/50 transition-colors space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {pdfFile ? `Selected: ${pdfFile.name} (${Math.round(pdfFile.size / 1024)} KB)` : 'Choose a PDF file from your computer'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Accepts standard .pdf worksheets and e-books</p>
              </div>

              <input
                type="file"
                accept=".pdf"
                required
                className="text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const f = e.target.files[0];
                    setPdfFile(f);
                    if (!pdfTitle) {
                      setPdfTitle(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }
                }}
              />
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. B1 Modal Verbs Dialogue Cards"
                  required
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  CEFR Level
                </label>
                <select
                  value={pdfLevel}
                  onChange={(e) => setPdfLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="A1-A2">A1-A2 Elementary</option>
                  <option value="B1-B2">B1-B2 Intermediate</option>
                  <option value="C1 Advanced">C1 Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Resource Category
                </label>
                <select
                  value={pdfCategory}
                  onChange={(e) => setPdfCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="Speaking & Discussion">Speaking &amp; Discussion</option>
                  <option value="Grammar Practice">Grammar Practice</option>
                  <option value="Debates & Discussions">Debates &amp; Discussions</option>
                  <option value="Pronunciation & Phonetics">Pronunciation &amp; Phonetics</option>
                  <option value="ESL Games & Activities">ESL Games &amp; Activities</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Description / Student Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Brief instructions on how students should use this worksheet (e.g. Complete in pairs during evening speaking session)..."
                value={pdfDescription}
                onChange={(e) => setPdfDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Error & Success Messages */}
            {pdfErrorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {pdfErrorMessage}
              </div>
            )}

            {pdfUploadSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>PDF uploaded successfully and added to the Study Materials library!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  View in Library &rarr;
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pdfUploading || !pdfFile}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 ${
                  pdfUploading || !pdfFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{pdfUploading ? 'Uploading to Server...' : 'Upload & Publish PDF'}</span>
              </button>
            </div>
          </form>

          {/* Recently Uploaded PDF Materials Table */}
          {customMaterials && customMaterials.length > 0 && (
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <h3 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                Your Recently Uploaded PDFs ({customMaterials.length})
              </h3>

              <div className="space-y-2">
                {customMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📄</span>
                      <div>
                        <h4 className="font-bold text-gray-900">{mat.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            {mat.level}
                          </span>
                          <span>&bull;</span>
                          <span>{mat.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={mat.filePath.startsWith('/api/pdf') ? mat.filePath : `/api/pdf?file=${encodeURIComponent(mat.fileName)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-[11px]"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => deleteMaterial(mat.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete Material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. Sub-Tab: Reports & Export */}
      {activeSubTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-gray-900">Reports &amp; Data Export</h2>
            <p className="text-xs text-gray-500 mt-1">
              Download comprehensive attendance, marks, and XP logs for institutional records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Export Student Roster (CSV)</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Full list with current attendance, test scores, XP, and faculty feedback.
                </p>
              </div>
              <button
                onClick={exportCSV}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV File</span>
              </button>
            </div>

            <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-100 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Print Attendance Sheet</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Ready-to-print monthly attendance ledger for classroom signature.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Print Attendance Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
