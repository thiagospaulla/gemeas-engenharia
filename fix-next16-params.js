const fs = require('fs');
const path = require('path');

// Arquivos que precisam ser corrigidos
const files = [
  'app/api/documents/[id]/route.ts',
  'app/api/users/[id]/activate/route.ts',
  'app/api/team/[id]/projects/route.ts',
  'app/api/team/[id]/route.ts',
  'app/api/users/[id]/route.ts',
  'app/api/invoices/[id]/route.ts',
];

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Padrão 1: Substituir definição de params
  const pattern1 = /\{ params \}: \{ params: \{ id: string \} \}/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '{ params }: { params: Promise<{ id: string }> }');
    modified = true;
  }

  // Padrão 2: Adicionar await params após try { se não existir
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    
    // Se encontrar uma função com params Promise e o próximo não é await params
    if (lines[i].includes('{ params }: { params: Promise<{ id: string }> }')) {
      // Procurar o próximo try {
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].trim() === 'try {') {
          // Verificar se a próxima linha já tem await params
          if (j + 1 < lines.length && !lines[j + 1].includes('await params')) {
            // Adicionar await params
            const indent = lines[j + 1].match(/^\s*/)[0];
            newLines.push(indent + 'const { id } = await params');
            modified = true;
          }
          break;
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, newLines.join('\n'), 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
  } else {
    console.log(`ℹ️  Sem mudanças: ${filePath}`);
  }
});

console.log('\n✅ Correção concluída!');
