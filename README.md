# Tela de Login / Cadastro

Tela dividida em dois painéis (formulário em azul, boas-vindas em branco) que
troca de modo (login ⇄ cadastro) com animação, com um back-end simples para
guardar os usuários.

## Como Rodar

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

## Observações Importantes

O site, atualmente, roda apenas na minha máquina. Este repositório foi criado para fins educativos.
