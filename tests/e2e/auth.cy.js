// Test end-to-end Cypress : inscription et connexion
// Place ce fichier dans tests/e2e/ et lance Cypress pour exécuter ce test

describe('Inscription et connexion', () => {
  const random = Math.floor(Math.random() * 100000)
  const email = `testuser${random}@example.com`
  const password = 'Test1234!'
  const firstName = 'Test'
  const lastName = 'User'

  it('Inscription d\'un nouvel utilisateur', () => {
    cy.visit('/auth')
    cy.contains('Inscription').click()
    cy.get('input[placeholder="Prénom"]').type(firstName)
    cy.get('input[placeholder="Nom"]').type(lastName)
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder*="Mot de passe"]').type(password)
    cy.contains("S'inscrire").click()
    cy.contains('Inscription réussie').should('exist')
  })

  it('Connexion avec le nouvel utilisateur', () => {
    cy.visit('/auth')
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('input[placeholder="Mot de passe"]').type(password)
    cy.contains('Se connecter').click()
    cy.url().should('include', '/dashboard')
    cy.window().then(win => {
      expect(win.localStorage.getItem('token')).to.exist
    })
  })
})
