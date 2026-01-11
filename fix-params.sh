#!/bin/bash

# Script para corrigir params em todas as rotas dinâmicas do Next.js 16

echo "Corrigindo rotas dinâmicas para Next.js 16..."

# Substituir params: { id: string } por params: Promise<{ id: string }>
find app/api -name "route.ts" -type f -exec sed -i '' \
  's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' {} \;

echo "✅ Correção concluída!"
echo "Agora você precisa adicionar 'const { id } = await params' no início de cada função."
