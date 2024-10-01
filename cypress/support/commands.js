// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('postLivro', (livro) => {
    cy.api({
        url: 'http://localhost:5000/api/livros',
        method: 'POST',
        body: livro,
        failOnStatusCode: false
    }).then(response => {
        return response;
    })
})

Cypress.Commands.add('addLivro', () => {
    const livro = {
        "titulo": "To Kill a Mockingbird",
        "autor": "Harper Lee",
        "editora": "Editora E",
        "anoPublicacao": 1960,
        "numeroPaginas": 281
      };

    cy.api({
        url: 'http://localhost:5000/api/livros',
        method: 'POST',
        body: livro,
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})

Cypress.Commands.add('getLivro', () => {
    cy.api({
        url: 'http://localhost:5000/api/livros',
        method: 'GET',
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})

Cypress.Commands.add('getLivroById', (id) => {
    cy.api({
        url: `http://localhost:5000/api/livros/${id}`,
        method: 'GET',
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})

Cypress.Commands.add('removeLivroById', (id) => {
    cy.api({
        url: `http://localhost:5000/api/livros/${id}`,
        method: 'DELETE',
        failOnStatusCode: false
    }).then(response => {
        return response
    })
})