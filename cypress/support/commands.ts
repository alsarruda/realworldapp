/// <reference types="cypress" />

import cypress = require("cypress");
declare global {
   namespace Cypress {
     interface Chainable {
       login(email: string, password: string): Chainable<void>
       isRequiredField(fieldName: string): Chainable<void>
     }
   }
 }

Cypress.Commands.add('login', (email,password) => {
            cy.get('input[name="email"]').type(email,{delay: 0})
            cy.get('input[name="password"]').type(password,{delay: 0})
            cy.contains('button','Sign in').click()
            cy.url({timeout: 60000}).should('eq','http://localhost:5173/')
})

Cypress.Commands.add('isRequiredField',(fieldName: string)=>{
    cy.get(fieldName).should('have.prop','required',true)
})