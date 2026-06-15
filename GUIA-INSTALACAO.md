# 📖 Guia Completo de Instalação — Prado Sports AI v9

---

## VISÃO GERAL

O Prado Sports AI usa 3 serviços externos:

| Serviço | Para quê | Gratuito? |
|---|---|---|
| **Vercel** | Hospedar o app na internet | ✅ Sim |
| **API-Sports** | Dados reais de futebol | ✅ Plano grátis disponível |
| **Anthropic (Claude)** | IA de análise e chat | 💳 Pago por uso |

---

## PASSO 1 — Criar conta na Vercel

1. Acesse **vercel.com** e clique em **"Sign Up"**
2. Escolha **"Continue with GitHub"** (mais fácil)
3. Se não tem GitHub, crie em **github.com** primeiro (grátis)
4. Autorize a Vercel a acessar seu GitHub

---

## PASSO 2 — Subir os arquivos no GitHub

1. Acesse **github.com** e clique em **"New repository"**
2. Nome: `prado-sports-ai` (ou qualquer nome)
3. Deixe **Public** e clique em **"Create repository"**
4. Na próxima tela, clique em **"uploading an existing file"**
5. **Extraia o ZIP** `prado-sports-ai-v9-ultra.zip` no seu computador
6. Arraste **TODOS os arquivos e pastas** da pasta `prado-v9/` para a tela do GitHub
7. Clique em **"Commit changes"** (botão verde no final)

> ⚠️ Atenção: suba os arquivos de DENTRO da pasta `prado-v9/`, não a pasta em si.
> O `index.html` deve ficar na raiz do repositório.

---

## PASSO 3 — Conectar GitHub à Vercel

1. Na Vercel, clique em **"Add New Project"**
2. Clique em **"Import Git Repository"**
3. Selecione o repositório `prado-sports-ai` que você criou
4. Clique em **"Import"**
5. Na tela de configuração, **NÃO mexa em nada** — deixe tudo padrão
6. Clique em **"Deploy"**
7. Aguarde 1-2 minutos — seu app já estará no ar!

A Vercel vai te dar um link tipo:
```
https://prado-sports-ai.vercel.app
```

---

## PASSO 4 — API de Futebol (API-Sports)

### 4.1 Criar conta

1. Acesse **api-sports.io** (ou **rapidapi.com/api-sports**)
2. Clique em **"Sign Up"** e crie sua conta grátis
3. Vá em **"Dashboard"** e copie sua **API Key**

### 4.2 Adicionar a chave na Vercel

1. No painel da Vercel, clique no seu projeto
2. Vá em **Settings** (no menu superior)
3. Clique em **Environment Variables** (menu lateral)
4. Clique em **"Add New"** e preencha:
   - **Name:** `APISPORTS_KEY`
   - **Value:** cole sua chave aqui
   - **Environment:** marque os 3 (Production, Preview, Development)
5. Clique em **"Save"**

### 4.3 Forçar novo deploy

1. Vá em **Deployments** no menu superior
2. Clique nos 3 pontinhos `...` do último deploy
3. Clique em **"Redeploy"**
4. Aguarde e pronto — o app agora carrega jogos reais!

### Limites do plano grátis da API-Sports:
- 100 requisições por dia
- Suficiente para ~30 acessos/dia
- Para vender o app: upgrade para plano pago (~$10/mês)

---

## PASSO 5 — IA Claude (Anthropic)

### 5.1 Criar conta Anthropic

1. Acesse **console.anthropic.com**
2. Clique em **"Sign Up"**
3. Confirme o e-mail
4. Vá em **"API Keys"** no menu lateral
5. Clique em **"Create Key"**
6. Copie a chave (começa com `sk-ant-...`)
7. Adicione crédito em **"Billing"** (mínimo $5)

> 💡 O modelo usado é `claude-sonnet-4-6`. Cada conversa custa ~$0,001.
> Com $5 você tem mais de 5.000 conversas.

### 5.2 Criar proxy seguro na Vercel

Para não expor sua chave Claude no código público, crie um arquivo proxy.

Na pasta `api/` do seu repositório GitHub, crie o arquivo `claude.js`:

