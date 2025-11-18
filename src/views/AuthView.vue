<template>
  <div>
    <LoginForm v-if="mode === 'login'" @login="onLogin" @switchMode="mode = $event" />
    <RegisterForm v-else @register="onRegister" @switchMode="mode = $event" />
  </div>
</template>

<script>

import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import { useUserStore } from '../store/userStore';
import '../views/CSS/coffee-shop.css';

export default {
  name: 'AuthView',
  components: { LoginForm, RegisterForm },
  data() {
    return {
      mode: 'login'
    }
  },
  methods: {
    onLogin() {
      // Après login, router vers dashboard
      this.$router.push('/dashboard');
    },
    onRegister() {
      // Message de succès : à remplacer par notification plus tard
      this.mode = 'login';
    },
  }
}
</script>
