"use strict"; // Strict mode: first statement of the file

// Array of "persons" objects: each object has a Name, a firstName, and points
const persons = [
    { Name: "Name-1",  firstName: " firstName-1", points: 5 },
    { Name: "Name-2",  firstName: " firstName-2", points: 10 },
    { Name: "Name-3",  firstName: " firstName-3", points: 15 }
];

// Counter for the number of inserted rows, initialized to 0
let lignes = 0;

// Total points in the table, initialized to 0
let total_points = 0;

// Function that inserts a row into the table
function doInsertRowTable(num, Name,  firstName, points) {
    // Retrieve the table element using its ID
    const table = document.getElementById("table_persons");

    // Create an element of type tr (table row)
    const row = document.createElement("tr");

    // Assign the value "row" to the "class" attribute using setAttribute
    row.setAttribute("class", "row");

    // Create 5 elements of type td (table columns)
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    // Fill the content of each column with the parameters using innerText
    col1.innerText = num;
    col2.innerText = Name;
    col3.innerText =  firstName;
    col4.innerText = points;

    // The last column contains an input element of type checkbox
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    col5.append(checkbox);

    // Assign the corresponding classes to each column
    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    // Add the columns to the row using the append() method
    row.append(col1, col2, col3, col4, col5);

    // Add the row to the table
    table.append(row);
}

// Inserts a person, updates the counters, and then updates the summary
function doInsert(Name,  firstName, points) {
    lignes++; // One more row
    total_points += points; // Add the points to the total
    doInsertRowTable(lignes, Name,  firstName, points);
    update_summary(); // Update the summary section
}

// Iterates through the persons array and inserts each person into the HTML table
function init() {
    // for..of loop to iterate through the objects in persons
    for (const person of persons) {
        doInsert(person.Name, person. firstName, person.points);
    }
}

// Displays the contents of the persons array in the console
function consoleTableau() {
    console.log(persons);
}

// Updates the summary section: number of rows, average (feature 3), and total
function update_summary() {
    // Retrieve elements p1, p2, and p3 using their IDs
    const element_lignes = document.getElementById("p1");
    const element_moyenne = document.getElementById("p2");
    const element_points = document.getElementById("p3");

    // Modify their content using innerText
    element_lignes.innerText = lignes + " row(s)";
    element_points.innerText = "Total point(s)= " + total_points;

    // Additional feature No. 3: average points (if condition)
    if (lignes > 0) {
        element_moyenne.innerText = "Average= " + (total_points / lignes).toFixed(1);
    } else {
        element_moyenne.innerText = "";
    }
}

// Reads the form, validates the input, and inserts the data into the HTML table and persons array
function doNewData() {
    // Retrieve the input fields using their IDs
    const elt_Name = document.getElementById("form_Name");
    const elt_ firstName = document.getElementById("form_ firstName");
    const elt_points = document.getElementById("form_points");

    // Access the value attribute of each input field
    const Name = elt_Name.value;
    const  firstName = elt_ firstName.value;
    // parseInt converts the entered text into an integer
    const points = parseInt(elt_points.value);

    // Input validation: no field must be empty (Number.isNaN checks the points value)
    if (Name === "" ||  firstName === "" || Number.isNaN(points)) {
        alert("Incomplete form!");
        return; // Stop here: do not add anything
    }

    // Insert into the HTML table using doInsert
    doInsert(Name,  firstName, points);

    // Insert into the persons array using push()
    persons.push({ Name: Name,  firstName:  firstName, points: points });

    // Clear the input fields for a new entry
    elt_Name.value = "";
    elt_ firstName.value = "";
    elt_points.value = "";
}

// Deletes the rows whose checkboxes are checked
function deleteRow() {
    // Step 1: if the table is empty, display a message and exit the function
    if (lignes === 0) {
        alert("The table is empty!");
        return;
    }

    // Step 2: retrieve the table and the checked checkboxes (inside .col_chkbox)
    const table = document.getElementById("table_persons");
    const cochees = table.querySelectorAll("td.col_chkbox input:checked");

    // Step 3: no checkbox is checked -> display a message and exit
    if (cochees.length === 0) {
        alert("Select at least one row!");
        return;
    }

    // Step 4: ask for confirmation; exit if the user cancels
    if (!confirm("Delete " + cochees.length + " row(s)?")) {
        return;
    }

    // Step 5: retrieve all the rows in the table (row 0 is the header)
    const rows = table.querySelectorAll("tr");

    // Step 6: iterate through the rows from bottom to top so that the indices
    // remain consistent with the persons array (row i <-> persons[i - 1])
    for (let i = rows.length - 1; i >= 1; i--) {
        const row = rows[i];
        const checkbox = row.querySelector("td.col_chkbox input");
        if (checkbox.checked) {
            const points = parseInt(row.cells[3].innerText); // value of the 4th cell
            total_points -= points; // subtract the points
            lignes--; // decrement the counter
            row.remove(); // remove the row from the DOM
            persons.splice(i - 1, 1); // remove the corresponding entry from persons
        }
    }

    // Renumber the remaining rows to keep the No. column consistent
    const restantes = table.querySelectorAll("tr");
    for (let i = 1; i < restantes.length; i++) {
        restantes[i].cells[0].innerText = i;
    }

    // Step 7: display a success message and update the summary
    alert("Deletion completed successfully.");
    update_summary();
}

// Additional feature No. 1: "Select All" checkbox in the header
function toggleAll(source) {
    const cases = document.querySelectorAll("td.col_chkbox input");
    for (const c of cases) {
        c.checked = source.checked;
    }
}

// Additional feature No. 2: sort the table by points (ascending/descending)
let ordre_croissant = true;
function sortByPoints() {
    // Sort the persons array using sort() and a comparison function
    persons.sort(function (a, b) {
        return ordre_croissant ? a.points - b.points : b.points - a.points;
    });
    ordre_croissant = !ordre_croissant;

    // Clear the HTML table (except the header) and rebuild it from persons
    const table = document.getElementById("table_persons");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    lignes = 0;
    total_points = 0;
    update_summary();
    init();
}

// Calls init() when the script loads
init();