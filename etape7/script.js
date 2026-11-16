"use strict";

/* ============================================================
   State
   ============================================================ */
const STORAGE_KEY = "people_manager_v1";

const DEFAULT_PERSONS = [
    { id: 1, lastName: "Name-1", firstName: "firstName-1", points: 5 },
    { id: 2, lastName: "Name-2", firstName: "firstName-2", points: 10 },
    { id: 3, lastName: "Name-3", firstName: "firstName-3", points: 15 }
];

let persons = loadPersons();
let nextId = persons.reduce((max, p) => Math.max(max, p.id), 0) + 1;

let sortKey = null;          // "lastName" | "firstName" | "points" | null
let sortAscending = true;
let searchQuery = "";
let editingId = null;        // id of the row currently being edited
const selectedIds = new Set();

/* ============================================================
   Persistence (localStorage)
   ============================================================ */
function loadPersons() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) return saved;
    } catch (e) { /* ignore corrupted or unavailable storage */ }
    return DEFAULT_PERSONS.map(p => ({ ...p }));
}

function savePersons() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persons));
    } catch (e) { /* storage unavailable: app still works in memory */ }
}

/* ============================================================
   Helpers
   ============================================================ */
const $ = id => document.getElementById(id);

function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (key === "class") node.className = value;
        else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
        else node[key] = value;
    }
    node.append(...children);
    return node;
}

let toastTimer;
function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function fullName(p) {
    return p.firstName + " " + p.lastName;
}

/* Returns the persons to display: filtered by search, then sorted */
function getVisiblePersons() {
    const query = searchQuery.trim().toLowerCase();
    const list = persons.filter(p =>
        (p.firstName + " " + p.lastName).toLowerCase().includes(query)
    );

    if (sortKey) {
        list.sort((a, b) => {
            const result = sortKey === "points"
                ? a.points - b.points
                : a[sortKey].localeCompare(b[sortKey], undefined, { sensitivity: "base" });
            return sortAscending ? result : -result;
        });
    }
    return list;
}

/* ============================================================
   Rendering
   ============================================================ */
function render() {
    const visible = getVisiblePersons();
    const tbody = $("table_body");
    tbody.replaceChildren();

    if (visible.length === 0) {
        const message = persons.length === 0
            ? "No people yet. Add one above!"
            : "No results match your search.";
        tbody.append(el("tr", { class: "empty_row" },
            el("td", { colSpan: 6, textContent: message })));
    }

    const topPoints = persons.length ? Math.max(...persons.map(p => p.points)) : null;

    visible.forEach((p, index) => {
        tbody.append(p.id === editingId
            ? buildEditRow(p, index + 1)
            : buildRow(p, index + 1, p.points === topPoints));
    });

    updateSortArrows();
    updateSelectAll(visible);
    updateSummary();
}

function buildRow(p, number, isTop) {
    const checkbox = el("input", {
        type: "checkbox",
        checked: selectedIds.has(p.id),
        onchange: e => {
            e.target.checked ? selectedIds.add(p.id) : selectedIds.delete(p.id);
            e.target.closest("tr").classList.toggle("selected", e.target.checked);
            updateSelectAll(getVisiblePersons());
        }
    });

    const row = el("tr", { class: (selectedIds.has(p.id) ? "selected " : "") + (isTop ? "top" : "") },
        el("td", { class: "col_number", textContent: number }),
        el("td", { class: "col_text", textContent: p.lastName }),
        el("td", { class: "col_text", textContent: p.firstName }),
        el("td", { class: "col_number", textContent: p.points }),
        el("td", { class: "col_chkbox" }, checkbox),
        el("td", { class: "col_actions" },
            el("div", { class: "actions_cell" },
                el("button", { class: "btn btn-small btn-edit", textContent: "Edit",
                    onclick: () => { editingId = p.id; render(); } }),
                el("button", { class: "btn btn-small btn-row-del", textContent: "Delete",
                    onclick: () => deleteOne(p.id) })
            )));
    return row;
}

function buildEditRow(p, number) {
    const lastName = el("input", { type: "text", value: p.lastName });
    const firstName = el("input", { type: "text", value: p.firstName });
    const points = el("input", { type: "number", value: p.points });

    const save = () => {
        const err = validate(lastName.value, firstName.value, points.value);
        if (err) { showToast(err); return; }
        p.lastName = lastName.value.trim();
        p.firstName = firstName.value.trim();
        p.points = parseInt(points.value, 10);
        editingId = null;
        savePersons();
        render();
        showToast("Changes saved.");
    };
    const cancel = () => { editingId = null; render(); };

    const onKey = e => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cancel();
    };
    [lastName, firstName, points].forEach(i => i.addEventListener("keydown", onKey));
    setTimeout(() => lastName.focus(), 0);

    return el("tr", {},
        el("td", { class: "col_number", textContent: number }),
        el("td", {}, lastName),
        el("td", {}, firstName),
        el("td", {}, points),
        el("td", { class: "col_chkbox" }),
        el("td", { class: "col_actions" },
            el("div", { class: "actions_cell" },
                el("button", { class: "btn btn-small btn-save", textContent: "Save", onclick: save }),
                el("button", { class: "btn btn-small btn-cancel", textContent: "Cancel", onclick: cancel })
            )));
}

