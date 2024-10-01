# 📚 Projeto de criação e testes de APIs
O projeto de desenvolvimento da api foi realizado com apoio do chatGpt , utilizando Node.js e Express, integrando o MongoDB como banco de dados. 
Os testes e2e foram desenvolidos com o Cypress.

## 🛠️ Desenvolvimento das APIs
A API foi desenvolvida utilizando Node.js e Express, estruturando rotas e implementando operações básicas utilizando métodos POST, GET e DELETE.

## 🗃️ Banco de Dados 
A aplicação foi conectada ao MongoDB, utilizando o mongoose.

## 🔍 Testes automatizados
Testes automatizados utilizando cypress para cada endpoint da aplicação, utilizando técnicas para simular e validar respostas da API.
Também foi utilizado do Mochawesome para geração de um report simples em HTML.

## **Pré-requisitos:**
1. **Node.js (versão 20.x LTS)** 
2. **Visual Studio Code** 

## **Subindo a API 🚀**
1. Clonar o repositório e instalar as dependências:
```bash
npm install
```

2. Para executar a API execute:
```bash
npm start
```

## **Rodando os testes automatizados**
Para execução dos testes no modo iterativo:
```bash 
npx cypress open 
``` 
Para execução dos testes no modo headless
```bash 
npx cypress run
``` 

Para execução dos testes com geração do report na pasta "result":
```bash 
npx cypress run --reporter mochawesome
``` 
