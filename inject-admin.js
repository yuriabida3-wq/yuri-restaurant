const fs = require('fs');
const p = 'public/admin.html';
let s = fs.readFileSync(p, 'utf8');
const marker = 'setInterval(function(){if(TOKEN&&document.getElementById(\'dashBox\').style.display!==\'none\')loadData()},5000);';
if (s.includes('yuri_auto_refresh')) {
  console.log('Already patched');
} else {
  s = s.replace(
    "if(TOKEN){api('/api/admin/data')",
    "/* yuri_auto_refresh */" + marker + "\nif(TOKEN){api('/api/admin/data')"
  );
  fs.writeFileSync(p, s);
  console.log('Admin auto-refresh added');
}
