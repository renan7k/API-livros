const { defineConfig } = require("cypress");

const { configurePlugin } = require('cypress-mongodb');


module.exports = defineConfig({
  env: {
    mongodb: {
      uri: 'mongodb+srv://dba:12345@livroapi.5eq0e.mongodb.net/?retryWrites=true&w=majority&appName=LivroApi',
      database: 'test',
      collection: 'livros'
    }
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      configurePlugin(on);
    },
    video:true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',  //Diretório onde vai salvar o relatório
      overwrite: false,  // não vai sobrescrever
      html: true,  // formato
      json: false, // formato
      timestamp: "mmddyyyy_HHMMss"}
  },
});
