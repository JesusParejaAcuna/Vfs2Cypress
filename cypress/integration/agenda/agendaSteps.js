
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { username } from '../commons/before_after'

import AgendaPage from '../../support/PageObjects/AgendaPage'

const agendaPage = new AgendaPage();



beforeEach(() => {
    agendaPage.resetDB()
}
)

When('go to the agenda page', () => {
    // No hago nada de momento
})

Then('the username is displayed in the agenda', () => {
//    cy.get('.usr-label').contains(username).should('be.visible')
    
//    agendaPage.getUserName(username).should('be.visible')
agendaPage.the_username_is_displayed_in_the_agenda ()
})

Given('The agenda page is displayed', () => {
    agendaPage.visitAgenda()
    agendaPage.getAgendaTitle().should('be.visible')
})

When('the username {string} is queried', (username) => {

    const nameAndSurname = username.split(" ");
    cy.contains("Cambiar usuario", { timeout: 6000 }).click()
    // Entramos en la selección de usuarios
    cy.get('vfs-user-list-overlay')
        .within(() => {
            cy.get('[placeholder=Buscar]').type(username)
        })
    cy.get('[data-qa-id=table-row]', { timeout: 60000 }).should('have.length', 1) // Nos aseguramos de que solo hay un usuario
    cy.get('[role=gridcell]').contains(nameAndSurname[0]).should('be.visible')
    cy.get('[role=gridcell]').contains(nameAndSurname[1]).click()
    cy.contains('Aceptar').click({ timeout: 6000 })
    //salimos de la selección de usuarios
    cy.contains(username).should('be.visible')

})

And('a visit is added {string} for today', (customername) => {

    //   cy.pause()
    cy.contains("Programar actividad").click()
    cy.get('[data-qa-id=select]').click()
    cy.contains('Visita Preventa').click()
    cy.get('[data-qa-id=icon]').click()

    // Entramos en la selección de clientes
    cy.get('vfs-customer-list-overlay')
        .within(() => {
            cy.get('[placeholder=Buscar]').type(customername)
        })
    cy.get('[data-qa-id=table-row]', { timeout: 60000 }).should('have.length', 1) // Nos aseguramos de que solo hay un cliente
    cy.get('[role=gridcell]').contains(customername).click()
    cy.contains('Aceptar').click()
    //salimos de la selección de clientes

    cy.get('vfs-action-bar')
        .within(() => {
            cy.contains('Aceptar').click()
        })

})

Then('can see the {string} visit in the list of the today', (customername) => {
    cy.contains(customername).should('be.visible')
})


