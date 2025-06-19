# 🛒 ClickZone Ecommerce - Backend

O backend da aplicação **ClickZone** foi desenvolvido com Node.js e Express, utilizando MongoDB como banco de dados. Ele fornece uma API REST completa para gerenciar usuários, produtos, pedidos, avaliações, carrinho e pagamentos. A arquitetura segue o padrão MVC, com autenticação via JWT e integração com Stripe.

---

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Multer
- Stripe
- Bcrypt.js
- Dotenv
- CORS

---

## 🔐 Funcionalidades Implementadas

- Cadastro e login de usuários
- Autenticação com JWT
- CRUD de produtos
- Gerenciamento de carrinho
- Criação e rastreamento de pedidos
- Upload de imagens (usuários e produtos)
- Sistema de avaliações
- Integração com Stripe (Cartão e Pix)
- Dashboard com estatísticas para admin
- Middleware para rotas protegidas (auth/admin)

---

## 🧪 Scripts Disponíveis

| Comando         | Descrição                                |
|------------------|-------------------------------------------|
| `npm run dev`    | Inicia o servidor com nodemon (dev)       |
| `npm start`      | Inicia o servidor em modo produção        |

---

## 💳 Integração com Stripe

A ClickZone permite pagamentos online por meio do Stripe:
- Cartão de crédito
- Pix (via Stripe API)

---

## 📈 Recursos Futuramente Inclusos

- Logs avançados com Morgan
- Testes automatizados com Jest
- Rate limiting / segurança adicional (Helmet)

---

## 🧑‍💻 Desenvolvido por

- Eduarda Cardoso Brandão  
- Projeto pessoal com foco em arquitetura backend moderna para e-commerce.

---
