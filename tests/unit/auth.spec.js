// Test unitaire Vitest pour la logique d'authentification
// Place ce fichier dans tests/unit/ et lance Vitest pour exécuter ce test

import { describe, it, expect, vi } from 'vitest'
import { apiFetch } from '@/utils/api'

vi.mock('@/utils/api', () => ({
  apiFetch: vi.fn()
}))

describe('Authentification', () => {
  it('login - succès', async () => {
    const fakeUser = { token: 'abc123', email: 'test@example.com' }
    apiFetch.mockResolvedValueOnce(fakeUser)
    const result = await apiFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'Test1234!' })
    })
    expect(result).toEqual(fakeUser)
    expect(apiFetch).toHaveBeenCalledWith('auth/login', expect.any(Object))
  })

  it('login - erreur', async () => {
    apiFetch.mockRejectedValueOnce(new Error('Erreur API : 401'))
    await expect(apiFetch('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fail@example.com', password: 'wrong' })
    })).rejects.toThrow('Erreur API : 401')
  })
})
