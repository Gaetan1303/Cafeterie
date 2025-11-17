<template>
  <div class="auth-container">
    <h2>Inscription</h2>
    <form @submit.prevent="register">
  <input v-model="firstName" type="text" placeholder="Prénom" required pattern=".{2,30}" />
  <input v-model="lastName" type="text" placeholder="Nom" required pattern=".{2,30}" />
      <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
      <input v-model="password" type="password" placeholder="Mot de passe (min 8 caractères)" required minlength="8" autocomplete="new-password" />
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p>Déjà un compte ? <a href="#" @click.prevent="$emit('switchMode', 'login')">Connexion</a></p>
  </div>
</template>


<script>
import { apiFetch } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { formSchemas, validateForm } from '../utils/formSchema';

export default {
  name: 'RegisterForm',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '' // Local error handling supprimé
    };
  },
  methods: {
    async register() {
      this.error = '';
      const err = validateForm(formSchemas.register, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      });
      if (err) {
        this.error = err;
        return;
      }
      const userStore = useUserStore();
      try {
        const user = await apiFetch('auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password
          }
        });
        if (user && user.token) {
          userStore.setToken(user.token);
          userStore.setUser(user);
        }
        this.$emit('register');
      } catch (e) {
        // L'erreur est gérée globalement par errorStore/api.js
      }
    }
  }
}
</script>
<style scoped>
.auth-container { max-width: 350px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
input { display: block; width: 100%; margin-bottom: 1rem; padding: 0.5rem; }
button { width: 100%; padding: 0.7rem; background: #2d8cf0; color: #fff; border: none; border-radius: 4px; }
.error { color: #e74c3c; margin-top: 1rem; }
</style>


