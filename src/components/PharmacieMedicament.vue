<template>
    <div>
        <div class="medicament-item">
            <div class="medicament-info denomination">
                {{ medicament.denomination }}
            </div>
            <div class="medicament-info forme">
                {{ medicament.formepharmaceutique }}
            </div>
            <div class="medicament-info qte">
                {{ medicament.qte }}
            </div>
            <div class="medicament-info">
                <img :src="getImageUrl()" 
                     alt="Image du médicament" 
                     class="medicament-img"/>
            </div>
            <div class="medicament-actions">
                <button @click="$emit('supprimer', medicament.id)" class="btn btn-delete">Supprimer</button>
                <button @click="toggleModifierForm" class="btn btn-edit">Modifier</button>
                <button @click="$emit('incrementer', medicament.id)" class="btn btn-increment">+1</button>
                <button @click="$emit('decrementer', medicament.id)" class="btn btn-decrement">-1</button>
            </div>
        </div>
        <PharmacieModifierForm 
            v-if="showModifierForm" 
            :medicament="medicament"
            @modifier-medicament="handleModification"
            @fermer-form="showModifierForm = false"
        />
    </div>
</template>
  
<script setup>
import { defineProps, defineEmits } from 'vue';
import { ref } from 'vue';
import PharmacieModifierForm from './PharmacieModifierForm.vue';

const props = defineProps({
    medicament: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['supprimer', 'incrementer', 'decrementer', 'modifier']);

const showModifierForm = ref(false);

const toggleModifierForm = () => {
    showModifierForm.value = !showModifierForm.value;
};

const handleModification = (medicamentModifie) => {
    emit('modifier', medicamentModifie);
    showModifierForm.value = false;
};

// L'url de base de l'API
const baseUrl = "https://apipharmacie.pecatte.fr/api/6/medicaments";

// Fonction pour construire l'URL de l'image
function getImageUrl() {
    if (!props.medicament.photo) return ''; // Retoune une chaîne vide si pas de photo
    // Vérifier si la photo a déjà une URL absolue
    if (props.medicament.photo.startsWith('http')) {
        return props.medicament.photo;
    }
    // Construire l'URL absolue de l'image
    return `${baseUrl}/${props.medicament.id}/photo`;
}
</script>
  
<style scoped>
    .medicament-item {
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
        align-items: center;
        gap: 15px;
        padding: 12px;
        border-radius: 10px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease-in-out;
    }
    .medicament-item:hover {
        transform: scale(1.02);
        background: #f1f1f1;
    }
    .medicament-info {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        text-align: center;
    }
    .medicament-info.denomination:hover, .medicament-info.forme:hover, .medicament-info.qte:hover {
        color: rgb(83, 83, 83);
        font-weight: bold;
    }
    .medicament-img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #ccc;
        background: white;
        padding: 5px;
    }
    .medicament-actions {
        display: inline-block ;
        justify-content: right;
    }
    .medicament-info{
        border-left: solid 1px #ccc;
    }
    .medicament-info:nth-of-type(4){
        border-right: solid 1px #ccc;
    }
    .btn {
        padding: 6px 10px;
        margin: 3px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        transition: background 0.3s, transform 0.2s;
    }
    .btn:hover {
        transform: translateY(-2px);
    }
    .btn-delete {
        background-color: #c82333;
        color: white;
    }
    .btn-delete:hover {
        background-color: rgba(220, 53, 70, 0.5);
    }
    .btn-edit {
        background-color: #e06b0bc0;
        color: white;
    }
    .btn-edit:hover {
        background-color: rgba(253, 126, 23, 0.5);
    }
    .btn-increment, .btn-decrement {
        color: white;
        background-color: gainsboro;
    }
    .btn-increment:hover, .btn-decrement:hover {
        background-color: #b9b9b9;
    }

</style>