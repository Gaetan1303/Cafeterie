// Test unitaire Vitest pour vérifier la connexion réelle à l'API Cafeterie-Back
// Ce test tente une vraie requête HTTP sur l'API distante (remplace les credentials par un compte de test valide)

import { describe, it, expect } from 'vitest'
import { apiFetch } from '../../src/utils/api'

describe('Connexion réelle à Cafeterie-Back', () => {
  it('doit échouer avec de mauvais identifiants', async () => {
    await expect(apiFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fakeuser@example.com', password: 'wrongpass' })
    })).rejects.toThrow()
  })


})
