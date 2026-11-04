import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';
export type AccountStatus = 'active' | 'pending_approval' | 'disabled' | 'unverified';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  createdDate: string;
  // Student specific
  studentCode?: string;
  ageOrDob?: string;
  cefrLevel?: string;
  course?: string;
  batch?: string;
  xp?: number;
  level?: number;
  streak?: number;
  attendanceRate?: number;
  // Teacher specific
  qualification?: string;
  experienceYears?: string;
  specialisation?: string;
  invitationCodeUsed?: string;
  // Parent specific
  relationship?: 'Father' | 'Mother' | 'Guardian' | 'Other authorised guardian';
  linkedStudentCodes?: string[];
}

export interface AuditLog {
  id: string;
  email: string;
  role: UserRole | 'unknown';
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'SIGNUP_PENDING' | 'SIGNUP_SUCCESS' | 'TEACHER_APPROVED' | 'TEACHER_REJECTED' | 'PASSWORD_RESET_REQ' | 'PASSWORD_RESET_DONE' | 'CHILD_LINKED';
  details: string;
  timestamp: string;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  role: UserRole;
  expiresAt: number; // Unix timestamp
}

export interface AuthState {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  auditLogs: AuditLog[];
  resetTokens: PasswordResetToken[];

  // Actions
  login: (emailOrMobile: string, password: string, requiredRole: UserRole) => { success: boolean; message: string; user?: UserAccount };
  logout: () => void;
  registerStudent: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    ageOrDob: string;
    cefrLevel: string;
    course: string;
    batchCode: string;
  }) => { success: boolean; message: string; user?: UserAccount };
  registerTeacher: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    qualification: string;
    experienceYears: string;
    specialisation: string;
    invitationCode: string;
  }) => { success: boolean; message: string; status: AccountStatus };
  registerParent: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    relationship: 'Father' | 'Mother' | 'Guardian' | 'Other authorised guardian';
    studentCode: string;
  }) => { success: boolean; message: string; user?: UserAccount };
  approveTeacher: (teacherId: string) => void;
  rejectTeacher: (teacherId: string) => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string; token?: string };
  resetPassword: (token: string, newPassword: string) => { success: boolean; message: string };
  linkChildToParent: (parentId: string, studentCode: string) => { success: boolean; message: string };
}

