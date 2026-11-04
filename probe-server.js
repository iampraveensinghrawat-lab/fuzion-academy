const http = require('http');

console.log('Sending test request to AI Speaking Evaluation API...');

const postData = JSON.stringify({
  transcript: "Hello, my name is Rahul Sharma. I have graduated with a degree in computer applications and currently work as a junior analyst. My long-term goal is to lead international product teams. I want to polish my English speaking skills so I can communicate confidently with global stakeholders.",
  promptTitle: "Introduce yourself and talk about your career goals.",
  category: "INTERVIEW",
  durationSeconds: 35
});

// Since Next.js API route is compiled into a standalone handler in .next/server/app/api/speaking-evaluate/route.js,
// we can verify the handler directly or through fetch!
console.log('Test payload prepared successfully:');
console.log(postData);
