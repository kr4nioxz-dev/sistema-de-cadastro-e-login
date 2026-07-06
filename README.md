# Tela de Login / Cadastro — Azul & Preto

Tela dividida em dois painéis (formulário em azul, boas-vindas em branco) que
troca de modo (login ⇄ cadastro) com animação, com um back-end simples para
guardar os usuários.

## Como rodar

```bash
npm install
npm start
```

Depois acesse **http://localhost:3000** no navegador.

## Estrutura

```
tela-login/
├── public/            → front-end (o que o navegador carrega)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js          → servidor Express e rotas da API
├── db.js              → acesso aos dados dos usuários
├── database.json      → criado automaticamente no primeiro cadastro
└── package.json
```

## API

| Rota             | Método | Corpo (JSON)                                |
|------------------|--------|---------------------------------------------|
| `/api/register`  | POST   | `{ name, email, password }`                 |
| `/api/login`     | POST   | `{ email, password }`                       |

## Próximos passos sugeridos

- Trocar `database.json` por um banco de verdade (Postgres, MySQL, SQLite)
  quando o projeto crescer — só é preciso editar `db.js`.
- Adicionar sessão/JWT para manter o usuário logado entre páginas.
- Adicionar limite de tentativas de login (rate limiting) contra força bruta.
