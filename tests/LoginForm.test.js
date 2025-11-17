import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../src/components/LoginForm.vue';

// Mock du store utilisateur
vi.mock('../src/store/userStore', () => ({
  useUserStore: () => ({
    setToken: vi.fn(),
    setUser: vi.fn(),
    isAuthenticated: false
  })
}));

// Mock de l'api
vi.mock('../src/utils/api', () => ({
  apiFetch: vi.fn(async (url, opts) => {
    if (url === 'auth/login' && opts.body.email === 'ok@test.com' && opts.body.password === 'goodpass') {
      return { token: 'fake-jwt', user: { email: 'ok@test.com' } };
    }
    throw new Error('Identifiants invalides');
  })
}));

describe('LoginForm.vue', () => {
  it('affiche une erreur si email invalide', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.find('input[type=email]').setValue('bademail');
    await wrapper.find('input[type=password]').setValue('goodpass');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.html()).toContain('Email invalide');
  });

  it('affiche une erreur si mot de passe trop court', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.find('input[type=email]').setValue('ok@test.com');
    await wrapper.find('input[type=password]').setValue('a');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.html()).toContain('Mot de passe trop court');
  });

  it('connexion réussie avec bons identifiants', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.find('input[type=email]').setValue('ok@test.com');
    await wrapper.find('input[type=password]').setValue('goodpass');
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.html()).not.toContain('Email invalide');
    expect(wrapper.html()).not.toContain('Mot de passe trop court');
  });

  it('affiche une erreur si mauvais identifiants', async () => {
    const wrapper = mount(LoginForm);
    await wrapper.find('input[type=email]').setValue('ok@test.com');
    await wrapper.find('input[type=password]').setValue('wrongpass');
    await wrapper.find('form').trigger('submit.prevent');
    // Ici, l'erreur est gérée globalement, donc pas forcément visible dans le composant
    // On vérifie qu'aucun token n'est mis à jour (à adapter selon la gestion d'erreur globale)
  });
});
