<template>
  <div class="profile-container">
    <h2>Mon profil</h2>
    <div v-if="profile">
      <p><b>Nom :</b> {{ profile.lastName }}</p>
      <p><b>Prénom :</b> {{ profile.firstName }}</p>
      <p><b>Email :</b> {{ profile.email }}</p>
      <button @click="editMode = !editMode">Modifier</button>
      <form v-if="editMode" @submit.prevent="saveProfile">
        <input v-model="form.firstName" placeholder="Prénom" />
        <input v-model="form.lastName" placeholder="Nom" />
        <input v-model="form.email" placeholder="Email" disabled />
        <button type="submit">Enregistrer</button>
      </form>
      <p v-if="success" class="success">Profil mis à jour !</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <div v-else>Chargement...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProfile, updateProfile } from '../utils/api';
import { useStore } from '../store';

const store = useStore();
const profile = ref(null);
const editMode = ref(false);
const form = ref({ firstName: '', lastName: '', email: '' });
const error = ref('');
const success = ref(false);

onMounted(async () => {
  try {
    const data = await getProfile(store.token);
    profile.value = data;
    form.value = { ...data };
  } catch (e) {
    error.value = 'Erreur lors de la récupération du profil.';
  }
});

async function saveProfile() {
  error.value = '';
  success.value = false;
  try {
    await updateProfile(form.value, store.token);
    profile.value = { ...form.value };
    success.value = true;
    editMode.value = false;
  } catch (e) {
    error.value = 'Erreur lors de la mise à jour.';
  }
}
</script>

<style scoped>
.profile-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px #0001; }
label { display: block; margin-top: 1rem; }
input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; }
button { width: 100%; padding: 0.7rem; background: #2d8cf0; color: #fff; border: none; border-radius: 4px; }
.success { color: #27ae60; margin-top: 1rem; }
.error { color: #e74c3c; margin-top: 1rem; }
</style>
