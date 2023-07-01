/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
describe('User must be able to add a new Article',()=>{

    let userData;
    let title
    beforeEach(()=>{
        cy.visit('/login')
        cy.fixture('userFormData').then(ud =>{
            userData = ud
            title = faker.lorem.sentence(2);
        })
    })
    it('User must add a new article',()=>{
        cy.login(userData.email,userData.password)
        cy.get('a[href="/editor"]').click()
        cy.get('input[name="title"]').type(title,{delay: 0})
        cy.get('input[name="description"]').type(faker.lorem.paragraphs(),{delay: 0})
        cy.get('textarea[name="body"]').type(faker.lorem.paragraphs(1),{delay: 0})
        cy.get('input[placeholder="Enter tags"]').type(faker.lorem.word(),{delay: 0})
        cy.contains('button','Publish Article').click()
        cy.get('h1',{timeout: 6000}).should('have.text',title)
        
    })
})