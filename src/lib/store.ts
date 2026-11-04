import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudyMaterial } from '@/lib/materialsData';

export type UserRole = 'student' | 'teacher' | 'parent';

export interface StudentRecord {
  id: string;
  name: string;
  batch: string;
  attendance: number;
  testMarks: string;
  xp: number;
  remarks: string;
  avatar?: string;
  email?: string;
  phone?: string;
  cefrLevel?: string;
}

export interface SpeakingAssessmentRecord {
  id: string;
  promptTitle: string;
  category: string;
  transcript: string;
  overallScore: number;
  ieltsBand?: number;
  cefrLevel?: string;
  fluencyScore: number;
  grammarScore: number;
  vocabScore: number;
  pronunciationScore: number;
  wordCount: number;
  wpm: number;
  date: string;
  strengths: string[];
  weaknesses?: string[];
  corrections: { original: string; corrected: string; grammarRule?: string; explanation: string }[];
  vocabularyUpgrades?: { used: string; betterAlternative: string; contextExample?: string }[];
  pronunciationNotes?: { word: string; phonetic?: string; coachingTip: string }[];
  fillerAnalysis?: { count: number; detected: string[]; impact?: string };
  teacherAdvice?: string;
}

export interface AppState {
  currentRole: UserRole;
  activeTab: 'dashboard' | 'games' | 'speaking' | 'leaderboard' | 'profile' | 'materials' | 'faculty';
  
  // Student Profile Info
  studentName: string;
  studentLevel: number;
  studentBatch: string;
  studentCefr: string;
  studentXp: number;
  studentStreak: number;
  studentAttendance: number;
  
  // Active Game Player Modal
  activePlayingGame: { id: string; title: string; filePath: string; xpReward: number } | null;
  certificateModalOpen: boolean;

  // Management Hub data
  students: StudentRecord[];
  speakingHistory: SpeakingAssessmentRecord[];
  
  // Homework & Assignments
  homeworks: { id: string; title: string; batch: string; dueDate: string; completed: boolean }[];
  
  // Custom Uploaded Materials
  customMaterials: StudyMaterial[];
  
  // Actions
  setRole: (role: UserRole) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  addXp: (amount: number) => void;
  openGame: (game: { id: string; title: string; filePath: string; xpReward: number }) => void;
  closeGame: () => void;
  setCertificateModalOpen: (open: boolean) => void;
  
  // Material Upload Actions
  addMaterial: (material: StudyMaterial) => void;
  deleteMaterial: (id: string) => void;
  
  // Student Management Actions
  addStudent: (student: Omit<StudentRecord, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<StudentRecord>) => void;
  deleteStudent: (id: string) => void;
  
  // Speaking Assessments
  saveSpeakingAssessment: (assessment: Omit<SpeakingAssessmentRecord, 'id' | 'date'>) => void;
  
  // Homework Management
  addHomework: (hw: { title: string; batch: string; dueDate: string }) => void;
  toggleHomework: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: 'student',
      activeTab: 'dashboard',

      // Rahul Sharma (From the screenshot)
      studentName: 'Rahul Sharma',
      studentLevel: 4,
      studentBatch: 'B1-Evening',
      studentCefr: 'B1 Intermediate',
      studentXp: 420,
      studentStreak: 7,
      studentAttendance: 92,

      activePlayingGame: null,
      certificateModalOpen: false,
      customMaterials: [],

      // Initial Student Records matching Screenshot 2026-11-04 004922.png
      students: [
        {
          id: 'std-1',
          name: 'Rahul Sharma',
          batch: 'B1-Evening',
          attendance: 92,
          testMarks: '88/100',
          xp: 420,
          remarks: 'Outstanding fluency and vocabulary usage during roleplay drills. Needs slight focus on past continuous tenses.',
          cefrLevel: 'B1 Intermediate',
          email: 'rahul.sharma@example.com',
          phone: '+91 98765 43210',
        },
        {
          id: 'std-2',
          name: 'Priya Singh',
          batch: 'B1-Evening',
          attendance: 96,
          testMarks: '94/100',
          xp: 680,
          remarks: 'Consistently top performer in grammar and sentence construction. Exceptional confidence in public speaking.',
          cefrLevel: 'B2 Upper Intermediate',
          email: 'priya.singh@example.com',
        },
        {
          id: 'std-3',
          name: 'Aman Verma',
          batch: 'A2-Morning',
          attendance: 85,
          testMarks: '76/100',
          xp: 310,
          remarks: 'Needs regular practice on prepositions and past tense verb endings. Pronunciation is progressing nicely.',
          cefrLevel: 'A2 Elementary',
          email: 'aman.verma@example.com',
        },
        {
          id: 'std-4',
          name: 'Neha Gupta',
          batch: 'B2-Advanced',
          attendance: 98,
          testMarks: '95/100',
          xp: 850,
          remarks: 'Exceptional public speaking and debate skills. Ready for advanced corporate presentation scenarios.',
          cefrLevel: 'C1 Advanced',
          email: 'neha.gupta@example.com',
        },
        {
          id: 'std-5',
          name: 'Deepak Kumar',
          batch: 'A2-Morning',
          attendance: 88,
          testMarks: '80/100',
          xp: 290,
          remarks: 'Shows great enthusiasm during interactive games. Recommend daily speaking wheel practice.',
          cefrLevel: 'A2 Elementary',
          email: 'deepak.kumar@example.com',
        },
        {
          id: 'std-6',
          name: 'Simran Kaur',
          batch: 'IELTS-Batch',
          attendance: 94,
          testMarks: '91/100',
          xp: 720,
          remarks: 'Excellent grasp of phrasal verbs and academic idioms. Band score progression is on target for 7.5+.',
          cefrLevel: 'B2 Upper Intermediate',
          email: 'simran.kaur@example.com',
        },
      ],

