const fs = require('fs');
const path = require('path');

const srcDirs = [
  path.join(__dirname, '../src/app'),
  path.join(__dirname, '../src/components')
];

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') && !filePath.includes('ThemeToggle.tsx') && !filePath.includes('ThemeProvider.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const replacements = [
  // Backgrounds
  { from: /\bbg-zinc-950(?![\/\w])/g, to: 'bg-zinc-50 dark:bg-zinc-950' },
  { from: /\bbg-zinc-900(?![\/\w])/g, to: 'bg-white dark:bg-zinc-900' },
  { from: /\bbg-zinc-850(?![\/\w])/g, to: 'bg-zinc-100 dark:bg-zinc-850' },
  { from: /\bbg-zinc-800(?![\/\w])/g, to: 'bg-zinc-200 dark:bg-zinc-800' },
  // Borders
  { from: /\bborder-zinc-900(?![\/\w])/g, to: 'border-zinc-200 dark:border-zinc-900' },
  { from: /\bborder-zinc-850(?![\/\w])/g, to: 'border-zinc-300 dark:border-zinc-850' },
  { from: /\bborder-zinc-800(?![\/\w])/g, to: 'border-zinc-200 dark:border-zinc-800' },
  // Text colors
  { from: /\btext-white\b/g, to: 'text-zinc-900 dark:text-white' },
  { from: /\btext-zinc-100(?![\/\w])/g, to: 'text-zinc-900 dark:text-zinc-100' },
  { from: /\btext-zinc-200(?![\/\w])/g, to: 'text-zinc-800 dark:text-zinc-200' },
  { from: /\btext-zinc-300(?![\/\w])/g, to: 'text-zinc-700 dark:text-zinc-300' },
  { from: /\btext-zinc-400(?![\/\w])/g, to: 'text-zinc-600 dark:text-zinc-400' },
  // Hovers
  { from: /\bhover:bg-zinc-900(?![\/\w])/g, to: 'hover:bg-zinc-100 dark:hover:bg-zinc-900' },
  { from: /\bhover:bg-zinc-800(?![\/\w])/g, to: 'hover:bg-zinc-200 dark:hover:bg-zinc-800' },
  { from: /\bhover:text-white\b/g, to: 'hover:text-zinc-900 dark:hover:text-white' },
  { from: /\bhover:border-zinc-800(?![\/\w])/g, to: 'hover:border-zinc-300 dark:hover:border-zinc-800' },
  
  // Opacity variants
  { from: /\bbg-zinc-900\/40\b/g, to: 'bg-white/60 dark:bg-zinc-900/40' },
  { from: /\bbg-zinc-900\/60\b/g, to: 'bg-white/80 dark:bg-zinc-900/60' },
  { from: /\bbg-zinc-950\/50\b/g, to: 'bg-zinc-50/80 dark:bg-zinc-950/50' },
  { from: /\bbg-zinc-950\/80\b/g, to: 'bg-zinc-50/90 dark:bg-zinc-950/80' },
  { from: /\bborder-zinc-800\/60\b/g, to: 'border-zinc-200/80 dark:border-zinc-800/60' },
  { from: /\bborder-zinc-800\/80\b/g, to: 'border-zinc-200 dark:border-zinc-800/80' }
];

let allFiles = [];
srcDirs.forEach(dir => {
  allFiles = allFiles.concat(getFiles(dir));
});

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${path.basename(file)}`);
  }
});

console.log('Conversion complete!');
