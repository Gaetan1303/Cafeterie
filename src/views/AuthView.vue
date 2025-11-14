<template>
  <div>
    <LoginForm v-if="mode === 'login'" @login="onLogin" @switchMode="mode = $event" />
    <RegisterForm v-else @register="onRegister" @switchMode="mode = $event" />
  </div>
</template>

<script>

import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'

export default {
  name: 'AuthView',
  components: { LoginForm, RegisterForm },
  data() {
    return {
      mode: 'login'
    }
  },
  methods: {
    onLogin(user) {
      // Si le back renvoie un token, le stocker
      if (user && user.token) {
        localStorage.setItem('token', user.token)
      }
      localStorage.setItem('user', JSON.stringify(user))
      this.$router.push('/dashboard')
    },
    onRegister() {
      // Afficher un message de succès après inscription
      alert('Inscription réussie ! Connectez-vous.')
      this.mode = 'login'
    }
  }
}
</script>
