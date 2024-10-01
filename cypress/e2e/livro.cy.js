/// <reference types="cypress" />
describe('Testes referente as rotas da api /livros', () => {

  before(() => {
    //comando do plugin cypress-mongodb, para limpar a collection com os dados antes dos testes
    cy.dropCollection('livros', { database: 'test', failSilently: 'true' }).then(result => {
      cy.log(result); // Will return 'Collection dropped' or the error object if collection doesn’t exist. Will not fail the test
    });
  })

  context('Testes contemplando o método POST', () => {
    it('Cadastrar um novo livro com sucesso - POST', () => {

      const livro = {
        "titulo": "Fogo e sangue",
        "autor": "George R.R. Martin",
        "editora": "Suma",
        "anoPublicacao": 2018,
        "numeroPaginas": 595
      };

      cy.postLivro(livro)
        .then(response => {
          expect(response.status).to.eql(201);
          expect(response.body.titulo).to.eql(livro.titulo);
          expect(response.body.autor).to.eql(livro.autor);
          expect(response.body.editora).to.eql(livro.editora);
          expect(response.body.anoPublicacao).to.eql(livro.anoPublicacao);
          expect(response.body.numeroPaginas).to.eql(livro.numeroPaginas);
          expect(response.body._id).to.not.be.empty;
        })
    })

    it('Não cadastrar um livro duplicado - POST', () => {

      const livro = {
        "titulo": "Moby Dick",
        "autor": "Herman Melville",
        "editora": "Editora G",
        "anoPublicacao": 1851,
        "numeroPaginas": 635
      };

      cy.postLivro(livro)
        .then(response => {
          expect(response.status).to.eql(201)
        })

      cy.postLivro(livro)
        .then(response => {
          expect(response.status).to.eql(409);
          expect(response.body.erro).to.eql("O título do livro já foi cadastrado.");
        })

      // cy.api({
      //   url: 'http://localhost:5000/api/livros',
      //   method: 'POST',
      //   body: livro,
      //   failOnStatusCode: false  //essencial para o cypress não apresentar erro, pois por padrão, ele espera um retorno da família 200
      // }).then(response => {
      //   expect(response.status).to.eql(409);
      //   expect(response.body.erro).to.eql("O título do livro já foi cadastrado.");
      // })
    })

    it.skip('Erro de serviço no cadastro de livro - POST', () => {

      const livro = {
        "titulo": "The Great Gatsby",
        "autor": "F. Scott Fitzgerald",
        "editora": "Editora F",
        "anoPublicacao": 1925,
        "numeroPaginas": 180
      };

      cy.intercept('POST', 'http://localhost:5000/api/livros', {
        statusCode: 500
      }).as('postLivroError');

      cy.postLivro(livro);
      // POR ALGUM MOTIVO, A ROTA NÃO ESTÁ SENDO INTERCEPTADA, VALIDAR SE O INTERCEPT SERVE PARA O COMANDO CY.REQUEST 
      cy.wait('@postLivroError').then((interception) => {
        expect(interception.response.statusCode).to.eq(500);
        expect(interception.response.body).to.have.property('error', 'Erro ao cadastrar livro');
      });

    })

    it('Verificar obrigatoriedade do campo título', () => {
      const livro = {
        "autor": "Fyodor Dostoevsky",
        "editora": "Editora K",
        "anoPublicacao": 1866,
        "numeroPaginas": 430
      };
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property('error', 'Todos os campos são obrigatórios');
      })
    })

    it('Verificar obrigatoriedade do campo autor', () => {
      const livro = {
        "titulo": "Crime and Punishment",
        "editora": "Editora K",
        "anoPublicacao": 1866,
        "numeroPaginas": 430
      };
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property('error', 'Todos os campos são obrigatórios');
      })
    })

    it('Verificar obrigatoriedade do campo editora', () => {
      const livro = {
        "titulo": "Crime and Punishment",
        "autor": "Fyodor Dostoevsky",
        "anoPublicacao": 1866,
        "numeroPaginas": 430
      };
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property('error', 'Todos os campos são obrigatórios');
      })
    })

    it('Verificar obrigatoriedade do campo anoPublicacao', () => {
      const livro = {
        "titulo": "Crime and Punishment",
        "autor": "Fyodor Dostoevsky",
        "editora": "Editora K",
        "numeroPaginas": 430
      };
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property('error', 'Todos os campos são obrigatórios');
      })

    })
    
    it('Verificar obrigatoriedade do campo numeroPaginas', () => {
      const livro = {
        "titulo": "Crime and Punishment",
        "autor": "Fyodor Dostoevsky",
        "editora": "Editora K",
        "anoPublicacao": 1866,
      };
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(400);
        expect(response.body).to.have.property('error', 'Todos os campos são obrigatórios');
      })
    })
  })

  context('Testes contemplanto o método GET', () => {
    it('Consultar lista com todos os livros - GET', () => {

      cy.addLivro();
      cy.getLivro()
        .then(response => {
          expect(response.status).to.eql(200);
          expect(response.body).to.not.be.empty;
        })
    })
    it('Consultar um livro cadastrado por ID - GET', () => {
      const livro = {
        "titulo": "The Great Gatsby",
        "autor": "F. Scott Fitzgerald",
        "editora": "Editora F",
        "anoPublicacao": 1925,
        "numeroPaginas": 180
      };
      let livroId;
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(201);
        livroId = response.body._id;
        cy.log(`O _id do livro cadastrado é: ${livroId}`)
      }).then(() => {  //aqui estamos utilizando o then, para ter o encadeamento, e a segunda chamada só ser realizada após a obtenção do id
        cy.getLivroById(livroId).then((response => {
          expect(response.status).to.eql(200);
          expect(response.body.titulo).to.eql(livro.titulo);
          expect(response.body.autor).to.eql(livro.autor);
          expect(response.body.editora).to.eql(livro.editora);
          expect(response.body.anoPublicacao).to.eql(livro.anoPublicacao);
          expect(response.body.numeroPaginas).to.eql(livro.numeroPaginas);
          expect(response.body._id).to.eq(livroId);
        }))
      })

    })

    it('Consultar um livro não cadastrado - GET', () => {

      let livroId = '66f710f12d3cf6769db48887';
      cy.getLivroById(livroId).then((response => {
        expect(response.status).to.eql(404);
        expect(response.body).to.have.property('error', 'Livro não encontrado');
      }))
    })

    it('Consultar um livro com ID inválido - GET', () => {

      let livroId = '66f710f12d3cf6769db48887dgt';
      cy.getLivroById(livroId).then((response => {
        expect(response.status).to.eql(500);
        expect(response.body).to.have.property('error', 'Erro ao buscar livro');
      }))
    })
  })

  context('Testes contemplanto o método DELETE', () => {
    it('Remover livro com sucesso - DELETE', () => {

      const livro = {
        "titulo": "Fahrenheit 451",
        "autor": "Ray Bradbury",
        "editora": "Editora J",
        "anoPublicacao": 1953,
        "numeroPaginas": 158
      }
      let livroId;
      cy.postLivro(livro).then(response => {
        expect(response.status).to.eql(201);
        livroId = response.body._id;
        cy.log(`O _id do livro cadastrado é: ${livroId}`)
      }).then(() => {
        cy.removeLivroById(livroId).then((response => {
          expect(response.status).to.eql(200);
          expect(response.body).to.have.property('message', 'Livro removido com sucesso');
        }))
      })

    })

    it('Remover livro NÃO cadastrado - DELETE', () => {
      let livroId = '66f710f12d3cf6769db48887';
      cy.removeLivroById(livroId).then((response => {
        expect(response.status).to.eql(404);
        expect(response.body).to.have.property('error', 'Livro não encontrado');
      }))
    })

    it('Erro ao tentar remover livro com ID inválido- DELETE', () => {
      let livroId = '66f710f12d3cf6769db48887dgt';
      cy.removeLivroById(livroId).then((response => {
        expect(response.status).to.eql(500);
        expect(response.body).to.have.property('error', 'Erro ao deletar livro');
      }))
    })
  })
})