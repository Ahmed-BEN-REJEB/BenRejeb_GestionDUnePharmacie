<template>
    <div class="form-container">
      <input v-model="denomination" :placeholder="medicament.denomination" class="input-field" />
      <input v-model="formepharmaceutique" :placeholder="medicament.formepharmaceutique" class="input-field" />
      <input v-model.number="qte" type="number" :placeholder="medicament.qte" class="input-field" />
      
      <button @click="modifierMedicament" class="btn btn-primary">Modifier</button>
      <button @click="$emit('fermerForm')" class="btn btn-cancel">Annuler</button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    medicament: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['modifierMedicament', 'fermerForm']);

let denomination = ref("");
let formepharmaceutique = ref("");
let qte = ref(null);

const modifierMedicament = () => {
    const medicamentModifie = {
        id: props.medicament.id,
        denomination: denomination.value || props.medicament.denomination,
        formepharmaceutique: formepharmaceutique.value || props.medicament.formepharmaceutique,
        qte: qte.value !== null ? qte.value : props.medicament.qte,
        photo: props.medicament.photo
    };
    emit('modifierMedicament', medicamentModifie);
};
</script>

<style scoped>
    .form-container {
        width: 50%;
        background: rgba(0,0,0,0.15);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 40px;
        justify-self: center;
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
</style>