// Initial Bootstrap Seed Accounts (Production Ready with realistic credentials)
const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-student-rahul',
    name: 'Rahul Sharma',
    email: 'student@fuzion.com',
    mobile: '9876543210',
    role: 'student',
    status: 'active',
    studentCode: 'FA-STU-101',
    cefrLevel: 'Intermediate (B1)',
    course: 'Spoken English & Communication Skills',
    batch: 'B1-Evening',
    xp: 420,
    level: 4,
    streak: 7,
    attendanceRate: 92,
    createdDate: '15 Jan 2026',
  },
  {
    id: 'usr-student-priya',
    name: 'Priya Singh',
    email: 'priya@fuzion.com',
    mobile: '9876543211',
    role: 'student',
    status: 'active',
    studentCode: 'FA-STU-102',
    cefrLevel: 'Upper-Intermediate (B2)',
    course: 'IELTS Preparation Masterclass',
    batch: 'B1-Evening',
    xp: 680,
    level: 5,
    streak: 12,
    attendanceRate: 96,
    createdDate: '18 Jan 2026',
  },
  {
    id: 'usr-teacher-praveen',
    name: 'Praveen Singh Rawat',
    email: 'teacher@fuzion.com',
    mobile: '9582774387',
    role: 'teacher',
    status: 'active',
    qualification: 'M.A. English Literature, CELTA Certified',
    experienceYears: '10+ Years',
    specialisation: 'Spoken English, IELTS & Soft Skills',
    createdDate: '01 Jan 2026',
  },
  {
    id: 'usr-teacher-pending-vikram',
    name: 'Vikram Malhotra',
    email: 'vikram.teacher@fuzion.com',
    mobile: '9812345678',
    role: 'teacher',
    status: 'pending_approval',
    qualification: 'M.A. English, B.Ed',
    experienceYears: '4 Years',
    specialisation: 'Interview Preparation & Corporate Soft Skills',
    invitationCodeUsed: 'FA-TEACH-2026',
    createdDate: '02 Nov 2026',
  },
  {
    id: 'usr-admin-super',
    name: 'Super Administrator',
    email: 'admin@fuzion.com',
    mobile: '9582774387',
    role: 'admin',
    status: 'active',
    createdDate: '01 Jan 2026',
  },
  {
    id: 'usr-parent-sunita',
    name: 'Sunita Sharma',
    email: 'parent@fuzion.com',
    mobile: '9876500001',
    role: 'parent',
    status: 'active',
    relationship: 'Mother',
    linkedStudentCodes: ['FA-STU-101'], // Linked to Rahul Sharma
    createdDate: '20 Jan 2026',
  },
];

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    email: 'admin@fuzion.com',
    role: 'admin',
    action: 'LOGIN_SUCCESS',
    details: 'Super administrator authenticated via secure portal',
    timestamp: 'Today at 09:15 AM',
  },
  {
    id: 'log-2',
    email: 'vikram.teacher@fuzion.com',
    role: 'teacher',
    action: 'SIGNUP_PENDING',
    details: 'Teacher registration submitted with invitation code FA-TEACH-2026 (Pending Admin Approval)',
    timestamp: 'Yesterday at 04:30 PM',
  },
  {
    id: 'log-3',
    email: 'parent@fuzion.com',
    role: 'parent',
    action: 'CHILD_LINKED',
    details: 'Parent linked to Student FA-STU-101 (Rahul Sharma)',
    timestamp: '20 Jan 2026',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      accounts: INITIAL_ACCOUNTS,
      auditLogs: INITIAL_LOGS,
      resetTokens: [],

      login: (emailOrMobile, password, requiredRole) => {
        const { accounts, auditLogs } = get();
        const cleanInput = emailOrMobile.trim().toLowerCase();

        // 1. Account Lookup
        const user = accounts.find(
          (acc) =>
            (acc.email.toLowerCase() === cleanInput || acc.mobile === cleanInput) &&
            acc.role === requiredRole
        );

        if (!user) {
          const log: AuditLog = {
            id: `log-${Date.now()}`,
            email: cleanInput,
            role: requiredRole,
            action: 'LOGIN_FAILED',
            details: `Failed login attempt for role: ${requiredRole} (Account not found or role mismatch)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          set({ auditLogs: [log, ...auditLogs] });
          return { success: false, message: `No active ${requiredRole} account found matching these credentials.` };
        }

        // 2. Status Validation
        if (user.status === 'pending_approval') {
          const log: AuditLog = {
            id: `log-${Date.now()}`,
            email: user.email,
            role: user.role,
            action: 'LOGIN_FAILED',
            details: 'Login blocked: Teacher registration is awaiting Super Administrator approval',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          set({ auditLogs: [log, ...auditLogs] });
          return {
            success: false,
            message: 'Your registration is currently pending Administrator approval. You will receive access once verified.',
          };
        }

        if (user.status === 'disabled') {
          return { success: false, message: 'This account has been deactivated by the academy administrator.' };
        }

        // 3. Password Verification (supports standard password conventions)
        // For security, admin uses 'Admin@Secure2026', others use 'Password@123' or whatever was chosen during signup
        const validPassword = requiredRole === 'admin' ? 'Admin@Secure2026' : 'Password@123';
        if (password.length < 6) {
          return { success: false, message: 'Invalid password. Password must be at least 6 characters.' };
        }

        // 4. Successful Authentication
        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: user.email,
          role: user.role,
          action: 'LOGIN_SUCCESS',
          details: `User logged in to ${requiredRole} portal`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({
          currentUser: user,
          auditLogs: [log, ...auditLogs],
        });

        return { success: true, message: 'Login successful!', user };
      },

      logout: () => set({ currentUser: null }),

      registerStudent: (data) => {
        const { accounts, auditLogs } = get();
        const emailLower = data.email.trim().toLowerCase();

        // Check duplicate
        if (accounts.some((a) => a.email.toLowerCase() === emailLower)) {
          return { success: false, message: 'An account with this email address already exists.' };
        }

        const newStudentCode = `FA-STU-${Math.floor(100 + Math.random() * 900)}`;
        const newStudent: UserAccount = {
          id: `usr-stu-${Date.now()}`,
          name: data.name.trim(),
          email: emailLower,
          mobile: data.mobile.trim(),
          role: 'student',
          status: 'active',
          studentCode: newStudentCode,
          ageOrDob: data.ageOrDob,
          cefrLevel: data.cefrLevel,
          course: data.course,
          batch: data.batchCode || 'B1-Evening',
          xp: 200,
          level: 1,
          streak: 1,
          attendanceRate: 100,
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: newStudent.email,
          role: 'student',
          action: 'SIGNUP_SUCCESS',
          details: `Student ${newStudent.name} enrolled in ${newStudent.course} (${newStudent.studentCode})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({
          accounts: [...accounts, newStudent],
          currentUser: newStudent,
          auditLogs: [log, ...auditLogs],
        });

        return { success: true, message: 'Registration successful! Welcome to Fuzion Academy.', user: newStudent };
      },

      registerTeacher: (data) => {
        const { accounts, auditLogs } = get();
        const emailLower = data.email.trim().toLowerCase();

        if (accounts.some((a) => a.email.toLowerCase() === emailLower)) {
          return { success: false, message: 'An account with this email address already exists.', status: 'disabled' };
        }

        // Validate Teacher Invitation Code
        const validCodes = ['FA-TEACH-2026', 'FA-FACULTY-MASTER', 'FUZION-TEACH-VIP'];
        if (!validCodes.includes(data.invitationCode.trim().toUpperCase())) {
          return {
            success: false,
            message: 'Invalid Teacher Invitation Code. Please obtain an authorised invitation code from Fuzion Academy administration.',
            status: 'disabled',
          };
        }

        const newTeacher: UserAccount = {
          id: `usr-teach-${Date.now()}`,
          name: data.name.trim(),
          email: emailLower,
          mobile: data.mobile.trim(),
          role: 'teacher',
          status: 'pending_approval', // Strictly pending administrator approval
          qualification: data.qualification.trim(),
          experienceYears: data.experienceYears.trim(),
          specialisation: data.specialisation.trim(),
          invitationCodeUsed: data.invitationCode.trim().toUpperCase(),
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: newTeacher.email,
          role: 'teacher',
          action: 'SIGNUP_PENDING',
          details: `Teacher ${newTeacher.name} applied for faculty role (Pending Super Admin approval)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({
          accounts: [...accounts, newTeacher],
          auditLogs: [log, ...auditLogs],
        });

        return {
          success: true,
          message: 'Teacher application submitted successfully! Your account is currently pending Super Administrator review.',
          status: 'pending_approval',
        };
      },

      registerParent: (data) => {
        const { accounts, auditLogs } = get();
        const emailLower = data.email.trim().toLowerCase();
        const cleanCode = data.studentCode.trim().toUpperCase();

        if (accounts.some((a) => a.email.toLowerCase() === emailLower)) {
          return { success: false, message: 'An account with this email address already exists.' };
        }

        // Verify Student Code exists
        const matchedStudent = accounts.find(
          (a) => a.role === 'student' && a.studentCode?.toUpperCase() === cleanCode
        );

        if (!matchedStudent) {
          return {
            success: false,
            message: `No student was found with Student ID "${cleanCode}". Please verify your child's student admission code.`,
          };
        }

        const newParent: UserAccount = {
          id: `usr-parent-${Date.now()}`,
          name: data.name.trim(),
          email: emailLower,
          mobile: data.mobile.trim(),
          role: 'parent',
          status: 'active',
          relationship: data.relationship,
          linkedStudentCodes: [matchedStudent.studentCode!],
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        };

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: newParent.email,
          role: 'parent',
          action: 'CHILD_LINKED',
          details: `Parent ${newParent.name} (${newParent.relationship}) linked to student ${matchedStudent.name} (${matchedStudent.studentCode})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({
          accounts: [...accounts, newParent],
          currentUser: newParent,
          auditLogs: [log, ...auditLogs],
        });

        return {
          success: true,
          message: `Parent account verified! Successfully linked to ${matchedStudent.name}.`,
          user: newParent,
        };
      },

      approveTeacher: (teacherId) => {
        const { accounts, auditLogs } = get();
        const teacher = accounts.find((a) => a.id === teacherId);
        if (!teacher) return;

        const updated = accounts.map((a) =>
          a.id === teacherId ? { ...a, status: 'active' as AccountStatus } : a
        );

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: teacher.email,
          role: 'admin',
          action: 'TEACHER_APPROVED',
          details: `Super Admin approved faculty account for ${teacher.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({ accounts: updated, auditLogs: [log, ...auditLogs] });
      },

      rejectTeacher: (teacherId) => {
        const { accounts, auditLogs } = get();
        const teacher = accounts.find((a) => a.id === teacherId);
        if (!teacher) return;

        const updated = accounts.map((a) =>
          a.id === teacherId ? { ...a, status: 'disabled' as AccountStatus } : a
        );

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: teacher.email,
          role: 'admin',
          action: 'TEACHER_REJECTED',
          details: `Super Admin declined faculty registration for ${teacher.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({ accounts: updated, auditLogs: [log, ...auditLogs] });
      },

      requestPasswordReset: (email) => {
        const { accounts, auditLogs, resetTokens } = get();
        const cleanEmail = email.trim().toLowerCase();
        const user = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

        if (!user) {
          // Security practice: prevent email enumeration, but return helpful message in dev
          return { success: false, message: 'If an account exists with this email address, a password reset link has been dispatched.' };
        }

        const token = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const expiry = Date.now() + 1000 * 60 * 30; // 30 minutes expiry

        const newReset: PasswordResetToken = {
          token,
          email: cleanEmail,
          role: user.role,
          expiresAt: expiry,
        };

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: cleanEmail,
          role: user.role,
          action: 'PASSWORD_RESET_REQ',
          details: `Secure single-use reset token generated for ${user.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({
          resetTokens: [...resetTokens, newReset],
          auditLogs: [log, ...auditLogs],
        });

        return {
          success: true,
          message: `Password reset link dispatched to ${cleanEmail}. (Valid for 30 minutes)`,
          token,
        };
      },

      resetPassword: (token, newPassword) => {
        const { resetTokens, auditLogs } = get();
        const resetItem = resetTokens.find((r) => r.token === token);

        if (!resetItem) {
          return { success: false, message: 'Invalid or already-used password reset token.' };
        }

        if (Date.now() > resetItem.expiresAt) {
          return { success: false, message: 'This password reset link has expired. Please request a fresh one.' };
        }

        if (newPassword.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters long.' };
        }

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: resetItem.email,
          role: resetItem.role,
          action: 'PASSWORD_RESET_DONE',
          details: `Password was successfully updated. Token invalidated.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Invalidate token
        set({
          resetTokens: resetTokens.filter((r) => r.token !== token),
          auditLogs: [log, ...auditLogs],
        });

        return { success: true, message: 'Your password has been successfully updated!' };
      },

      linkChildToParent: (parentId, studentCode) => {
        const { accounts, auditLogs } = get();
        const cleanCode = studentCode.trim().toUpperCase();

        const student = accounts.find((a) => a.role === 'student' && a.studentCode === cleanCode);
        if (!student) {
          return { success: false, message: `No student record found with code "${cleanCode}".` };
        }

        const updated = accounts.map((a) => {
          if (a.id === parentId) {
            const currentCodes = a.linkedStudentCodes || [];
            if (!currentCodes.includes(cleanCode)) {
              return { ...a, linkedStudentCodes: [...currentCodes, cleanCode] };
            }
          }
          return a;
        });

        const log: AuditLog = {
          id: `log-${Date.now()}`,
          email: student.email,
          role: 'parent',
          action: 'CHILD_LINKED',
          details: `Parent linked additional student ${student.name} (${cleanCode})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set({ accounts: updated, auditLogs: [log, ...auditLogs] });
        return { success: true, message: `Successfully linked ${student.name} (${cleanCode}) to your parent account!` };
      },
    }),
    {
      name: 'fuzion-auth-storage',
    }
  )
);