function updateSortArrows() {
    document.querySelectorAll("th.sortable").forEach(th => {
        const arrow = th.querySelector(".arrow");
        arrow.textContent = th.dataset.sort === sortKey ? (sortAscending ? "▲" : "▼") : "";
    });
}

function updateSelectAll(visible) {
    const box = $("select_all");
    const count = visible.filter(p => selectedIds.has(p.id)).length;
    box.checked = visible.length > 0 && count === visible.length;
    box.indeterminate = count > 0 && count < visible.length;
}

function updateSummary() {
    const total = persons.reduce((sum, p) => sum + p.points, 0);
    const visibleCount = getVisiblePersons().length;

    $("badge_count").textContent = persons.length + (persons.length === 1 ? " person" : " people");
    $("p1").textContent = visibleCount === persons.length
        ? persons.length
        : visibleCount + " of " + persons.length;
    $("p3").textContent = total;

    if (persons.length === 0) {
        $("p2").textContent = "–";
        $("p4").textContent = "–";
        $("p5").textContent = "–";
        return;
    }

    const best = persons.reduce((a, b) => (b.points > a.points ? b : a));
    const worst = persons.reduce((a, b) => (b.points < a.points ? b : a));
    $("p2").textContent = (total / persons.length).toFixed(1);
    $("p4").textContent = best.points + " (" + fullName(best) + ")";
    $("p5").textContent = worst.points + " (" + fullName(worst) + ")";
}

/* ============================================================
   Actions
   ============================================================ */
function validate(lastName, firstName, pointsText) {
    if (lastName.trim() === "" || firstName.trim() === "" || String(pointsText).trim() === "") {
        return "Please fill in all fields.";
    }
    if (!Number.isInteger(Number(pointsText))) {
        return "Points must be a whole number.";
    }
    return "";
}

function addPerson(event) {
    event.preventDefault();
    const lastName = $("form_lastName");
    const firstName = $("form_firstName");
    const points = $("form_points");

    const error = validate(lastName.value, firstName.value, points.value);
    $("form_error").textContent = error;
    if (error) return;

    persons.push({
        id: nextId++,
        lastName: lastName.value.trim(),
        firstName: firstName.value.trim(),
        points: parseInt(points.value, 10)
    });

    lastName.value = "";
    firstName.value = "";
    points.value = "";
    lastName.focus();

    savePersons();
    render();
    showToast("Person added.");
}

function deleteOne(id) {
    const person = persons.find(p => p.id === id);
    if (!person || !confirm("Delete " + fullName(person) + "?")) return;
    persons = persons.filter(p => p.id !== id);
    selectedIds.delete(id);
    savePersons();
    render();
    showToast("Row deleted.");
}

function deleteSelected() {
    if (persons.length === 0) { showToast("The table is empty."); return; }
    if (selectedIds.size === 0) { showToast("Select at least one row."); return; }
    if (!confirm("Delete " + selectedIds.size + " selected row(s)?")) return;

    persons = persons.filter(p => !selectedIds.has(p.id));
    selectedIds.clear();
    savePersons();
    render();
    showToast("Selected rows deleted.");
}

function clearAll() {
    if (persons.length === 0) { showToast("The table is already empty."); return; }
    if (!confirm("Remove all " + persons.length + " rows? This cannot be undone.")) return;
    persons = [];
    selectedIds.clear();
    savePersons();
    render();
    showToast("Table cleared.");
}

function toggleAll(checked) {
    for (const p of getVisiblePersons()) {
        checked ? selectedIds.add(p.id) : selectedIds.delete(p.id);
    }
    render();
}

function setSort(key) {
    if (sortKey === key) {
        sortAscending = !sortAscending;
    } else {
        sortKey = key;
        sortAscending = true;
    }
    render();
}

function logToConsole() {
    console.table(persons);
    showToast("Table logged to the console.");
}

function exportCsv() {
    const rows = getVisiblePersons();
    if (rows.length === 0) { showToast("Nothing to export."); return; }

    const escape = value => '"' + String(value).replace(/"/g, '""') + '"';
    const lines = [["Last name", "First name", "Points"].map(escape).join(",")];
    rows.forEach(p => lines.push([p.lastName, p.firstName, p.points].map(escape).join(",")));

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = el("a", { href: URL.createObjectURL(blob), download: "people.csv" });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast("Exported " + rows.length + " row(s).");
}

/* ============================================================
   Event wiring
   ============================================================ */
$("form_container").addEventListener("submit", addPerson);
$("search").addEventListener("input", e => { searchQuery = e.target.value; render(); });
$("select_all").addEventListener("change", e => toggleAll(e.target.checked));
$("btn_delete").addEventListener("click", deleteSelected);
$("btn_clear").addEventListener("click", clearAll);
$("btn_export").addEventListener("click", exportCsv);
$("btn_console").addEventListener("click", logToConsole);
document.querySelectorAll("th.sortable").forEach(th =>
    th.addEventListener("click", () => setSort(th.dataset.sort)));

render();