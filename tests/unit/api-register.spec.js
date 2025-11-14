// Test Vitest pour l'inscription via l'API Cafeterie-Back
// Génère un utilisateur aléatoire à chaque test

import { describe, it, expect } from 'vitest'
import { apiFetch } from '../../src/utils/api'

describe('Inscription via l\'API Cafeterie-Back', () => {
  it('doit inscrire un nouvel utilisateur', async () => {
    const random = Math.floor(Math.random() * 100000)
    const email = `testuser${random}@example.com`
    const password = 'Test1234!'
    const firstName = 'Test'
    const lastName = 'User'
    const res = await apiFetch('auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      })
    })
    expect(res).toHaveProperty('message', 'Inscription réussie')
  })
})
