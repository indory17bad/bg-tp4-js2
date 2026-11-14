"use strict"; // Strict mode: first statement of the file _slide 51/141

// Array of "persons" objects: each object has a Name, a firstName, and points _slide 40
const persons = [
    { Name: "Name-1",  firstName: " firstName-1", points: 5 },
    { Name: "Name-2",  firstName: " firstName-2", points: 10 },
    { Name: "Name-3",  firstName: " firstName-3", points: 15 }
];

// Counter for the number of inserted rows, initialized to 0 _slide 37/51
let lignes = 0;

// Total points in the table, initialized to 0 _slide 37/51
let total_points = 0;

// Function that inserts a row into the table _slide 45
function doInsertRowTable(num, Name,  firstName, points) {
    // Retrieve the table element using its ID _slide 61
    const table = document.getElementById("table_persons");

    // Create an element of type tr (table row) _slide 86
    const row = document.createElement("tr");

    // Assign the value "row" to the "class" attribute using setAttribute _slide 106
    row.setAttribute("class", "row");

    // Create 5 elements of type td (table columns) _slide 86
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    // Fill the content of each column with the parameters using innerText _slide 90
    col1.innerText = num;
    col2.innerText = Name;
    col3.innerText =  firstName;
    col4.innerText = points;

    // The last column contains an input element of type checkbox _slide 92
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    col5.append(checkbox);

    // Assign the corresponding classes to each column _slide 106
    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    // Add the columns to the row using the append() method _slide 97
    row.append(col1, col2, col3, col4, col5);

    // Add the row to the table _slide 97
    table.append(row);
}

// Inserts a person, updates the counters, and then updates the summary _slide 45
function doInsert(Name,  firstName, points) {
    lignes++; // One more row
    total_points += points; // Add the points to the total _slide 41
    doInsertRowTable(lignes, Name,  firstName, points);
    update_summary(); // Update the summary section _slide 45
}

// Iterates through the persons array and inserts each person into the HTML table _slide 45
function init() {
    // for..of loop to iterate through the objects in persons _slide 44
    for (const person of persons) {
        doInsert(person.Name, person. firstName, person.points);
    }
}

// Displays the contents of the persons array in the console _slide 33
function consoleTableau() {
    console.log(persons);
}

// Updates the summary section: number of rows, average (feature 3), and total _slide 45
function update_summary() {
    // Retrieve elements p1, p2, and p3 using their IDs _slide 61
    const element_lignes = document.getElementById("p1");
    const element_moyenne = document.getElementById("p2");
    const element_points = document.getElementById("p3");

    // Modify their content using innerText _slide 90
    element_lignes.innerText = lignes + " row(s)";
    element_points.innerText = "Total point(s)= " + total_points;

    // Additional feature No. 3: average points (if condition) _slide 42/37
    if (lignes > 0) {
        element_moyenne.innerText = "Average= " + (total_points / lignes).toFixed(1);
    } else {
        element_moyenne.innerText = "";
    }
}

// Reads the form, validates the input, and inserts the data into the HTML table and persons array _slide 45
function doNewData() {
    // Retrieve the input fields using their IDs _slide 61
    const elt_Name = document.getElementById("form_Name");
    const elt_ firstName = document.getElementById("form_ firstName");
    const elt_points = document.getElementById("form_points");

    // Access the value attribute of each input field _slide 92
    const Name = elt_Name.value;
    const  firstName = elt_ firstName.value;
    // parseInt converts the entered text into an integer _slide 37
    const points = parseInt(elt_points.value);

    // Input validation: no field must be empty (Number.isNaN checks the points value) _slide 41/42
    if (Name === "" ||  firstName === "" || Number.isNaN(points)) {
        alert("Incomplete form!");
        return; // Stop here: do not add anything _slide 45
    }

    // Insert into the HTML table using doInsert _slide 45
    doInsert(Name,  firstName, points);

    // Insert into the persons array using push() _slide 38
    persons.push({ Name: Name,  firstName:  firstName, points: points });

    // Clear the input fields for a new entry _slide 92
    elt_Name.value = "";
    elt_ firstName.value = "";
    elt_points.value = "";
}

// Deletes the rows whose checkboxes are checked _slide 45
function deleteRow() {
    // Step 1: if the table is empty, display a message and exit the function _slide 42/116
    if (lignes === 0) {
        alert("The table is empty!");
        return;
    }

    // Step 2: retrieve the table and the checked checkboxes (inside .col_chkbox) _slide 76/77
    const table = document.getElementById("table_persons");
    const cochees = table.querySelectorAll("td.col_chkbox input:checked");

    // Step 3: no checkbox is checked -> display a message and exit _slide 42/116
    if (cochees.length === 0) {
        alert("Select at least one row!");
        return;
    }

    // Step 4: ask for confirmation; exit if the user cancels _slide 116/42
    if (!confirm("Delete " + cochees.length + " row(s)?")) {
        return;
    }

    // Step 5: retrieve all the rows in the table (row 0 is the header) _slide 76/77
    const rows = table.querySelectorAll("tr");

    // Step 6: iterate through the rows from bottom to top so that the indices
    // remain consistent with the persons array (row i <-> persons[i - 1]) _slide 44/82/38
    for (let i = rows.length - 1; i >= 1; i--) {
        const row = rows[i];
        const checkbox = row.querySelector("td.col_chkbox input");
        if (checkbox.checked) {
            const points = parseInt(row.cells[3].innerText); // value of the 4th cell _slide 88
            total_points -= points; // subtract the points _slide 41
            lignes--; // decrement the counter _slide 41
            row.remove(); // remove the row from the DOM _slide 100
            persons.splice(i - 1, 1); // remove the corresponding entry from persons _slide 38
        }
    }

    // Renumber the remaining rows to keep the No. column consistent _slide 44
    const restantes = table.querySelectorAll("tr");
    for (let i = 1; i < restantes.length; i++) {
        restantes[i].cells[0].innerText = i;
    }

    // Step 7: display a success message and update the summary _slide 116/45
    alert("Deletion completed successfully.");
    update_summary();
}

// Additional feature No. 1: "Select All" checkbox in the header _slide 92/44
function toggleAll(source) {
    const cases = document.querySelectorAll("td.col_chkbox input");
    for (const c of cases) {
        c.checked = source.checked;
    }
}

// Additional feature No. 2: sort the table by points (ascending/descending) _slide 47/38
let ordre_croissant = true;
function sortByPoints() {
    // Sort the persons array using sort() and a comparison function _slide 47/38
    persons.sort(function (a, b) {
        return ordre_croissant ? a.points - b.points : b.points - a.points;
    });
    ordre_croissant = !ordre_croissant;

    // Clear the HTML table (except the header) and rebuild it from persons _slide 44/100
    const table = document.getElementById("table_persons");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    lignes = 0;
    total_points = 0;
    update_summary();
    init();
}

// Calls init() when the script loads _slide 45
init();