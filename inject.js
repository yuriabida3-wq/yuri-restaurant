const fs = require('fs');
const p = 'public/index.html';
let s = fs.readFileSync(p, 'utf8');
if (s.includes('reviews.js')) {
  console.log('Already injected — skipping');
} else {
  s = s.replace('</body>', '<script src="reviews.js" defer></script>\n</body>');
  fs.writeFileSync(p, s);
  console.log('Injected reviews.js into index.html');
}
