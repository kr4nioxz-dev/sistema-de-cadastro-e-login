// db.js — Camada de acesso a dados (a "base de dados" do projeto)
//
// DECISÃO DE ARQUITETURA: por que um arquivo JSON e não SQLite/Postgres?
// Tentei usar SQLite primeiro, mas o driver mais comum (better-sqlite3) precisa
// compilar código nativo na instalação — isso falha em redes restritas e exige
// ferramentas de build na máquina de quem for rodar o projeto. Para uma tela de
// login simples, isso é fragilidade desnecessária. Um arquivo JSON lido/escrito
// pelo módulo "fs" (nativo do Node, zero instalação) resolve o mesmo problema
// com muito menos risco.
//
// Se o projeto crescer e precisar de um banco de verdade, só este arquivo
// precisa mudar: server.js só conhece "createUser" e "findUserByEmail".

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// Cria o arquivo na primeira vez que o servidor sobe, se ele ainda não existir
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], nextId: 1 }, null, 2));
}

// Lê o arquivo inteiro do disco e devolve como objeto JS
function readDatabase() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Sobrescreve o arquivo inteiro com o novo estado
function writeDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Busca um usuário pelo e-mail (usado no login e para checar duplicidade no cadastro)
function findUserByEmail(email) {
  const { users } = readDatabase();
  return users.find((user) => user.email === email);
}

// Busca um usuário pelo id (usado para descobrir quem é o dono da sessão ativa)
function findUserById(id) {
  const { users } = readDatabase();
  return users.find((user) => user.id === id);
}

// Cria um novo usuário e persiste no arquivo
function createUser(name, email, passwordHash) {
  // Ler e escrever aqui dentro da mesma função síncrona (sem "await" no meio)
  // evita condição de corrida: o Node é single-threaded, então nenhuma outra
  // requisição consegue "entrar no meio" dessa leitura+escrita.
  const data = readDatabase();

  const newUser = {
    id: data.nextId,
    name,
    email,
    password_hash: passwordHash, // nunca a senha em si — ver server.js
    created_at: new Date().toISOString()
  };

  data.users.push(newUser);
  data.nextId += 1;
  writeDatabase(data);

  return newUser;
}

module.exports = { createUser, findUserByEmail, findUserById };
