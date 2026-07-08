import fs from 'fs';
import path from 'path';

const dir = './src';
const search = 'http://localhost:8080';
const replace = 'https://kabad-backend.onrender.com';

function walkDir(currentDirPath) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && /\.(js|jsx)$/.test(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(search)) {
        content = content.replace(new RegExp(search, 'g'), replace);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    } else if (stat.isDirectory()) {
      walkDir(filePath);
    }
  });
}

walkDir(dir);
