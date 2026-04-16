/**
 * Removes `OnInit` from @angular/core imports when the file has no ngOnInit and does not implement OnInit.
 */
const fs = require('fs');
const path = require('path');

function walkTs(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkTs(p, out);
    else if (e.isFile() && p.endsWith('.ts') && !p.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

function stripOnInit(source) {
  if (!source.includes("@angular/core") || !source.includes('OnInit')) return source;
  if (/\bngOnInit\s*\(/.test(source)) return source;
  if (/\bimplements\s[^{]*\bOnInit\b/.test(source)) return source;

  let s = source;
  s = s.replace(/,\s*OnInit\s*,/g, ',');
  s = s.replace(/{\s*OnInit\s*,/g, '{');
  s = s.replace(/,\s*OnInit\s*}/g, '}');
  return s;
}

const root = path.join(__dirname, '..', 'projects');
let n = 0;
for (const f of walkTs(root)) {
  const orig = fs.readFileSync(f, 'utf8');
  const next = stripOnInit(orig);
  if (next !== orig) {
    fs.writeFileSync(f, next);
    n++;
  }
}
console.log('Updated', n, 'files');
