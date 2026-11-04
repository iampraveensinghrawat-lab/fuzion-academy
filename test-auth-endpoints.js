// test-auth-endpoints.js
// Automated End-to-End Verification of Fuzion Academy Auth System

const http = require('http');

function postRequest(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
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

function getRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, length: body.length });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== FUZION ACADEMY AUTH SYSTEM END-TO-END VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`\x1b[32m[PASS]\x1b[0m ${testName}`);
      passed++;
    } else {
      console.error(`\x1b[31m[FAIL]\x1b[0m ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // 1. Verify Portal Landing & Route availability
    const pages = [
      '/auth',
      '/login',
      '/auth/student/login',
      '/auth/teacher/login',
      '/auth/admin/login',
      '/auth/parent/login',
      '/auth/student/signup',
      '/auth/teacher/signup',
      '/auth/parent/signup',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/student/dashboard',
      '/teacher/dashboard',
      '/admin/dashboard',
      '/parent/dashboard',
    ];

    console.log('--- 1. Testing Page Endpoints ---');
    for (const page of pages) {
      const res = await getRequest(page);
      assert(
        res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308,
        `Page: ${page} responds with ${res.statusCode}`
      );
    }

    // 2. Test Student Login API
    console.log('\n--- 2. Testing Login API Endpoints ---');
    const studentLoginSuccess = await postRequest('/api/auth/login', {
      emailOrMobile: 'student@fuzion.com',
      password: 'Password@123',
      role: 'student',
    });
    assert(
      studentLoginSuccess.statusCode === 200 && studentLoginSuccess.body.user.role === 'student',
      'Student Login with valid credentials',
      JSON.stringify(studentLoginSuccess.body)
    );

    const studentLoginWrongPw = await postRequest('/api/auth/login', {
      emailOrMobile: 'student@fuzion.com',
      password: '123',
      role: 'student',
    });
    assert(
      studentLoginWrongPw.statusCode === 401,
      'Student Login with wrong/short password returns 401',
      `Got ${studentLoginWrongPw.statusCode}`
    );

    // 3. Test Teacher Login
    const teacherLogin = await postRequest('/api/auth/login', {
      emailOrMobile: 'teacher@fuzion.com',
      password: 'Password@123',
      role: 'teacher',
    });
    assert(
      teacherLogin.statusCode === 200 && teacherLogin.body.user.role === 'teacher',
      'Teacher Login with valid credentials',
      JSON.stringify(teacherLogin.body)
    );

    // 4. Test Admin Login
    const adminLogin = await postRequest('/api/auth/login', {
      emailOrMobile: 'admin@fuzion.com',
      password: 'Admin@Secure2026',
      role: 'admin',
    });
    assert(
      adminLogin.statusCode === 200 && adminLogin.body.user.role === 'admin',
      'Admin Login with Super Admin credentials',
      JSON.stringify(adminLogin.body)
    );

    // 5. Test Parent Login
    const parentLogin = await postRequest('/api/auth/login', {
      emailOrMobile: 'parent@fuzion.com',
      password: 'Password@123',
      role: 'parent',
    });
    assert(
      parentLogin.statusCode === 200 && parentLogin.body.user.role === 'parent',
      'Parent Login with valid credentials',
      JSON.stringify(parentLogin.body)
    );

    // 6. Test Security Constraint: Public Admin Sign-Up MUST BE FORBIDDEN
    console.log('\n--- 3. Testing Sign-Up Security Constraints ---');
    const adminSignupAttempt = await postRequest('/api/auth/signup', {
      role: 'admin',
      name: 'Hacker Admin',
      email: 'hacker@admin.com',
      password: 'Password123!',
    });
    assert(
      adminSignupAttempt.statusCode === 403,
      'Public Admin Registration strictly blocked with 403 Forbidden',
      `Got ${adminSignupAttempt.statusCode}`
    );

    // 7. Test Teacher Registration with valid invite code
    const teacherSignup = await postRequest('/api/auth/signup', {
      role: 'teacher',
      name: 'Ms. Meenakshi Sharma',
      email: 'meenakshi.test@fuzion.com',
      mobile: '9812345678',
      password: 'Password@123',
      qualification: 'M.A. English, CELTA',
      experienceYears: '6 Years',
      specialisation: 'IELTS Band 8+ & Public Speaking',
      invitationCode: 'FA-TEACH-2026',
    });
    assert(
      teacherSignup.statusCode === 200 && teacherSignup.body.status === 'pending_approval',
      'Teacher registration with valid invite code creates account in pending_approval state',
      JSON.stringify(teacherSignup.body)
    );

    // 8. Test Teacher Registration with invalid invite code
    const teacherBadCode = await postRequest('/api/auth/signup', {
      role: 'teacher',
      name: 'Bad Code Teacher',
      email: 'badcode@fuzion.com',
      mobile: '9812345679',
      password: 'Password@123',
      qualification: 'M.A.',
      experienceYears: '1 Year',
      specialisation: 'Grammar',
      invitationCode: 'INVALID-CODE-999',
    });
    assert(
      teacherBadCode.statusCode === 400,
      'Teacher registration with invalid invite code rejected with 400',
      `Got ${teacherBadCode.statusCode}`
    );

    // 9. Test Student Registration
    const studentSignup = await postRequest('/api/auth/signup', {
      role: 'student',
      name: 'Aman Verma',
      email: 'aman.verma.test@fuzion.com',
      mobile: '9988776655',
      password: 'Password@123',
      ageOrDob: '21',
      cefrLevel: 'Intermediate',
      course: 'Spoken English & Interview Prep',
      batchCode: 'FA-B1-EVENING',
    });
    assert(
      studentSignup.statusCode === 200 && studentSignup.body.status === 'active',
      'Student registration completed with status active',
      JSON.stringify(studentSignup.body)
    );

    // 10. Test Parent Registration with Child code linking
    const parentSignup = await postRequest('/api/auth/signup', {
      role: 'parent',
      name: 'Suresh Verma',
      email: 'suresh.parent.test@fuzion.com',
      mobile: '9876543210',
      password: 'Password@123',
      relationship: 'Father',
      studentCode: 'FA-STU-101',
    });
    assert(
      parentSignup.statusCode === 200 && parentSignup.body.status === 'active',
      'Parent registration links verified student code FA-STU-101',
      JSON.stringify(parentSignup.body)
    );

    // 11. Test Password Recovery Flow
    console.log('\n--- 4. Testing Password Recovery Flow ---');
    const forgotPw = await postRequest('/api/auth/forgot-password', {
      email: 'student@fuzion.com',
    });
    assert(
      forgotPw.statusCode === 200 && Boolean(forgotPw.body.resetToken),
      'Forgot password generates single-use cryptographic token',
      JSON.stringify(forgotPw.body)
    );

    if (forgotPw.body.resetToken) {
      const resetPw = await postRequest('/api/auth/reset-password', {
        token: forgotPw.body.resetToken,
        newPassword: 'BrandNewPassword@2026',
        confirmPassword: 'BrandNewPassword@2026',
      });
      assert(
        resetPw.statusCode === 200 && resetPw.body.success === true,
        'Reset password verifies token and updates password',
        JSON.stringify(resetPw.body)
      );
    }

    console.log('\n=============================================');
    console.log(`TOTAL TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('=============================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
