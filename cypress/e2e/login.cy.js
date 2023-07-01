/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
describe('Home Page',()=>{

    let userData;

    beforeEach(()=>{
        cy.visit('/')
        cy.fixture('userFormData').then(ud =>{
            userData = ud
        })
    })
    
    context('Login scenarios',()=>{
        it('User must login from Sign in button', ()=>{
            cy.get('.navbar li a[href="/login"]').click()
            cy.login(userData.email,userData.password)
        })

        it('User must login from the feed link button', ()=>{
            cy.contains('a','Sign in to see your Feed').click()
            cy.login(userData.email,userData.password)
        })

        it('Login using the API',()=>{
            cy.request({
                url: 'https://api.realworld.io/api/users/login/',
                method: 'POST',
                body: {
                    "user":{
                        "email": "als.arruda@gmail.com",
                        "password": "test123!"
                    }
                }
            }).then(response =>{
                expect(response.status).to.eq(200)
            })
        })

        it('Validating required fields', ()=>{
            cy.visit('/login')
            cy.isRequiredField('input[name="email"]')
            cy.isRequiredField('input[name="password"]')
        })

    })
    context('Logout scenario',()=>{
        it('User must be able to logout',()=>{
            cy.visit('/login')
            cy.login(userData.email,userData.password)
            cy.get('a[href="/settings"]').click()
            cy.contains('button','Or click here to logout.').click()
            cy.url({timeout: 60000}).should('eq','http://localhost:5173/login')
        })
    })
    context('Invalid Login scenario',()=>{
        it('User is not allowed to login with invalid credentials',()=>{
            cy.visit('/login')
            cy.get('input[name=email]').type(faker.internet.email())
            cy.get('input[name=password]').type(faker.internet.password())
            cy.contains('button','Sign in').click()
            cy.get('div h1').should('have.text','Something went wrong')
        })
    })
    context('Validating Need an account? scenario',()=>{
        it('User must be redirected to create an account page from the login page',()=>{
            cy.visit('/login')
            cy.contains('a','Need an account?').click()
            cy.url({timeout: 60000}).should('eq','http://localhost:5173/register')
        })
        
    })

    
})