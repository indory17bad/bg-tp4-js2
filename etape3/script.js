"use strict"; // Strict mode: first statement of the file  _slide 51

// Array of "persons" objects: each object has a Name, a firstName, and points  _slide 40
const persons = [
    { Name: "Name-1", firstName: "firstName-1", points: 5 },
    { Name: "Name-2", firstName: "firstName-2", points: 10 },
    { Name: "Name-3", firstName: "firstName-3", points: 15 }
];

// Counter for the number of inserted rows, initialized to 0  _slide 37/51
let lignes = 0;

// Function that inserts a row into the table  _slide 45
function doInsertRowTable(num, Name, firstName, points) {
    // Retrieve the table element using its ID  _slide 61
    const table = document.getElementById("table_persons");

    // Create an element of type tr (table row)  _slide 86 
    const row = document.createElement("tr");

    // Assign the value "row" to the "class" attribute using setAttribute  _slide 106
    row.setAttribute("class", "row");

    // Create 5 elements of type td (table columns)  _slide 86
    const col1 = document.createElement("td");
    const col2 = document.createElement("td");
    const col3 = document.createElement("td");
    const col4 = document.createElement("td");
    const col5 = document.createElement("td");

    // Fill the content of each column with the parameters using innerText  _slide 90
    col1.innerText = num;
    col2.innerText = Name;
    col3.innerText = firstName;
    col4.innerText = points;

    // The last column contains an input element of type checkbox  _slide92
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    col5.append(checkbox);

    // Assign the corresponding classes to each column  _slide 106
    col1.setAttribute("class", "col_number");
    col2.setAttribute("class", "col_text");
    col3.setAttribute("class", "col_text");
    col4.setAttribute("class", "col_number");
    col5.setAttribute("class", "col_chkbox");

    // Add the columns to the row using the append() method _slide 97 
    row.append(col1, col2, col3, col4, col5);

    // Add the row to the table  _slide 97
    table.append(row);
}

// Inserts a person: increments the lignes counter and uses it as the row number  _slide 45
function doInsert(Name, firstName, points) {
    lignes++; // Increment the counter  _slide 41
    doInsertRowTable(lignes, Name, firstName, points);
}

// Iterates through the persons array and inserts each person into the HTML table  _slide 45
function init() {
    // for..of loop to iterate through the objects in persons _slide 44
    for (const person of persons) {
        doInsert(person.Name, person.firstName, person.points);
    }
}

// Displays the contents of the persons array in the console _slide 33
function consoleTableau() {
    console.log(persons);
}

// Calls init() when the script loads _slide 45
init();