```javascript
// api/claude.js — proxy seguro para Claude AI
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

### 5.3 Adicionar a chave Anthropic na Vercel

1. Na Vercel → **Settings → Environment Variables**
2. Adicione:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** sua chave `sk-ant-...`
3. Clique em **"Save"** e faça **Redeploy**

### 5.4 Atualizar o app.js para usar o proxy

No arquivo `app.js`, localize esta linha (dentro da função `sendAIMessage`):

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
```

E troque para:

```javascript
const response = await fetch('/api/claude', {
```

Remova também as linhas de `headers` que têm `x-api-key` — o proxy já cuida disso.

Depois salve, suba para o GitHub e a Vercel faz o deploy automático.

---

## PASSO 6 — Domínio personalizado (opcional)

Para ter um endereço tipo `pradosportsai.com.br`:

1. Compre um domínio no **registro.br** (~R$ 40/ano) ou **GoDaddy**
2. Na Vercel → **Settings → Domains**
3. Clique em **"Add Domain"** e digite seu domínio
4. A Vercel vai mostrar os DNS para configurar
5. No painel do seu registrador de domínio, adicione os registros DNS mostrados
6. Aguarde até 24h para propagar

---

## PASSO 7 — Códigos Premium (para vender)

### Como funciona o sistema de vendas:

```
Cliente paga no Mercado Pago
        ↓
Você recebe notificação
        ↓
Adiciona código na planilha Google Sheets
        ↓
Cliente digita o código no app
        ↓
Premium liberado automaticamente ✅
```

### Configurar a planilha:

1. Crie uma planilha no **Google Sheets**
2. Crie as colunas: `Código | Status | Validade | Nome | WhatsApp`
3. Exemplo de linha:
   ```
   PRADO-JOAO-2026 | ativo | 14/06/2027 | João Silva | 11999999999
   ```
4. Clique em **Arquivo → Compartilhar → Publicar na Web**
5. Escolha a aba e formato **CSV**
6. Copie o link publicado
7. No `config.js` do projeto, cole o link em `PREMIUM_CODES_URL`
8. Suba o arquivo atualizado para o GitHub

### Status aceitos pelo app:
- `ativo`, `liberado`, `pago`, `ok`, `sim` → **libera o acesso**
- Qualquer outro valor → **bloqueia**

---

## RESUMO — Checklist final

- [ ] Conta na Vercel criada
- [ ] Repositório no GitHub criado com os arquivos
- [ ] Projeto importado na Vercel e no ar
- [ ] Variável `APISPORTS_KEY` configurada
- [ ] Variável `ANTHROPIC_API_KEY` configurada
- [ ] Arquivo `api/claude.js` criado no repositório
- [ ] URL do Claude atualizada para `/api/claude` no `app.js`
- [ ] Redeploy feito após cada mudança
- [ ] Planilha de códigos Premium configurada
- [ ] Domínio personalizado configurado (opcional)
- [ ] Testado no celular como PWA instalado

---

## 🆘 Problemas comuns

**"A IA não responde"**
→ Verifique se `ANTHROPIC_API_KEY` está na Vercel e se há crédito na conta Anthropic.

**"Jogos não aparecem / aparecem em demo"**
→ Verifique se `APISPORTS_KEY` está configurada e se a Vercel foi feita Redeploy.

**"Erro 500 no /api/football"**
→ A chave da API-Sports pode estar errada ou o plano gratuito chegou no limite diário.

**"App não instala no celular"**
→ O app precisa estar em HTTPS (a Vercel já faz isso). Acesse pelo link da Vercel no Safari (iPhone) ou Chrome (Android).

**"Mudei algo mas não atualizou"**
→ Sempre que salvar um arquivo no GitHub, a Vercel faz deploy automático em ~1 minuto.

---

## 💰 Custos mensais estimados

| Serviço | Plano | Custo |
|---|---|---|
| Vercel | Hobby (grátis) | R$ 0 |
| API-Sports | Grátis (100 req/dia) | R$ 0 |
| API-Sports | Basic (se precisar mais) | ~R$ 50/mês |
| Anthropic Claude | Por uso (~5000 msgs) | ~R$ 25/mês |
| Domínio .com.br | Anual | ~R$ 40/ano |
| **Total inicial** | | **~R$ 0–75/mês** |

Com 10 assinantes Premium a R$ 19,90 já paga todos os custos e sobra lucro. 💸

---

Prado Sports AI v9 — Feito para vender 🚀
