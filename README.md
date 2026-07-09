# Tela de Login / Cadastro

Tela dividida em dois painéis com um formulário em azul e boas-vindas em branco que
troca de modo (login ⇄ cadastro) com animação, com um back-end simples para
guardar os usuários e uma sessão real para a área logada.

## Sobre Projeto

Projeto de estudo em back-end: uma tela de autenticação com aparência de
produto real (painéis que trocam de lugar e cor com animação, tipografia
em duas camadas) e um servidor por trás que resolve os problemas de verdade
de um sistema de login.
A senha nunca salva em texto puro, sessão de usuário via cookie, rotas protegidas
e validação no servidor.

**Stack:** HTML, CSS e JavaScript puro no front-end · Node.js + Express no
back-end · persistência simples em arquivo (sem dependências nativas para
instalar).

## Como Rodar

```bash
npm install
npm start
```

Depois acesse **http://localhost:3000** no navegador.

## Estrutura

```
tela-login/
├── public/
│   ├── index.html      → tela de login/cadastro
│   ├── dashboard.html   → página protegida, mostrada depois do login
│   ├── style.css
│   ├── script.js         → lógica da tela de login/cadastro
│   └── dashboard.js      → checa a sessão e carrega os dados do usuário
├── server.js             → servidor Express, rotas da API e sessão
├── db.js                 → acesso aos dados dos usuários
├── database.json         → criado automaticamente no primeiro cadastro
└── package.json
```

## API

| Rota             | Método | Descrição                                          |
|------------------|--------|-----------------------------------------------------|
| `/api/register`  | POST   | `{ name, email, password }` → cria uma conta         |
| `/api/login`     | POST   | `{ email, password }` → autentica e cria a sessão    |
| `/api/me`        | GET    | Retorna os dados de quem está logado (401 se não)    |
| `/api/logout`    | POST   | Encerra a sessão atual                               |
