"use strict"; // Strict mode: first statement of the file 

// Function that inserts a row into the table
function doInsertRowTable(num, Name, firstName, points) {
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
    col3.innerText = firstName;
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
