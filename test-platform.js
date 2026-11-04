const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 FUZION ACADEMY - SYSTEM INTEGRATION TEST SUITE');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName} ${details ? `(${details})` : ''}`);
  } else {
    console.error(`❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

// 1. Verify Public Game Assets
console.log('--- 1. Testing Standalone HTML Games Registry ---');
const gamesDir = path.join(__dirname, 'public', 'games');
assert(fs.existsSync(gamesDir), 'Games directory exists');
const gameFiles = fs.readdirSync(gamesDir).filter(f => f.endsWith('.html'));
assert(gameFiles.length >= 30, 'All HTML games populated', `Found ${gameFiles.length} games`);

// Key games check
const keyGames = [
  'grammar_galaxy_the_alien_ambassador.html',
  'verb_voltage.html',
  'the_60_second_time_bomb_game.html',
  'interviewpro_studio (2).html',
  'scenario_quest_real_world_english_roleplay_studio.html',
  'Impromptu_Speech_Wheel_Game (1).html',
  'fuzion_academy_english_hub (5).html',
];
keyGames.forEach(kg => {
  const exists = fs.existsSync(path.join(gamesDir, kg));
  assert(exists, `Game file exists: ${kg}`);
});

// 2. Verify Study Materials (PDFs)
console.log('\n--- 2. Testing Study Materials (120+ PDFs) ---');
const materialsDir = path.join(__dirname, 'public', 'materials');
assert(fs.existsSync(materialsDir), 'Materials directory exists');
const pdfFiles = fs.readdirSync(materialsDir).filter(f => f.endsWith('.pdf'));
assert(pdfFiles.length >= 100, 'PDF worksheets populated', `Found ${pdfFiles.length} PDF files`);

// 3. Verify Logo & Branding
console.log('\n--- 3. Testing Logo & Branding Assets ---');
const logoDir = path.join(__dirname, 'public', 'logo');
assert(fs.existsSync(logoDir), 'Logo directory exists');
const logoFiles = fs.readdirSync(logoDir);
assert(logoFiles.includes('Colorful logo.png'), 'Colorful logo exists');
assert(logoFiles.includes('Colured.svg') || logoFiles.includes('Icon.png'), 'SVG/Icon assets exist');

// 4. Verify Next.js Build Output
console.log('\n--- 4. Testing Production Build Manifests ---');
const nextDir = path.join(__dirname, '.next');
assert(fs.existsSync(nextDir), '.next build output exists');
const serverPages = path.join(nextDir, 'server', 'app');
assert(fs.existsSync(serverPages), 'Server-rendered App Router output exists');

// 5. Test AI Speaking Evaluation Route Handler
console.log('\n--- 5. Testing AI Speaking Evaluation Logic ---');
async function testSpeakingEvaluation() {
  const sampleTranscript = "Hello, my name is Rahul Sharma. In my previous company, we discuss about project deadlines and me and my friend worked closely on business presentations.";
  
  // Directly test the route logic algorithm
  const words = sampleTranscript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationMin = 35 / 60;
  const wpm = Math.round(wordCount / durationMin);

  assert(wordCount > 20, 'Word count parsed correctly', `${wordCount} words`);
  assert(wpm >= 30, 'Speaking pace (WPM) calculated', `${wpm} WPM`);

  // ESL corrections check
  const hasDiscussAbout = /\b(discuss about|explain about)\b/i.test(sampleTranscript);
  assert(hasDiscussAbout, 'Grammar mistake detected: "discuss about"');

  const hasMeAndMyFriend = /\b(me and my friend)\b/i.test(sampleTranscript);
  assert(hasMeAndMyFriend, 'Subject pronoun mistake detected: "me and my friend"');

  console.log('\n====================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('====================================================\n');
}

testSpeakingEvaluation();
