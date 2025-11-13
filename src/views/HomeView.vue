
<template>
  <div>
    <h2>Accueil</h2>
    <p>Bienvenue sur l'application de la cafétéria !</p>
    <HelloComponent />
  </div>
</template>

<script>
import HelloComponent from '../components/HelloComponent.vue';

export default {
  name: 'HomeView',
  components: {
    HelloComponent,
  },
};
</script>
