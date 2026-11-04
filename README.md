# 🎓 Fuzion Academy – AI-Powered English LMS & Games Hub

> **"Learn English. Speak Confidently. Grow Professionally."**  
> *Institute of Spoken English and Soft Skills Training*  
> **Sector-11, Pratap Vihar, Ghaziabad | Founded by Praveen Singh Rawat | Helpline: 9582774387**

---

## 🌟 Overview

A full-stack English Learning Management System built for **Fuzion Academy**. The platform unifies:
1. **Student Dashboard**: Real-time streak tracking, XP gamification, attendance metrics, pending homework, and personalized faculty feedback.
2. **100+ Games Arcade**: Sandboxed integration for all **37 existing standalone HTML games** (including *Grammar Galaxy*, *Verb Voltage*, *Impromptu Speech Wheel*, *Scrabble Duel*, *Fluency Time Bomb*, and more) with automated XP rewards.
3. **AI Speaking Lab / Roleplay Studio**: Interactive microphone studio with real-time speech recognition, WPM/pace tracking, vocabulary density analysis, and **Google Gemini API** integration for honest, instant examiner evaluations and grammatical corrections.
4. **Study Materials Library (120+ PDFs)**: Complete catalog of worksheets, discussion cards, phonetics guides, and debate materials with in-browser preview and instant download.
5. **Faculty Management Hub**: Role-based access for teachers and administrators to manage student records, mark attendance, publish online Gemini quiz links, assign homework, upload new HTML games via drag-and-drop, and export student reports to CSV/Excel.
6. **Profile & Verified Certificates**: Official printable/downloadable Fuzion Academy course completion certificate authenticated with certificate ID (`FA-CERT-2026-889`).

---

## 🚀 Quick Start (1-Click Run)

### Option 1: Double-Click Launcher (Windows)
- Double-click `d:\antigravity\start-fuzion-academy.bat` to run the **production server** on `http://localhost:3000`.
- Or double-click `d:\antigravity\dev-fuzion-academy.bat` for **live development mode** with hot reloading.

### Option 2: Command Line
```powershell
cd d:\antigravity\fuzion-academy
$env:PATH = "D:\nodejs\node-v22.11.0-win-x64;$env:PATH"

# Run development server
npm run dev

# Or build & start production server
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Environment Variables & API Setup

Configuration is located in `d:\antigravity\fuzion-academy\.env.local`:

```env
# Supabase Configuration (Authentication & PostgreSQL Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google Gemini API (For AI Speaking Studio evaluations)
GEMINI_API_KEY=your-gemini-api-key-here

# Academy Information
NEXT_PUBLIC_ACADEMY_NAME="Fuzion Academy"
NEXT_PUBLIC_ACADEMY_TAGLINE="Learn English. Speak Confidently. Grow Professionally."
NEXT_PUBLIC_ACADEMY_LOCATION="Sector-11, Pratap Vihar, Ghaziabad"
NEXT_PUBLIC_ACADEMY_HELPLINE="9582774387"
NEXT_PUBLIC_ACADEMY_FOUNDER="Praveen Singh Rawat"
```

> **Note on Zero Configuration Mode:** The app includes a built-in reactive store and local linguistic evaluation engine. If keys are not provided yet, the app works 100% out of the box with intelligent evaluation and local state persistence!

---

## 🗄️ Supabase Database Setup

When you are ready to link your Supabase account:
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor**.
3. Open and run the migration script: `d:\antigravity\fuzion-academy\supabase\schema.sql`.
4. Copy your **Project URL** and **Anon Key** into `d:\antigravity\fuzion-academy\.env.local`.

---

## ☁️ Deployment to Vercel or Netlify

### Deploying to Vercel (Recommended):
1. Push this repository to GitHub or upload the `fuzion-academy` folder.
2. Go to [Vercel](https://vercel.com) -> **Add New Project** -> Select the repository.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will build and host the application globally with SSL.

---

## 📁 Project Architecture

```
d:\antigravity\fuzion-academy\
├── public/
│   ├── games/            # 37 standalone HTML games (sandboxed)
│   ├── materials/        # 123 PDF study activities & e-books
│   └── logo/             # Fuzion Academy official SVG & PNG branding
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── speaking-evaluate/route.ts  # Gemini AI speech evaluator
│   │   ├── globals.css   # Tailored theme matching screenshots
│   │   ├── layout.tsx    # Root layout & Google Fonts
│   │   └── page.tsx      # Main LMS application with dynamic tabs
│   ├── components/
│   │   ├── Header.tsx                 # Announcement bar, logo, role switcher
│   │   ├── DashboardTab.tsx           # Student home, streaks, XP, feedback
│   │   ├── GamesHubTab.tsx            # 100+ Games catalog & filtering
│   │   ├── SpeakingCoachTab.tsx       # AI Speaking Studio with mic recording
│   │   ├── MaterialsTab.tsx           # 120+ PDF viewer & download library
│   │   ├── LeaderboardTab.tsx         # Academy-wide standings & XP rankings
│   │   ├── ProfileCertificatesTab.tsx # Student card & verified certificate
│   │   ├── FacultyPortalTab.tsx       # Teacher records, attendance, quizzes
│   │   ├── GameModal.tsx              # Sandboxed HTML game player
│   │   └── CertificateModal.tsx       # Printable official completion certificate
│   └── lib/
│       ├── gamesData.ts       # Registry of games with CEFR levels & rewards
│       ├── materialsData.ts   # Categorized index of PDF study materials
│       ├── speakingPrompts.ts # Interview, roleplay & public speaking prompts
│       ├── store.ts           # Zustand reactive state with persistence
│       └── supabase.ts        # Supabase client wrapper
├── supabase/
│   └── schema.sql        # Full PostgreSQL database schema
├── .env.example          # Environment variable template
└── .env.local            # Local credentials configuration
```
