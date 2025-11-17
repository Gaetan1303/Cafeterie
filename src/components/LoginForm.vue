<template>
  <div class="auth-container">
    <h2>Connexion</h2>
    <form @submit.prevent="login">
  <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
  <input v-model="password" type="password" placeholder="Mot de passe" required autocomplete="current-password" />
      <button type="submit">Se connecter</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>Pas de compte ? <a href="#" @click.prevent="$emit('switchMode', 'register')">Inscription</a></p>
  </div>
</template>


<script>
import { apiFetch } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { formSchemas, validateForm } from '../utils/formSchema';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
       error: '' // Local error handling removed
    }
  },
  methods: {
    async login() {
      this.error = '';
      const err = validateForm(formSchemas.login, {
        email: this.email,
        password: this.password
      });
      if (err) {
        this.error = err;
        return;
      }
      const userStore = useUserStore();
      try {
        const user = await apiFetch('auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            email: this.email,
            password: this.password
          }
        })
        userStore.setToken(user.token);
        userStore.setUser(user);
        this.$emit('login');
      } catch (e) {
         // L'erreur est gérée globalement par errorStore/api.js
      }
    }
  }
}
</script>
