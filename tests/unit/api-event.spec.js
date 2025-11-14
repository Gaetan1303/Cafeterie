// Test Vitest pour la récupération des événements (nécessite un token utilisateur)
import { describe, it, expect } from 'vitest'
import { apiFetch } from '../../src/utils/api'

describe('Événements', () => {
  let token = ''
  const email = 'billy@cafeterie.com'
  const password = 'BillyTest123!'

  it('Connexion pour obtenir un token', async () => {
    const res = await apiFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    expect(res).toHaveProperty('token')
    token = res.token
  })

  it('Récupérer la liste des événements', async () => {
    const events = await apiFetch('event', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    expect(Array.isArray(events)).toBe(true)
  })
})
