import { username } from "../../integration/commons/before_after"


class AgendaPage {

    // Estas son las tablas que se resetearan con las pruebas de agenda
    // se deben separar con espacios




    visitAgenda() {
        cy.visit("/agenda", { timeout: 10000 })
    }

    getUserName(usernam) {
        return cy.get('.usr-label').contains(username)
    }

    getAgendaTitle() {
        return cy.get('.vfs-title-label').contains('Agenda')
    }

    resetDB() {
        const agendaTables = 'AGD_Activity'

        const resetDbAgenda = 'sqlcmd -U vsw4@vsw4 -S vsw4sql.database.windows.net -P Salesware01 -d VFS2TEST2 -Q "exec vfstrns.ResetDb ' + username + ',\''  + agendaTables + '\';"'
    

        cy.exec(resetDbAgenda)
    }


the_username_is_displayed_in_the_agenda ()  {
    getUserName(username).should('be.visible')
}



}
export default AgendaPage
