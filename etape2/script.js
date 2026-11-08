"use strict"; // Mode strict : première instruction du fichier (vu dans le slide __)

// Fonction qui insère une ligne dans le tableau (vu dans le slide __)
function doInsertRowTable(num, nom, prenom, points) {
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
    col2.innerText = nom;
    col3.innerText = prenom;
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
