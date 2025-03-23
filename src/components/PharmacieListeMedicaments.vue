<template>
  <div class="container">
      <div class="header">
          <input v-model="searchQuery" id="filtreMedic" placeholder="🔍 Rechercher un médicament" class="search-bar" />
          <button @click="afficherForm = true" class="btn btn-add">Ajouter un médicament</button>
      </div>
    <PharmacieForm v-if="afficherForm" @fermerForm="afficherForm = false" @ajouterMedicament="ajouterMedicament" />
    
    <div v-if="existenceMedicaments" class="medicament-header"> 
      <div class="medicament-info-title">Nom</div>
      <div class="medicament-info-title">Forme Pharmaceutique</div>
      <div class="medicament-info-title">Quantité</div>
      <div class="medicament-info-title">Image</div>
      <div class="medicament-actions">Actions</div>
    </div>
    <div v-else class="medicamentsInexistants">Pas de médicaments</div>

    <div v-for="medicament in medicamentsFiltres" :key="medicament.id" class="medicament-list">
      <PharmacieMedicament 
          :medicament="medicament" 
          @supprimer="supprimerMedicament" 
          @incrementer="incrementerQte" 
          @decrementer="decrementerQte"
          @modifier="modifierMedicament"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { Medicament } from "../Medicament";

import PharmacieMedicament from "./PharmacieMedicament.vue";
import PharmacieForm from "./PharmacieForm.vue";

let listeMedicaments = reactive([]);
let afficherForm = ref(false);
let searchQuery = ref("");

// L'url de l'API pour récupérer les médicaments de la pharmacie
const url = "https://apipharmacie.pecatte.fr/api/6/medicaments";

// Fonction permettant de récupérer les médicaments de la pharmacie
async function getMedicaments() {
const fetchOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};
try {
  const response = await fetch(url, fetchOptions);
  const dataJSON = await response.json();
  listeMedicaments.splice(0, listeMedicaments.length);
  dataJSON.forEach((data) => {
    listeMedicaments.push(new Medicament(data.id, data.denomination, data.formepharmaceutique, data.photo, data.qte));
  });
  console.log("Médicaments récupérés avec succès", listeMedicaments);
  console.log("Il y a " + listeMedicaments.length + " médicaments dans la pharmacie");
} catch (error) {
  console.error("Erreur lors de la récupération des médicaments", error);
}
}

// Fonction permettant d'ajouter un médicament à la liste
function ajouterMedicament(data) {
  const fetchOptions = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
          denomination: data.denomination,
          formepharmaceutique: data.formepharmaceutique,
          photo: data.photo,
          qte: data.qte,
      }),
  };
  fetch(url, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Médicament ajouté avec succès", data);
      getMedicaments();
  })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du médicament", error);
    });

  afficherForm.value = false;
}

// Fonction permettant de supprimer un médicament de la liste
function supprimerMedicament(id) {
  const fetchOptions = {
      method: "DELETE",
      headers: {
      "Content-Type": "application/json",
      },
  };
  fetch(url + "/" + id, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("Médicament supprimé avec succès", data);
      getMedicaments();
  })
    .catch((error) => {
      console.error("Erreur lors de la suppression du médicament", error);
    });

}

// Fonction permettant d'incrémenter de 1 la quantité d'un médicament
async function incrementerQte(id) {
try {
  // Récupérer le médicament actuel
  const response = await fetch(`${url}/${id}`);
  const medicament = await response.json();
  // Préparer les données à mettre à jour
  const updatedData = {
    id: medicament.id,
    denomination: medicament.denomination,
    formepharmaceutique: medicament.formepharmaceutique,
    photo: medicament.photo,
    qte: medicament.qte + 1
  };
  // Envoyer la mise à jour
  const updateResponse = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  }); 
  if (!updateResponse.ok) {
    throw new Error('Erreur lors de la mise à jour');
  }
  // Rafraîchir la liste
  await getMedicaments();
} catch (error) {
  console.error("Erreur lors de l'incrémentation:", error);
}
}

// Fonction permettant de décrémenter de 1 la quantité d'un médicament
async function decrementerQte(id) {
try {
  // Récupérer le médicament actuel
  const response = await fetch(`${url}/${id}`);
  const medicament = await response.json();
  // Vérifier si la quantité est déjà à 0
  if (medicament.qte <= 0) {
    console.warn("La quantité est déjà à 0");
    return;
  }
  // Préparer les données à mettre à jour
  const updatedData = {
    id: medicament.id,
    denomination: medicament.denomination,
    formepharmaceutique: medicament.formepharmaceutique,
    photo: medicament.photo,
    qte: medicament.qte - 1
  };
  // Envoyer la mise à jour
  const updateResponse = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  });
  if (!updateResponse.ok) {
    throw new Error('Erreur lors de la mise à jour');
  }
  // Rafraîchir la liste
  await getMedicaments();
} catch (error) {
  console.error("Erreur lors de la décrémentation:", error);
}
}

// Ajouter cette propriété calculée pour le filtrage
const medicamentsFiltres = computed(() => {
if (!searchQuery.value) {
  return listeMedicaments;
}
return listeMedicaments.filter(medicament => 
  medicament.denomination.toLowerCase().includes(searchQuery.value.toLowerCase())
);
});

// Modifier la propriété calculée existenceMedicaments pour utiliser medicamentsFiltres
const existenceMedicaments = computed(() => {
return medicamentsFiltres.value.length > 0;
});

// Add new function for modification
async function modifierMedicament(medicamentModifie) {
  const fetchOptions = {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(medicamentModifie),
  };
  
  try {
      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      console.log("Médicament modifié avec succès", data);
      await getMedicaments();
  } catch (error) {
      console.error("Erreur lors de la modification du médicament", error);
  }
}

onMounted(() => {
getMedicaments();
});
</script>

<style scoped>
.container {width: 75%; margin: auto; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);}
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;}
.search-bar { width: 60%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; transition: border-color 0.3s ease-in-out;}
.search-bar:focus { border-color: #007bff; outline: none;}
.btn { padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: background 0.3s, transform 0.2s;}
.btn:hover { transform: translateY(-2px);}
.btn-add { background-color: #007bff; color: white;}
.btn-add:hover { background-color: #0056b3;}
.medicament-header { display: grid; grid-template-columns: 2fr 2fr 1fr 2fr 2fr; gap: 15px; align-items: center; padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 7px; margin-top: 50px;}
.medicament-info-title, .medicament-actions {font-size: 16px; font-weight: bold; color: #333; text-align: center;}
.medicamentsInexistants { font-size: 19px; font-weight: 500; color: #333; text-align: center; margin-top: 50px;}
.medicament-list  {display: flex; flex-direction: column; gap: 10px; margin-top: 20px;}
</style>