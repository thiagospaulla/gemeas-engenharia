# 📸 Como Adicionar as Imagens dos Projetos

## 🎯 Você tem 4 imagens de projetos que precisam ser hospedadas

### Opção 1: Usar Imgur (Recomendado - Rápido)

1. **Acesse:** https://imgur.com/upload
2. **Faça upload das 4 imagens:**
   - Imagem 1: Edifício AHAVA
   - Imagem 2: Espaço Revolução  
   - Imagem 3: Galeria Comercial
   - Imagem 4: Residência Moderna

3. **Copie os links diretos** (clique com botão direito → "Copiar endereço da imagem")

4. **Edite o arquivo:** `app/page.tsx`

Substitua as URLs:
```tsx
// Linha ~149
src="https://i.imgur.com/SEU_LINK_1.jpg"  // AHAVA

// Linha ~168
src="https://i.imgur.com/SEU_LINK_2.jpg"  // Espaço Revolução

// Linha ~187
src="https://i.imgur.com/SEU_LINK_3.jpg"  // Galeria

// Linha ~206
src="https://i.imgur.com/SEU_LINK_4.jpg"  // Residência
```

---

### Opção 2: Usar Pasta Public (Para produção)

1. **Salve as imagens em:** `public/projects/`
   ```
   public/
   └── projects/
       ├── ahava.jpg
       ├── espaco-revolucao.jpg
       ├── galeria.jpg
       └── residencia.jpg
   ```

2. **Edite `app/page.tsx`:**
   ```tsx
   src="/projects/ahava.jpg"
   src="/projects/espaco-revolucao.jpg"
   src="/projects/galeria.jpg"
   src="/projects/residencia.jpg"
   ```

3. **Commit e push:**
   ```bash
   git add public/projects/
   git commit -m "feat: adicionar imagens dos projetos"
   git push
   ```

---

### Opção 3: Usar Vercel Blob Storage

1. **Na Vercel Dashboard:**
   - Vá em Storage → Create Database → Blob
   - Faça upload das imagens
   - Copie as URLs públicas

2. **Use as URLs no código**

---

## 🖼️ Imagens que você tem:

1. **Edifício AHAVA** - Prédio comercial bege/creme
2. **Espaço Revolução** - Edifício moderno preto
3. **Galeria Comercial** - Lojas com design contemporâneo
4. **Residência Moderna** - Casa com garagem e design clean

---

## ⚡ Solução Rápida (Use agora):

Vou atualizar o código para usar gradientes bonitos enquanto você não hospeda as imagens. O sistema já está funcional!

Se quiser adicionar as imagens depois:
1. Hospede no Imgur
2. Substitua as URLs
3. Faça commit e push

---

**O sistema está funcionando! As imagens são opcionais.** ✅
