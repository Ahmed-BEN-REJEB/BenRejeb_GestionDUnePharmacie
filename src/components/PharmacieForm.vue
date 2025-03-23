<template>
  <div class="form-container">
    <input v-model="denomination" placeholder="Nom du médicament" class="input-field" />
    <input v-model="formepharmaceutique" placeholder="Forme" class="input-field" />
    <input v-model.number="qte" type="number" placeholder="Quantité" class="input-field" />
    
    <!-- Nouveau champ pour l'upload de fichier -->
    <div class="image-upload">
      <input id="photo" @change="handleFileUpload" type="file" accept="image/*" class="input-field" />
      <img v-if="photo" :src="photo" alt="Aperçu" class="preview-image" />
    </div>

    <button @click="ajouterMedicament" class="btn btn-primary">Ajouter</button>
    <button @click="$emit('fermerForm')" class="btn btn-cancel">Annuler</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { defineEmits } from "vue";

let denomination = ref("");
let formepharmaceutique = ref("");
let qte = ref(1);
let photo = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    photo.value = reader.result;
  };
  reader.readAsDataURL(file);
};

// Remplacer la création statique de medicament par une fonction
const ajouterMedicament = () => {
  const medicament = {
    denomination: denomination.value,
    formepharmaceutique: formepharmaceutique.value,
    qte: qte.value,
    photo: photo.value || '', // Utiliser une chaîne vide si pas de photo
  };
  emit('ajouterMedicament', medicament);
};

// Définir l'émetteur d'événements
const emit = defineEmits(['ajouterMedicament', 'fermerForm']);
</script>

<style scoped>
.form-container {
    width: 35%;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: auto;
    margin-bottom: 40px;
}
.input-field {
    width: 90%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease-in-out;
}
.input-field:focus {
    border-color: #28a745;
    outline: none;
}
.btn {
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background 0.3s, transform 0.2s;
}
.btn:hover {
    transform: translateY(-2px);
}
.btn-primary {
    background-color: #28a745;
    color: white;
}
.btn-primary:hover {
    background-color: #218838;
}
.btn-cancel {
    background-color: #dc3545;
    color: white;
}
.btn-cancel:hover {
  background-color: #c82333;
}
.preview-image {
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>