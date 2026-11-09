"use strict"; // Mode strict : première instruction du fichier (vu dans le slide __)

// Tableau d'objets "persons" : chaque objet a un Name, un préName et des points (vu dans le slide __)
const persons = [
    { Name: "Name-1", preName: "preName-1", points: 5 },
    { Name: "Name-2", preName: "preName-2", points: 10 },
    { Name: "Name-3", preName: "preName-3", points: 15 }
];

// Compteur du nombre de lignes insérées, initialisé à 0 (vu dans le slide __)
let lignes = 0;

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

// Insère une personne : incrémente le compteur lignes et l'utilise comme numéro (vu dans le slide __)
function doInsert(Name, preName, points) {
    lignes++; // Incrémentation du compteur (vu dans le slide __)
    doInsertRowTable(lignes, Name, preName, points);
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

// Appel de init() au chargement du script (vu dans le slide __)
init();
