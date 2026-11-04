// test-pre-deployment.js
// Comprehensive Pre-Vercel Deployment Verification Test Suite

const http = require('http');
const fs = require('fs');
const path = require('path');

function getRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const encodedPath = encodeURI(urlPath);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: encodedPath,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            length: body.length,
            bodySnippet: body.slice(0, 100),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function postRequest(urlPath, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const encodedPath = encodeURI(urlPath);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: encodedPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, rawBody: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runPreDeploymentSuite() {
  console.log('================================================================');
  console.log('   FUZION ACADEMY – PRE-VERCEL DEPLOYMENT AUDIT & TEST SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`\x1b[32m[PASS]\x1b[0m ${testName}`);
      passed++;
    } else {
      console.error(`\x1b[31m[FAIL]\x1b[0m ${testName} -> ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // SECTION 1: Page & Routing Health Check
    // -------------------------------------------------------------
    console.log('--- 1. Testing Next.js App Router Pages ---');
    const pages = [
      { path: '/', expected: 200, name: 'Home Landing Page & Header' },
      { path: '/auth', expected: 200, name: 'Multi-Portal Selection (4 Portals)' },
      { path: '/login', expected: 307, name: 'Legacy /login redirect to /auth' },
      { path: '/auth/student/login', expected: 200, name: 'Student Login Portal' },
      { path: '/auth/student/signup', expected: 200, name: 'Student Sign-Up Portal' },
      { path: '/auth/teacher/login', expected: 200, name: 'Teacher Login Portal' },
      { path: '/auth/teacher/signup', expected: 200, name: 'Teacher Sign-Up (Invitation Required)' },
      { path: '/auth/admin/login', expected: 200, name: 'Super Admin Login Portal' },
      { path: '/auth/parent/login', expected: 200, name: 'Parent Login Portal' },
      { path: '/auth/parent/signup', expected: 200, name: 'Parent Sign-Up (Child Code Linked)' },
      { path: '/auth/forgot-password', expected: 200, name: 'Forgot Password Page' },
      { path: '/auth/reset-password', expected: 200, name: 'Reset Password Page' },
      { path: '/student/dashboard', expected: 200, name: 'Student Dedicated Dashboard' },
      { path: '/teacher/dashboard', expected: 200, name: 'Teacher Dedicated Dashboard' },
      { path: '/admin/dashboard', expected: 200, name: 'Admin Console & Approvals' },
      { path: '/parent/dashboard', expected: 200, name: 'Parent Progress Portal' },
    ];

    for (const p of pages) {
      const res = await getRequest(p.path);
      assert(
        res.statusCode === p.expected || (p.expected === 307 && (res.statusCode === 307 || res.statusCode === 308)),
        `${p.name} (${p.path}) responds with HTTP ${res.statusCode}`,
        `Expected ${p.expected}, got ${res.statusCode}`
      );
    }

    // -------------------------------------------------------------
    // SECTION 2: Role Authentication API Suite
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Authentication APIs & Access Control ---');

    // 2.1 Student Auth
    const studentRes = await postRequest('/api/auth/login', {
      emailOrMobile: 'student@fuzion.com',
      password: 'Password@123',
      role: 'student',
    });
    assert(
      studentRes.statusCode === 200 && studentRes.body.user.role === 'student',
      'Student Login API (student@fuzion.com)',
      JSON.stringify(studentRes.body)
    );

    // 2.2 Teacher Auth
    const teacherRes = await postRequest('/api/auth/login', {
      emailOrMobile: 'teacher@fuzion.com',
      password: 'Password@123',
      role: 'teacher',
    });
    assert(
      teacherRes.statusCode === 200 && teacherRes.body.user.role === 'teacher',
      'Teacher Login API (teacher@fuzion.com)',
      JSON.stringify(teacherRes.body)
    );

    // 2.3 Super Admin Auth
    const adminRes = await postRequest('/api/auth/login', {
      emailOrMobile: 'admin@fuzion.com',
      password: 'Admin@Secure2026',
      role: 'admin',
    });
    assert(
      adminRes.statusCode === 200 && adminRes.body.user.role === 'admin',
      'Admin Login API (admin@fuzion.com)',
      JSON.stringify(adminRes.body)
    );

    // 2.4 Parent Auth
    const parentRes = await postRequest('/api/auth/login', {
      emailOrMobile: 'parent@fuzion.com',
      password: 'Password@123',
      role: 'parent',
    });
    assert(
      parentRes.statusCode === 200 && parentRes.body.user.role === 'parent',
      'Parent Login API (parent@fuzion.com)',
      JSON.stringify(parentRes.body)
    );

    // 2.5 Security: Admin Public Registration Blocked
    const adminBlocked = await postRequest('/api/auth/signup', {
      role: 'admin',
      name: 'Unauthorized User',
      email: 'intruder@fuzion.com',
      password: 'Password123!',
    });
    assert(
      adminBlocked.statusCode === 403,
      'Security: Public Admin Registration strictly forbidden with 403',
      `Got status ${adminBlocked.statusCode}`
    );

    // 2.6 Teacher Invitation Validation
    const teacherInvalidInvite = await postRequest('/api/auth/signup', {
      role: 'teacher',
      name: 'Unverified Teacher',
      email: 'fake.teacher@fuzion.com',
      password: 'Password@123',
      invitationCode: 'INVALID-CODE-000',
    });
    assert(
      teacherInvalidInvite.statusCode === 400,
      'Security: Teacher registration rejects invalid invitation code',
      `Got status ${teacherInvalidInvite.statusCode}`
    );

    const teacherValidInvite = await postRequest('/api/auth/signup', {
      role: 'teacher',
      name: 'Authorized Faculty',
      email: 'valid.faculty@fuzion.com',
      password: 'Password@123',
      invitationCode: 'FA-TEACH-2026',
    });
    assert(
      teacherValidInvite.statusCode === 200 && teacherValidInvite.body.status === 'pending_approval',
      'Teacher registration with FA-TEACH-2026 flags status as pending_approval',
      JSON.stringify(teacherValidInvite.body)
    );

    // 2.7 Password Recovery Cycle
    const forgotRes = await postRequest('/api/auth/forgot-password', {
      email: 'student@fuzion.com',
    });
    assert(
      forgotRes.statusCode === 200 && Boolean(forgotRes.body.resetToken),
      'Password Recovery: Generates single-use reset token',
      JSON.stringify(forgotRes.body)
    );

    if (forgotRes.body.resetToken) {
      const resetRes = await postRequest('/api/auth/reset-password', {
        token: forgotRes.body.resetToken,
        newPassword: 'SecureNewPassword@2026',
        confirmPassword: 'SecureNewPassword@2026',
      });
      assert(
        resetRes.statusCode === 200 && resetRes.body.success === true,
        'Password Recovery: Token validated and password updated successfully',
        JSON.stringify(resetRes.body)
      );
    }

    // -------------------------------------------------------------
    // SECTION 3: AI Speaking Coach Live Examiner Test
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing AI Speaking Coach Evaluation Engine ---');
    const speakingRes = await postRequest('/api/speaking-evaluate', {
      transcript: 'Yesterday I did went to Delhi with me and my friend. We was very much excited and discuss about prices.',
      promptTitle: 'Describe a memorable journey',
      category: 'IELTS Part 2',
      durationSeconds: 25,
      accent: 'en-IN',
    });

    assert(
      speakingRes.statusCode === 200,
      'AI Speaking Coach responds with HTTP 200 OK',
      `Status: ${speakingRes.statusCode}`
    );

    if (speakingRes.body) {
      assert(
        typeof speakingRes.body.ieltsBand === 'number' && speakingRes.body.ieltsBand > 0,
        `Honest IELTS Band generated: Band ${speakingRes.body.ieltsBand}`,
        `Got: ${speakingRes.body.ieltsBand}`
      );
      assert(
        Array.isArray(speakingRes.body.corrections) && speakingRes.body.corrections.length > 0,
        `Specific grammar corrections identified: ${speakingRes.body.corrections?.length} rules caught`,
        `Count: ${speakingRes.body.corrections?.length}`
      );
      assert(
        typeof speakingRes.body.teacherAdvice === 'string' && speakingRes.body.teacherAdvice.length > 40,
        'Honest Examiner Coaching Advice provided from Praveen Sir',
        speakingRes.body.teacherAdvice?.slice(0, 60)
      );
    }

    // -------------------------------------------------------------
    // SECTION 4: Study Materials & PDF API
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Study Materials (126 PDFs) & Streaming API ---');
    const samplePdfName = '10_ways_to_start_a_presentation.pdf';
    const pdfRes = await getRequest(`/api/pdf?file=${encodeURIComponent(samplePdfName)}`);
    assert(
      pdfRes.statusCode === 200 && pdfRes.headers['content-type'] === 'application/pdf',
      `PDF Streaming API serves "${samplePdfName}" (Status: ${pdfRes.statusCode}, Size: ${pdfRes.length} bytes)`,
      `Status: ${pdfRes.statusCode}, Content-Type: ${pdfRes.headers['content-type']}`
    );

    const directPdfRes = await getRequest(`/materials/${encodeURIComponent(samplePdfName)}`);
    assert(
      directPdfRes.statusCode === 200,
      `Direct Static CDN file serving (/materials/...) responds with HTTP 200 (${directPdfRes.length} bytes)`,
      `Status: ${directPdfRes.statusCode}`
    );

    // -------------------------------------------------------------
    // SECTION 5: Games Library & HTML Assets
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Interactive Games Engine ---');
    const gamesDir = path.join(process.cwd(), 'public', 'games');
    if (fs.existsSync(gamesDir)) {
      const gameFiles = fs.readdirSync(gamesDir).filter((f) => f.endsWith('.html'));
      assert(gameFiles.length > 0, `Games catalog populated with ${gameFiles.length} interactive HTML games`);

      if (gameFiles.length > 0) {
        const sampleGame = gameFiles[0];
        const gameRes = await getRequest(`/games/${encodeURIComponent(sampleGame)}`);
        assert(
          gameRes.statusCode === 200,
          `Game "${sampleGame}" loaded successfully (HTTP 200, ${gameRes.length} bytes)`,
          `Status: ${gameRes.statusCode}`
        );
      }
    } else {
      assert(false, 'Games directory public/games found');
    }

    // -------------------------------------------------------------
    // SECTION 6: Vercel Deployment Checklist Verification
    // -------------------------------------------------------------
    console.log('\n--- 6. Verifying Vercel Deployment Pre-Flight Checklist ---');
    // Check package.json scripts
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    assert(pkg.scripts && pkg.scripts.build === 'next build', 'package.json contains "build": "next build" script');

    // Check .env.example exists with all required keys
    const envExample = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
    assert(envExample.includes('NEXT_PUBLIC_SUPABASE_URL'), '.env.example includes NEXT_PUBLIC_SUPABASE_URL');
    assert(envExample.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), '.env.example includes NEXT_PUBLIC_SUPABASE_ANON_KEY');
    assert(envExample.includes('GEMINI_API_KEY'), '.env.example includes GEMINI_API_KEY');

    console.log('\n================================================================');
    console.log(`PRE-DEPLOYMENT AUDIT SUMMARY:`);
    console.log(`TOTAL CHECKS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log(`STATUS: ${failed === 0 ? '✓ READY FOR VERCEL DEPLOYMENT' : '✕ ISSUES DETECTED'}`);
    console.log('================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runPreDeploymentSuite();
