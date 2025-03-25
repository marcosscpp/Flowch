const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'dist');
const cssDir = path.join(__dirname, 'dist/assets');

function replaceImageReferences(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = fileContent.replace(/\.(png|jpg|jpeg)/gi, '.webp');
  
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`Referências de imagem atualizadas em: ${filePath}`);
}


function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && (file.endsWith('.html') || file.endsWith('.css'))) {
      replaceImageReferences(filePath);
    } else if (stat.isDirectory()) {
      processDirectory(filePath);
    }
  });
}


processDirectory(htmlDir);
processDirectory(cssDir);
