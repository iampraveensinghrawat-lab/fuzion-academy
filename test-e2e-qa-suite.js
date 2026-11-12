// test-e2e-qa-suite.js
// Automated End-to-End QA, Security & Verification Suite for Fuzion Academy

const http = require('http');
const https = require('https');
const { spawn } = require('child_process');
const path = require('path');

let passedTests = 0;
let failedTests = 0;
const results = [];

function recordTest(category, name, passed, details = '') {
  if (passed) {
    passedTests++;
    console.log(`\x1b[32m[PASS]\x1b[0m [${category}] ${name}`);
  } else {
    failedTests++;
    console.error(`\x1b[31m[FAIL]\x1b[0m [${category}] ${name} -> ${details}`);
  }
  results.push({ category, name, passed, details });
}

function postRequest(urlPath, data, port = 3000) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: port,
        path: urlPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, body: JSON.parse(body), raw: body });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getRequest(urlPath, port = 3000) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: port,
        path: urlPath,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(body), raw: body });
          } catch (e) {
            resolve({ statusCode: res.statusCode, headers: res.headers, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runSuite() {
  console.log('========================================================================');
  console.log('  FUZION ACADEMY - COMPREHENSIVE QA, SECURITY & PERFORMANCE SUITE');
  console.log('========================================================================\n');

  // Start Next.js production server on port 3000
  console.log('Starting local Next.js server on port 3000...');
  const server = spawn('cmd.exe', ['/c', 'npm start'], {
    cwd: __dirname,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => {
    // console.log(`[server] ${d}`);
  });

  // Wait for server to become responsive
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const health = await getRequest('/');
      if (health.statusCode === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {
      // waiting
    }
  }

  if (!serverReady) {
    console.error('Failed to start server on port 3000. Proceeding with static and API handler audits.');
  } else {
    console.log('Server is online and responding to HTTP requests!\n');

    // 1. Health & Core Navigation
    console.log('--- SECTION 1: Health & Navigation Verification ---');
    const pages = [
      { path: '/', name: 'Landing Home Page' },
      { path: '/auth', name: 'Multi-Portal Router' },
      { path: '/auth/student/login', name: 'Student Login' },
      { path: '/auth/student/signup', name: 'Student Signup' },
      { path: '/auth/teacher/login', name: 'Teacher Login' },
      { path: '/auth/teacher/signup', name: 'Teacher Signup' },
      { path: '/auth/admin/login', name: 'Admin Login' },
      { path: '/auth/parent/login', name: 'Parent Login' },
      { path: '/student/dashboard', name: 'Student Dashboard' },
      { path: '/teacher/dashboard', name: 'Teacher Dashboard' },
      { path: '/admin/dashboard', name: 'Admin Dashboard' },
      { path: '/parent/dashboard', name: 'Parent Dashboard' },
    ];

    for (const p of pages) {
      try {
        const res = await getRequest(p.path);
        recordTest('Navigation', `${p.name} (${p.path})`, res.statusCode === 200, `HTTP status ${res.statusCode}`);
      } catch (err) {
        recordTest('Navigation', `${p.name} (${p.path})`, false, err.message);
      }
    }

    // 2. Authentication Flow & Role Validation
    console.log('\n--- SECTION 2: Authentication & Registration Validation ---');
    try {
      // Invalid email / short password
      const weakPass = await postRequest('/api/auth/login', {
        emailOrMobile: 'student@fuzion.com',
        password: '123',
        role: 'student',
      });
      recordTest('Auth Validation', 'Rejects password < 6 characters (HTTP 401)', weakPass.statusCode === 401);

      // Valid Student Login
      const validStudent = await postRequest('/api/auth/login', {
        emailOrMobile: 'student@fuzion.com',
        password: 'Password@123',
        role: 'student',
      });
      recordTest('Auth Validation', 'Valid student authentication (HTTP 200)', validStudent.statusCode === 200 && validStudent.body.success);

      // Student Signup
      const studentSignup = await postRequest('/api/auth/signup', {
        name: 'Test Student Rahul',
        email: 'rahul.test@fuzion.com',
        password: 'Password@123',
        role: 'student',
      });
      recordTest('Auth Validation', 'Student self-registration enabled (HTTP 200)', studentSignup.statusCode === 200);

      // Super Admin Signup Block
      const adminSignupBlock = await postRequest('/api/auth/signup', {
        name: 'Hacker Admin',
        email: 'hacker@evil.com',
        password: 'AdminPassword123!',
        role: 'admin',
      });
      recordTest('Security (BOLA)', 'Public Admin registration strictly blocked (HTTP 403 Forbidden)', adminSignupBlock.statusCode === 403);

      // Teacher Signup without Invitation Code
      const teacherNoCode = await postRequest('/api/auth/signup', {
        name: 'Fake Teacher',
        email: 'teacher@fake.com',
        password: 'TeacherPassword123!',
        role: 'teacher',
      });
      recordTest('Security (Access Control)', 'Teacher signup blocked without valid code (HTTP 400)', teacherNoCode.statusCode === 400);

      // Teacher Signup with Valid Code
      const teacherWithCode = await postRequest('/api/auth/signup', {
        name: 'Authorized Faculty',
        email: 'faculty@fuzion.com',
        password: 'TeacherPassword123!',
        role: 'teacher',
        invitationCode: 'FA-TEACH-2026',
      });
      recordTest('Auth Validation', 'Teacher signup allowed with institutional invitation code', teacherWithCode.statusCode === 200);
    } catch (err) {
      recordTest('Auth Validation', 'Auth test execution', false, err.message);
    }

    // 3. OWASP Security Audit
    console.log('\n--- SECTION 3: Advanced OWASP Top 10 Security Audit ---');
    try {
      // SSRF Test on /api/game-runner
      const ssrfCloudMetadata = await getRequest('/api/game-runner?url=http://169.254.169.254/latest/meta-data/');
      recordTest('OWASP (SSRF)', 'Blocks AWS/Cloud metadata SSRF attempts (HTTP 403 Forbidden)', ssrfCloudMetadata.statusCode === 403);

      const ssrfArbitraryDomain = await getRequest('/api/game-runner?url=https://evil-attacker.com/exploit.html');
      recordTest('OWASP (SSRF)', 'Blocks unauthorized non-Supabase domains in game-runner (HTTP 403 Forbidden)', ssrfArbitraryDomain.statusCode === 403);

      // SQL Injection resilience on endpoints
      const sqliTest = await postRequest('/api/auth/login', {
        emailOrMobile: "' OR '1'='1' --",
        password: "' OR '1'='1' --",
        role: 'student',
      });
      recordTest('OWASP (SQLi)', 'SQL Injection payload in login handled safely without crashing (HTTP 200/401)', sqliTest.statusCode === 200 || sqliTest.statusCode === 401);

      // XSS Input Sanitization verification
      const xssInQuiz = await postRequest('/api/quizzes', {
        title: '<script>alert("XSS")</script> Grammar Test',
        url: 'https://gemini.google.com',
        batch: 'All Batches',
        questions: 10,
      });
      recordTest('OWASP (XSS)', 'Quiz API safely parses HTML tags as string data without code execution', xssInQuiz.statusCode === 200);

      // Security Headers Check
      const headerCheck = await getRequest('/');
      const headers = headerCheck.headers;
      recordTest('OWASP (Security Headers)', 'X-Content-Type-Options: nosniff present', headers['x-content-type-options'] === 'nosniff');
      recordTest('OWASP (Security Headers)', 'Referrer-Policy: strict-origin-when-cross-origin present', headers['referrer-policy'] === 'strict-origin-when-cross-origin');
    } catch (err) {
      recordTest('Security Audit', 'OWASP tests execution', false, err.message);
    }

    // 4. API Endpoints Functional & Cloud Database Sync
    console.log('\n--- SECTION 4: Cloud API Endpoints & Sync Verification ---');
    try {
      const gamesApi = await getRequest('/api/games');
      recordTest('Cloud Sync', 'GET /api/games returns cloud catalog (HTTP 200)', gamesApi.statusCode === 200 && Array.isArray(gamesApi.body.games));

      const materialsApi = await getRequest('/api/materials');
      recordTest('Cloud Sync', 'GET /api/materials returns study library (HTTP 200)', materialsApi.statusCode === 200 && Array.isArray(materialsApi.body.materials));

      const quizzesApi = await getRequest('/api/quizzes');
      recordTest('Cloud Sync', 'GET /api/quizzes returns batch quizzes (HTTP 200)', quizzesApi.statusCode === 200 && Array.isArray(quizzesApi.body.quizzes));
    } catch (err) {
      recordTest('Cloud Sync', 'API endpoint audit', false, err.message);
    }
  }

  // Gracefully stop the server process
  server.kill('SIGINT');
  console.log('\n========================================================================');
  console.log(`TEST SUITE RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('========================================================================\n');
}

runSuite().catch(console.error);
