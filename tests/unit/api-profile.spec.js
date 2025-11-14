// Test Vitest pour la récupération et la mise à jour du profil utilisateur

import { describe, it, expect } from 'vitest'
import { apiFetch } from '../../src/utils/api'

describe('Profil utilisateur (Billy)', () => {
  let token = ''
  const email = 'billy@cafeterie.com'
  const password = 'BillyTest123!'
  const firstName = 'Billy'
  const lastName = 'Test'

  it('Créer le compte Billy', async () => {
    const res = await apiFetch('auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    })
    expect(res).toHaveProperty('message', 'Inscription réussie')
  })

  it('Connexion pour obtenir un token', async () => {
    const res = await apiFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    expect(res).toHaveProperty('token')
    token = res.token
  })

  it('Récupérer le profil', async () => {
    const user = await apiFetch('profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    expect(user).toHaveProperty('email', email)
    expect(user).toHaveProperty('firstName', firstName)
  })

  it('Mettre à jour le profil', async () => {
    const newFirstName = 'BillyModif'
    const res = await apiFetch('profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ firstName: newFirstName, lastName })
    })
    expect(res).toHaveProperty('message')
  })
})
