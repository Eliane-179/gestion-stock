// 1. Récupérer les éléments de la page
const formulaire = document.getElementById("formulaire");
const champNom = document.getElementById("nom");
const champQuantite = document.getElementById("quantite");
const champSeuil = document.getElementById("seuil");
const zoneErreur = document.getElementById("erreur");
const liste = document.getElementById("liste");
const messageVide = document.getElementById("vide");
const resume = document.getElementById("resume");

// 2. Charger les produits déjà enregistrés (ou une liste vide)
let produits = JSON.parse(localStorage.getItem("produits")) || [];

// 3. Enregistrer la liste dans le navigateur
function sauvegarder() {
localStorage.setItem("produits", JSON.stringify(produits));
}

// 4. Créer un bouton avec un texte, une classe CSS et une action
function creerBouton(texte, classe, action) {
const bouton = document.createElement("button");
bouton.textContent = texte;
bouton.className = classe;
bouton.addEventListener("click", action);
return bouton;
}

// 5. Afficher tous les produits dans le tableau
function afficher() {
liste.innerHTML = "";
let nombreAlertes = 0;

produits.forEach(function (produit, index) {
const ligne = document.createElement("tr");

// Stock bas : la ligne passe en rouge
if (produit.quantite <= produit.seuil) {
ligne.classList.add("alerte");
nombreAlertes++;
}

const celluleNom = document.createElement("td");
celluleNom.textContent = produit.nom;

const celluleQuantite = document.createElement("td");
celluleQuantite.textContent = produit.quantite;

const celluleSeuil = document.createElement("td");
celluleSeuil.textContent = produit.seuil;

const celluleActions = document.createElement("td");
celluleActions.appendChild(creerBouton("+1", "plus", function () {
modifierQuantite(index, 1);
}));
celluleActions.appendChild(creerBouton("−1", "moins", function () {
modifierQuantite(index, -1);
}));
celluleActions.appendChild(creerBouton("Supprimer", "supprimer", function () {
supprimerProduit(index);
}));

ligne.appendChild(celluleNom);
ligne.appendChild(celluleQuantite);
ligne.appendChild(celluleSeuil);
ligne.appendChild(celluleActions);
liste.appendChild(ligne);
});

// Message si la liste est vide + résumé
if (produits.length === 0) {
messageVide.style.display = "block";
resume.textContent = "";
} else {
messageVide.style.display = "none";
resume.textContent = produits.length + " produit(s), dont " + nombreAlertes + " en stock bas.";
}
}

// 6. Ajouter ou retirer une unité (jamais en dessous de 0)
function modifierQuantite(index, valeur) {
const nouvelleQuantite = produits[index].quantite + valeur;
if (nouvelleQuantite < 0) {
return;
}
produits[index].quantite = nouvelleQuantite;
sauvegarder();
afficher();
}

// 7. Supprimer un produit après confirmation
function supprimerProduit(index) {
const confirmation = confirm("Supprimer « " + produits[index].nom + " » ?");
if (confirmation) {
produits.splice(index, 1);
sauvegarder();
afficher();
}
}

// 8. Quand on envoie le formulaire
formulaire.addEventListener("submit", function (evenement) {
evenement.preventDefault(); // empêche la page de se recharger

const nom = champNom.value.trim();
const quantite = Number(champQuantite.value);
const seuil = Number(champSeuil.value);

// Vérifications
if (nom === "") {
zoneErreur.textContent = "Indiquez le nom du produit.";
return;
}
if (champQuantite.value === "" || !Number.isInteger(quantite) || quantite < 0) {
zoneErreur.textContent = "La quantité doit être un nombre entier positif.";
return;
}
if (champSeuil.value === "" || !Number.isInteger(seuil) || seuil < 0) {
zoneErreur.textContent = "Le seuil doit être un nombre entier positif.";
return;
}

// Tout est bon : on ajoute le produit
zoneErreur.textContent = "";
produits.push({ nom: nom, quantite: quantite, seuil: seuil });
sauvegarder();
afficher();

formulaire.reset();
champNom.focus();
});

// 9. Afficher la liste au chargement de la page
afficher();
