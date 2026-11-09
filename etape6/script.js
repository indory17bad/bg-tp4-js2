"use strict"; // Mode strict : première instruction du fichier (vu dans le slide __)

// Tableau d'objets "persons" : chaque objet a un Name, un préName et des points (vu dans le slide __)
const persons = [
    { Name: "Name-1", preName: "preName-1", points: 5 },
    { Name: "Name-2", preName: "preName-2", points: 10 },
    { Name: "Name-3", preName: "preName-3", points: 15 }
];

// Compteur du Namebre de lignes insérées, initialisé à 0 (vu dans le slide __)
let lignes = 0;

// Total des points du tableau, initialisé à 0 (vu dans le slide __)
let total_points = 0;

// Fonction qui insère une ligne dans le tableau (vu dans le slide __)
function doInsertRowTable(num, Name, preName, points) {
    // Récupérer l'élément tableau grâce à son identifiant (vu dans le slide __)
    const table = document.getElementById("table_persons");

    // Créer un élément de type tr (ligne de tableau) (vu dans le slide __)
    const row = document.createElement("tr");

    // Affecter la valeur "row" à l'attribut "class" avec setAttribute (vu dans le slide __)
    row.setAttribute("class", "row");

    // Créer 5 éléments de type td (colonnes du tableau) (vu dans le slide __)
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    // Remplir le contenu de chaque colonne avec les paramètres, via innerText (vu dans le slide __)
    col1.innerText = num;
    col2.innerText = Name;
    col3.innerText = preName;
    col4.innerText = points;

    // La dernière colonne contient un élément input de type checkbox (vu dans le slide __)
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    col5.append(checkbox);

    // Affecter les classes correspondantes à chaque colonne (vu dans le slide __)
    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    // Rajouter les colonnes à la ligne avec la méthode append() (vu dans le slide __)
    row.append(col1, col2, col3, col4, col5);

    // Rajouter la ligne au tableau (vu dans le slide __)
    table.append(row);
}

// Insère une personne, met à jour les compteurs puis le résumé (vu dans le slide __)
function doInsert(Name, preName, points) {
    lignes++; // Une ligne de plus (vu dans le slide __)
    total_points += points; // Ajout des points au total (vu dans le slide __)
    doInsertRowTable(lignes, Name, preName, points);
    update_summary(); // Mise à jour de l'espace résumé (vu dans le slide __)
}

// Parcourt le tableau persons et insère chaque personne dans le tableau HTML (vu dans le slide __)
function init() {
    // Boucle for..of pour parcourir les objets de persons (vu dans le slide __)
    for (const person of persons) {
        doInsert(person.Name, person.preName, person.points);
    }
}

// Affiche le contenu du tableau persons dans la console (vu dans le slide __)
function consoleTableau() {
    console.log(persons);
}

// Met à jour l'espace résumé : Namebre de lignes, moyenne (fonctionnalité 3) et total (vu dans le slide __)
function update_summary() {
    // Récupérer les éléments p1, p2 et p3 par leur identifiant (vu dans le slide __)
    const element_lignes = document.getElementById("p1");
    const element_moyenne = document.getElementById("p2");
    const element_points = document.getElementById("p3");

    // Modifier leur contenu avec innerText (vu dans le slide __)
    element_lignes.innerText = lignes + " ligne(s)";
    element_points.innerText = "Total point(s)= " + total_points;

    // Fonctionnalité supplémentaire n°3 : moyenne des points (condition if) (vu dans le slide __)
    if (lignes > 0) {
        element_moyenne.innerText = "Moyenne= " + (total_points / lignes).toFixed(1);
    } else {
        element_moyenne.innerText = "";
    }
}

