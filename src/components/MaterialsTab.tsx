'use client';

import React, { useState } from 'react';
import { STUDY_MATERIALS, StudyMaterial } from '@/lib/materialsData';
import { useAppStore } from '@/lib/store';
import { FileText, Download, Eye, Search, Filter, X, Sparkles, Upload, Plus, CheckCircle, ExternalLink } from 'lucide-react';

export default function MaterialsTab() {
  const { customMaterials, currentRole, setActiveTab, addMaterial } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMaterial, setViewingMaterial] = useState<StudyMaterial | null>(null);

  // Quick Inline Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLevel, setModalLevel] = useState('A1-A2');
  const [modalCategory, setModalCategory] = useState('Speaking & Discussion');
  const [modalDescription, setModalDescription] = useState('');
  const [modalUploading, setModalUploading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  const categories = [
    'All',
    'Speaking & Discussion',
    'Grammar Practice',
    'Debates & Discussions',
    'Pronunciation & Phonetics',
    'ESL Games & Activities',
  ];

  const levels = ['All', 'A1-A2', 'B1-B2', 'C1 Advanced'];

  // Combine custom uploaded materials with initial static materials
  const combinedMaterials: (StudyMaterial & { isCustom?: boolean })[] = [
    ...customMaterials.map((m) => ({ ...m, isCustom: true })),
    ...STUDY_MATERIALS,
  ];

  const filteredMaterials = combinedMaterials.filter((mat) => {
    const matchesCat = selectedCategory === 'All' || mat.category === selectedCategory;
    const matchesLvl = selectedLevel === 'All' || mat.level === selectedLevel;
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLvl && matchesSearch;
  });

  const handleModalUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFile) {
      setModalError('Please choose a PDF file.');
      return;
    }
    setModalUploading(true);
    setModalError('');

    try {
      const formData = new FormData();
      formData.append('file', modalFile);
      formData.append('title', modalTitle || modalFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('level', modalLevel);
      formData.append('category', modalCategory);
      formData.append('description', modalDescription);

      const res = await fetch('/api/materials-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload PDF');

      addMaterial(data.material);
      setModalSuccess(true);
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setModalSuccess(false);
        setModalFile(null);
        setModalTitle('');
        setModalDescription('');
      }, 1500);
    } catch (err: any) {
      setModalError(err.message || 'Upload error');
    } finally {
      setModalUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#1a2b6b] tracking-tight">
                Fuzion Academy Study Materials &amp; E-Books
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                120+ PDF Resources
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Curated worksheets, debate prompts, speaking cards, and phonetics drills for offline revision.
            </p>
          </div>

          {/* Search bar & Upload Action */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PDF worksheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-indigo-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-xs font-bold text-gray-500 ml-4 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grid of PDF Material Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {mat.category}
                  </span>
                  {mat.isCustom && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Uploaded
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {mat.level}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1a2b6b] line-clamp-1">{mat.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingMaterial(mat)}
                className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview PDF</span>
              </button>

              <a
                href={mat.filePath.startsWith('/api/pdf') ? `${mat.filePath}&download=1` : `/api/pdf?file=${encodeURIComponent(mat.fileName)}&download=1`}
                download={mat.fileName}
                className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 3. In-Browser PDF Preview Modal */}
      {viewingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-[#1a2b6b] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" />
                <span className="font-bold text-sm line-clamp-1">{viewingMaterial.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingMaterial.filePath.startsWith('/api/pdf') ? viewingMaterial.filePath : `/api/pdf?file=${encodeURIComponent(viewingMaterial.fileName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-indigo-100 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Open in Full Browser Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={viewingMaterial.filePath.startsWith('/api/pdf') ? `${viewingMaterial.filePath}&download=1` : `/api/pdf?file=${encodeURIComponent(viewingMaterial.fileName)}&download=1`}
                  download={viewingMaterial.fileName}
                  className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setViewingMaterial(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-300 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-800 relative flex flex-col">
              <iframe
                src={viewingMaterial.filePath.startsWith('/api/pdf') ? viewingMaterial.filePath : `/api/pdf?file=${encodeURIComponent(viewingMaterial.fileName)}`}
                title={viewingMaterial.title}
                className="w-full h-full border-0 flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Upload PDF Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  📄
                </span>
                <h3 className="font-extrabold text-base text-gray-900">
                  Upload PDF Material from Computer
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalUpload} className="space-y-4">
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40">
                <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-800">
                  {modalFile ? modalFile.name : 'Choose a .pdf worksheet from your computer'}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  className="mt-3 text-xs text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const f = e.target.files[0];
                      setModalFile(f);
                      if (!modalTitle) setModalTitle(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. A1 Past Tense Dialogue Cards"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    CEFR Level
                  </label>
                  <select
                    value={modalLevel}
                    onChange={(e) => setModalLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                  >
                    <option value="A1-A2">A1-A2 Elementary</option>
                    <option value="B1-B2">B1-B2 Intermediate</option>
                    <option value="C1 Advanced">C1 Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
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
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Classroom activity practicing past tense..."
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white font-medium"
                />
              </div>

              {modalError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                  {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>PDF uploaded and published to library!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalUploading || !modalFile}
                  className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 ${
                    modalUploading || !modalFile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{modalUploading ? 'Uploading...' : 'Publish PDF'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
