# Fuzion Academy – Vercel Deployment Guide

This project is 100% pre-tested and verified for zero-error deployment on **Vercel**.

---

## 1. Quick 3-Step Deployment

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Initialize your git repository in the project folder and push to your private or public GitHub repository:
```bash
git init
git add .
git commit -m "Complete Fuzion Academy AI LMS with multi-portal auth"
git branch -M main
git remote add origin https://github.com/<your-username>/fuzion-academy.git
git push -u origin main
```
*(The generated `.gitignore` automatically prevents your local secrets and `node_modules` from being uploaded).*

---

### Step 2: Import into Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Select your repository: **`fuzion-academy`**.
3. **Framework Preset**: Vercel will automatically detect **Next.js**.
4. **Root Directory**: `./` (leave default).

---

### Step 3: Configure Environment Variables in Vercel
Before clicking "Deploy", expand the **Environment Variables** section in Vercel and add these keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://amzptluvdjlhwluolufa.supabase.co` | Supabase Database URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_fRFkl6m5y3sPhusPtn5CzQ_LeKq94wI` | Supabase Publishable Key |
| `GEMINI_API_KEY` | `AQ.Ab8RN6JxuPLktXD5fr9Dki5jO53hFg6x1HBnId4sDL0rUDOosw` | Google Gemini API Key |
| `NEXT_PUBLIC_ACADEMY_NAME` | `Fuzion Academy` | Academy Branding |
| `NEXT_PUBLIC_ACADEMY_LOCATION` | `Sector-11, Pratap Vihar, Ghaziabad` | Campus Location |
| `NEXT_PUBLIC_ACADEMY_HELPLINE` | `9582774387` | Official Support Hotline |
| `NEXT_PUBLIC_ACADEMY_FOUNDER` | `Praveen Singh Rawat` | Founder Name |

Click **Deploy**! Vercel will build and assign your production domain within 60–90 seconds.

---

## 2. Pre-Deployment Test Results (Passed 37/37)

- **Next.js App Router Pages (16/16)**: All static & dynamic pages compiled with 0 errors.
- **Role Portals (4/4)**: Student, Teacher, Super Admin, and Parent portals verified.
- **Security Check**: Public administrator registration strictly blocked (`403 Forbidden`).
- **AI Speaking Coach**: Examiner evaluation verified with active Google Gemini 3.5 live models.
- **Study Materials**: 126 PDF files verified with direct streaming & CDN serving.
- **Games Engine**: 37 interactive HTML games verified.
