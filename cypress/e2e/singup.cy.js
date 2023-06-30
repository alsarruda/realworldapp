/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Sign up scenarios',()=>{

    beforeEach(()=>{
        cy.visit('/register')
    })
    it('User must Sign up', ()=>{
        //User is on the homepage and click to sign up
        cy.get('a[href="/register"]').click()
        cy.get('main div h1').should('be.visible').should('have.text','Sign up')
        // User must fill the form
        cy.get('input[name="username"]').type(faker.internet.userName())
        cy.get('input[name="email"]').type(faker.internet.email())
        cy.get('input[name="password"]').type(faker.internet.password())
        cy.contains('button','Sign up').click()
        cy.url({timeout: 60000}).should('eq','http://localhost:5173/')

    })

    it('Validating Sign up required fields', ()=>{
        cy.isRequiredField('input[name=username]')
        cy.isRequiredField('input[name=email]')
        cy.isRequiredField('input[name=password]')
    })

    it('Validating wrong email format', ()=>{
        cy.get('input[name=email]').type('testemail')
        cy.contains('button','Sign up').click()
        cy.get('input[name=email]').invoke('prop','validationMessage')
        .should((text) =>{
            expect(
                "Please include an '@' in the email address. 'testemail' is missing an '@'."
            ).to.eq(text)
        })
    })

    it('Validating creating account already created', ()=>{
        let name = faker.internet.userName();
        let email = faker.internet.email();
        let password = faker.internet.password();
        cy.request({
            url: 'https://api.realworld.io/api/users/',
            method: 'POST',
            body: {
                "user":{
                    "username":name,
                    "email": email,
                    "password": password
                }
            }
        }).then(response =>{
            expect(response.status).to.eq(200)
        })

        cy.visit('/register')
        cy.get('input[name=username]').type(name)
        cy.get('input[name=email]').type(email)
        cy.get('input[name=password]').type(password)
        cy.contains('button','Sign up').click()
        cy.get('.error-messages').contains('email has already been taken').should('be.visible')
        cy.get('.error-messages').contains('username has already been taken').should('be.visible')
    })
    

})