import { Before } from "cypress-cucumber-preprocessor/steps";

export const username = 'AutomationTestUser'
const closeVFSSession = 'sqlcmd -U vsw4@vsw4 -S vsw4sql.database.windows.net -P Salesware01 -d VFS2TEST2 -Q "update vfstrns.usr_cre_user set token = null where username =  \''  + username + '\';"'


Before(() => { 
    // Caching session when logging in via page visit
    cy.session(username, () => {
    cy.exec(closeVFSSession) 
    cy.visit('/')
    cy.get('[data-qa-id=input]').type(username)
    cy.get('[data-qa-id=button]').contains('Siguiente').click()
    cy.get('[type=password]').type('Vincle.2020')
    cy.get('[data-qa-id=button]').contains('Iniciar sesión').click()
    cy.url({ timeout: 60000 }).should('contain', '/home')
  })



})

