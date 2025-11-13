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
      // Simuler la sauvegarde du user (à remplacer par store/API)
      localStorage.setItem('user', JSON.stringify(user))
      this.$router.push('/dashboard')
    },
    onRegister(user) {
      // Simuler l'inscription (à remplacer par API)
      alert('Inscription réussie ! Connectez-vous.')
      this.mode = 'login'
    }
  }
}
</script>