// Lit le formulaire, contrôle la saisie, insère dans le tableau HTML et dans persons (vu dans le slide __)
function doNewData() {
    // Récupérer les champs de saisie par leur identifiant (vu dans le slide __)
    const elt_Name = document.getElementById("form_Name");
    const elt_preName = document.getElementById("form_preName");
    const elt_points = document.getElementById("form_points");

    // Accéder à l'attribut value de chaque champ (vu dans le slide __)
    const Name = elt_Name.value;
    const preName = elt_preName.value;
    // parseInt convertit le texte saisi en entier (vu dans le slide __)
    const points = parseInt(elt_points.value);

    // Saisie contrôlée : aucun champ ne doit être vide (Number.isNaN pour les points) (vu dans le slide __)
    if (Name === "" || preName === "" || Number.isNaN(points)) {
        alert("Formulaire incomplet !");
        return; // On arrête ici : pas d'ajout (vu dans le slide __)
    }

    // Insertion dans le tableau HTML via doInsert (vu dans le slide __)
    doInsert(Name, preName, points);

    // Insertion dans le tableau persons avec push() (vu dans le slide __)
    persons.push({ Name: Name, preName: preName, points: points });

    // Vider les champs de saisie pour une nouvelle saisie (vu dans le slide __)
    elt_Name.value = "";
    elt_preName.value = "";
    elt_points.value = "";
}

// Supprime les lignes dont la case est cochée (vu dans le slide __)
function deleteRow() {
    // Étape 1 : si le tableau est vide, message et sortie de la fonction (vu dans le slide __)
    if (lignes === 0) {
        alert("Le tableau est vide !");
        return;
    }

    // Étape 2 : récupérer le tableau et les checkbox cochées (dans .col_chkbox) (vu dans le slide __)
    const table = document.getElementById("table_persons");
    const cochees = table.querySelectorAll("td.col_chkbox input:checked");

    // Étape 3 : aucune case cochée -> message et sortie (vu dans le slide __)
    if (cochees.length === 0) {
        alert("Sélectionnez au moins une ligne !");
        return;
    }

    // Étape 4 : demander une confirmation, quitter si l'utilisateur annule (vu dans le slide __)
    if (!confirm("Supprimer " + cochees.length + " ligne(s) ?")) {
        return;
    }

    // Étape 5 : récupérer toutes les lignes du tableau (la ligne 0 est l'en-tête) (vu dans le slide __)
    const rows = table.querySelectorAll("tr");

    // Étape 6 : parcourir les lignes de la fin vers le début, pour que les indices
    // restent cohérents avec le tableau persons (ligne i <-> persons[i - 1]) (vu dans le slide __)
    for (let i = rows.length - 1; i >= 1; i--) {
        const row = rows[i];
        const checkbox = row.querySelector("td.col_chkbox input");
        if (checkbox.checked) {
            const points = parseInt(row.cells[3].innerText); // valeur de la 4e cellule (vu dans le slide __)
            total_points -= points; // soustraire les points (vu dans le slide __)
            lignes--; // décrémenter le compteur (vu dans le slide __)
            row.remove(); // supprimer la ligne du DOM (vu dans le slide __)
            persons.splice(i - 1, 1); // supprimer l'entrée correspondante de persons (vu dans le slide __)
        }
    }

    // Renumérotation des lignes restantes pour garder la colonne N° cohérente (vu dans le slide __)
    const restantes = table.querySelectorAll("tr");
    for (let i = 1; i < restantes.length; i++) {
        restantes[i].cells[0].innerText = i;
    }

    // Étape 7 : message de succès et mise à jour du résumé (vu dans le slide __)
    alert("Suppression effectuée.");
    update_summary();
}

// Fonctionnalité supplémentaire n°1 : case "tout sélectionner" dans l'en-tête (vu dans le slide __)
function toggleAll(source) {
    const cases = document.querySelectorAll("td.col_chkbox input");
    for (const c of cases) {
        c.checked = source.checked;
    }
}

// Fonctionnalité supplémentaire n°2 : trier le tableau par points (croissant/décroissant) (vu dans le slide __)
let ordre_croissant = true;
function sortByPoints() {
    // Tri du tableau persons avec sort() et une fonction de comparaison (vu dans le slide __)
    persons.sort(function (a, b) {
        return ordre_croissant ? a.points - b.points : b.points - a.points;
    });
    ordre_croissant = !ordre_croissant;

    // Vider le tableau HTML (sauf l'en-tête) puis le reconstruire depuis persons (vu dans le slide __)
    const table = document.getElementById("table_persons");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    lignes = 0;
    total_points = 0;
    update_summary();
    init();
}

// Appel de init() au chargement du script (vu dans le slide __)
init();
