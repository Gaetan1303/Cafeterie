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
import { sanitizeInput } from '../utils/sanitize';
import { formSchemas, validateForm } from '../utils/formSchema';
import { useUserStore } from '../store/userStore';
import { useToastStore } from '../store/toastStore';
import { getProfile, updateProfile } from '../utils/api';

const userStore = useUserStore();
const toastStore = useToastStore();
const profile = ref(null);
const editMode = ref(false);
const form = ref({ firstName: '', lastName: '', email: '' });
const error = ref('');
const success = ref(false);

onMounted(async () => {
  try {
    const data = await getProfile(userStore.token);
    profile.value = data;
    form.value = { ...data };
  } catch (e) {
    error.value = 'Erreur lors de la récupération du profil.';
  }
});

async function saveProfile() {
  error.value = '';
  success.value = false;
  const err = validateForm(formSchemas.register, {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    password: 'dummyPassword' // non utilisé ici
  });
  if (err) {
    error.value = err;
    toastStore.showToast(error.value, 'error');
    return;
  }
  try {
    // Sanitize les champs texte
    const safeForm = {
      firstName: sanitizeInput(form.value.firstName),
      lastName: sanitizeInput(form.value.lastName),
      email: form.value.email // email non modifiable
    };
    await updateProfile(safeForm, userStore.token);
    profile.value = { ...safeForm };
    success.value = true;
    toastStore.showToast('Profil mis à jour !', 'success');
    editMode.value = false;
  } catch (e) {
    error.value = 'Erreur lors de la mise à jour.';
    toastStore.showToast(error.value, 'error');
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
