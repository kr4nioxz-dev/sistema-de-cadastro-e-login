// server.js — Servidor Express: serve o front-end (pasta /public) e expõe
// as duas únicas rotas de API que essa tela precisa: cadastro e login.

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const { createUser, findUserByEmail, findUserById } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10; // "custo" do hash da senha — 10 é o equilíbrio padrão entre segurança e velocidade

app.use(cors({ credentials: true }));               // credentials: true permite o cookie de sessão viajar entre origens
app.use(express.json());                            // interpreta o corpo das requisições como JSON

// Sessão: guarda um cookie no navegador que aponta pra um registro no servidor.
// É isso que faz o servidor "lembrar" quem está logado entre uma requisição e outra.
app.use(session({
  secret: process.env.SESSION_SECRET || 'troque-este-valor-em-producao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // sessão expira em 2 horas
    secure: false // em produção, atrás de HTTPS, mude para true
  }
}));

app.use(express.static(path.join(__dirname, 'public'))); // serve index.html, style.css e script.js

// --- POST /api/register — cria uma conta nova ---
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validação no servidor: o front-end também valida, mas isso pode ser
  // burlado (ex.: alguém chamando a API direto). O servidor é a última linha de defesa.
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha precisa ter no mínimo 6 caracteres.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (findUserByEmail(normalizedEmail)) {
    return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
  }

  try {
    // Hash irreversível: mesmo que o arquivo do banco vaze, ninguém recupera a senha original
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    createUser(name.trim(), normalizedEmail, passwordHash);
    return res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno ao criar a conta.' });
  }
});

// --- POST /api/login — autentica um usuário existente ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const user = findUserByEmail(email.toLowerCase().trim());

  // Mensagem genérica de propósito: não dizemos se o erro foi o e-mail
  // ou a senha, para dificultar a descoberta de quais e-mails estão cadastrados.
  const invalidCredentials = { message: 'E-mail ou senha incorretos.' };

  if (!user) {
    return res.status(401).json(invalidCredentials);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json(invalidCredentials);
  }

  // Grava o id do usuário na sessão: é isso que "loga" o usuário de fato.
  // A partir daqui, qualquer requisição desse navegador chega com o cookie
  // de sessão e o servidor sabe quem é, sem precisar mandar a senha de novo.
  req.session.userId = user.id;

  return res.status(200).json({
    message: `Bem-vindo(a) de volta, ${user.name}!`,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// --- GET /api/me — devolve os dados de quem está logado nessa sessão ---
app.get('/api/me', (req, res) => {
  if (!req.session.userId) { 
    return res.status(401).json({ message: 'Não autenticado.' });
  }

  const user = findUserById(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: 'Não autenticado.' });
  }

  return res.status(200).json({ id: user.id, name: user.name, email: user.email });
});

// --- POST /api/logout — encerra a sessão atual ---
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Sessão encerrada.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
