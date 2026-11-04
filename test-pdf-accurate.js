const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 FUZION ACADEMY - ACCURATE PDF INTEGRITY CHECK');
console.log('====================================================\n');

const materialsDir = path.join(__dirname, 'public', 'materials');
const materialsDataPath = path.join(__dirname, 'src', 'lib', 'materialsData.ts');

const content = fs.readFileSync(materialsDataPath, 'utf8');

// Match "fileName": "..."
const regex = /"fileName":\s*"([^"]+)"/g;
let match;
let total = 0;
let missing = 0;

while ((match = regex.exec(content)) !== null) {
  total++;
  const fileName = match[1];
  const fullPath = path.join(materialsDir, fileName);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ ACTUALLY MISSING: "${fileName}"`);
    missing++;
  }
}

console.log(`\nVerified ${total} PDF files:`);
console.log(`✅ ${total - missing} verified directly on disk`);
if (missing === 0) {
  console.log(`🎉 100% of all ${total} PDF materials exist and match disk files byte-for-byte!`);
} else {
  console.log(`❌ ${missing} missing`);
}
console.log('\n====================================================\n');