      speakingHistory: [
        {
          id: 'spk-1',
          promptTitle: 'Introduce yourself and talk about your career goals.',
          category: 'INTERVIEW',
          transcript: "Hello, my name is Rahul Sharma. I have graduated with a degree in computer applications and currently work as a junior analyst. My long-term goal is to lead international product teams. I want to polish my English speaking skills so I can communicate confidently with global stakeholders and deliver persuasive presentations without hesitation.",
          overallScore: 88,
          fluencyScore: 86,
          grammarScore: 90,
          vocabScore: 89,
          pronunciationScore: 87,
          wordCount: 68,
          wpm: 125,
          date: 'Yesterday at 5:30 PM',
          strengths: ['Clear articulate delivery', 'Excellent use of professional vocabulary like "stakeholders" and "persuasive"'],
          corrections: [
            { original: 'graduated with a degree', corrected: 'graduated with a degree in / hold a degree in', explanation: 'Natural phrasing enhancement' }
          ]
        }
      ],

      homeworks: [
        { id: 'hw-1', title: 'Complete Verb Voltage Level 3 (50 Questions)', batch: 'B1-Evening', dueDate: 'Nov 6, 2026', completed: false },
        { id: 'hw-2', title: 'Record 2-Minute Speech: Restaurant Roleplay', batch: 'B1-Evening', dueDate: 'Nov 7, 2026', completed: true },
        { id: 'hw-3', title: 'Read PDF: B1-B2 The Great Debate (Pages 1-4)', batch: 'B1-Evening', dueDate: 'Nov 9, 2026', completed: false },
      ],

      setRole: (role) => set({
        currentRole: role,
        activeTab: role === 'teacher' ? 'faculty' : 'dashboard'
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addXp: (amount) => set((state) => {
        const newXp = state.studentXp + amount;
        const newLevel = Math.floor(newXp / 150) + 1;
        return { studentXp: newXp, studentLevel: newLevel };
      }),

      openGame: (game) => set({ activePlayingGame: game }),
      closeGame: () => set({ activePlayingGame: null }),
      setCertificateModalOpen: (open) => set({ certificateModalOpen: open }),

      addStudent: (studentData) => set((state) => ({
        students: [
          ...state.students,
          {
            ...studentData,
            id: `std-${Date.now()}`,
          }
        ]
      })),

      updateStudent: (id, updates) => set((state) => ({
        students: state.students.map((s) => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteStudent: (id) => set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      })),

      saveSpeakingAssessment: (assessment) => set((state) => ({
        speakingHistory: [
          {
            ...assessment,
            id: `spk-${Date.now()}`,
            date: 'Just now',
          },
          ...state.speakingHistory
        ],
        studentXp: state.studentXp + 60,
      })),

      addHomework: (hw) => set((state) => ({
        homeworks: [
          { ...hw, id: `hw-${Date.now()}`, completed: false },
          ...state.homeworks
        ]
      })),

      toggleHomework: (id) => set((state) => ({
        homeworks: state.homeworks.map((h) => h.id === id ? { ...h, completed: !h.completed } : h)
      })),

      addMaterial: (material) => set((state) => ({
        customMaterials: [material, ...state.customMaterials]
      })),

      deleteMaterial: (id) => set((state) => ({
        customMaterials: state.customMaterials.filter((m) => m.id !== id)
      })),
    }),
    {
      name: 'fuzion-academy-storage',
    }
  )
);
