# IRONCUT 21D — SaaS App

Protocolo de Transformação Corporal com IA personalizada.

---

## 🚀 Como fazer o deploy na Vercel (passo a passo)

### PASSO 1 — Criar conta no GitHub
1. Acesse https://github.com
2. Clique em **Sign up** e crie sua conta gratuita
3. Confirme o e-mail

### PASSO 2 — Criar repositório no GitHub
1. Clique no botão **+** no canto superior direito
2. Clique em **New repository**
3. Nome: `ironcut-saas`
4. Deixe como **Public**
5. Clique em **Create repository**

### PASSO 3 — Fazer upload dos arquivos
1. Na página do repositório criado, clique em **uploading an existing file**
2. Arraste a pasta `ironcut-saas` inteira (ou os arquivos)
3. Clique em **Commit changes**

### PASSO 4 — Deploy na Vercel
1. Acesse https://vercel.com
2. Clique em **Sign up** e entre com sua conta do GitHub
3. Clique em **Add New... → Project**
4. Selecione o repositório `ironcut-saas`
5. Clique em **Deploy**
6. Aguarde 2-3 minutos ☕

### PASSO 5 — Seu app está no ar!
A Vercel vai gerar um link tipo:
```
https://ironcut-saas.vercel.app
```
Copie esse link e envie para seus clientes!

---

## 🌐 Conectar domínio próprio (opcional)

Se você comprou um domínio (ex: `app.ironcut.com.br`):

1. Na Vercel, vá em **Settings → Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `app.ironcut.com.br`)
4. A Vercel vai te dar um código DNS
5. No painel do Registro.br ou Hostinger, adicione esse registro DNS
6. Em até 24h o domínio vai funcionar

---

## 📦 Estrutura do projeto

```
ironcut-saas/
├── public/
│   └── index.html        ← página HTML base
├── src/
│   ├── App.jsx           ← app principal (todo o código)
│   └── index.js          ← ponto de entrada React
├── package.json          ← dependências
├── vercel.json           ← configuração Vercel
└── .gitignore
```

---

## 🔧 Rodar localmente (opcional)

Se quiser testar no seu computador antes:

```bash
npm install
npm start
```

Acesse: http://localhost:3000

---

## 📱 Funcionalidades

- ✅ Cadastro em 4 etapas com perfil completo
- ✅ Login com e-mail e senha (salvo no navegador)
- ✅ Objetivo: Emagrecer 🔥 ou Ganhar Massa 💪
- ✅ Protocolo gerado por IA personalizado
- ✅ Dashboard com gráfico de evolução de peso
- ✅ Plano de treinos (academia ou casa)
- ✅ Plano alimentar completo com macros
- ✅ Chat Personal IA e Nutricionista IA
- ✅ 100% responsivo para celular

---

## ❓ Dúvidas

Entre em contato: ironcut.com.br
