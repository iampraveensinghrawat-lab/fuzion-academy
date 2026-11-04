const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 FUZION ACADEMY - PDF SYSTEM INTEGRITY CHECK');
console.log('====================================================\n');

const materialsDir = path.join(__dirname, 'public', 'materials');
const materialsDataPath = path.join(__dirname, 'src', 'lib', 'materialsData.ts');

const content = fs.readFileSync(materialsDataPath, 'utf8');
const lines = content.split('\n');

let checked = 0;
let missing = 0;

lines.forEach(line => {
  if (line.includes('"fileName":')) {
    checked++;
    const fileName = line.split('"fileName":')[1].replace(/["',]/g, '').trim();
    const fullPath = path.join(materialsDir, fileName);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ MISSING: "${fileName}"`);
      missing++;
    }
  }
});

console.log(`\nVerified ${checked} PDF entries:`);
console.log(`✅ ${checked - missing} Existing & Valid`);
if (missing > 0) {
  console.log(`❌ ${missing} Missing`);
} else {
  console.log(`🎉 100% of PDF entries in materialsData.ts exist on disk!`);
}

// Check api/pdf route exists
const apiPdfRoute = path.join(__dirname, 'src', 'app', 'api', 'pdf', 'route.ts');
if (fs.existsSync(apiPdfRoute)) {
  console.log('✅ /api/pdf route handler installed and verified.');
} else {
  console.error('❌ /api/pdf route handler missing!');
}

console.log('\n====================================================\n');
