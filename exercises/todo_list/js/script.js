/* jshint esversion: 8 */
/* jshint browser: true */
"use strict;";

var team = ["Aardvark", "Beaver", "Cheetah", "Dolphin", "Elephant", "Flamingo", "Giraffe", "Hippo"];
var priority = ["Low", "Normal", "Important", "Critical"];
var id = 0;

function C_alert() {
    let element = document.querySelector("#feedbackMessage");
    element.innerHTML = "";
    element.removeAttribute("class");
}

function U_alert(message) {
    let element = document.querySelector("#feedbackMessage");
    element.innerHTML = ""
    element.setAttribute("class", "alert alert-danger")
    element.innerHTML += message
}


/**
 * Add a new task to the list
 * 
 * Validate form, collect input values, and add call `addRow` to add a new row to the table
 */
function addTask() {
    let vals = [];
    let rowcolids = ["title", "assignedTo", "priority", "dueDate"];

    C_alert();
    if (document.querySelector("#title").value == '' || document.querySelector("#dueDate").value == '') {
        U_alert('Fill out title and due date');
    } else {
        for (let item of rowcolids) {
            vals.push(document.querySelector(`#${item}`).value)
        }
        addRow(vals, document.getElementById("taskList"));
    }
}

/**
 * Add a new row to the table
 * 
 * @param {string[]} valueList list of task attributes
 * @param {Object} parent DOM node to append to
 */
function addRow(valueList, parent) {

    let row = document.createElement("tr");
    let td = document.createElement("td");
    let cb = document.createElement("input");
    let priority_color = {
        "Low": "table-primary",
        "Important": "table-secondary",
        "Critical": "table-dark",
        "Normal": "table-light"
    }

    cb.setAttribute("value", id);
    cb.setAttribute("type", "checkbox");
    cb.setAttribute("onclick", `removeRow('row${id}')`);
    row.setAttribute("id", `row${id}`);
    td.append(cb);
    id += 1;
    row.append(td);

    for (item of valueList) {
        let td = document.createElement("td");
        td.innerText = item
        row.append(td)
    }

    row.setAttribute("class", `${valueList[2].toLowerCase()} ${priority_color[valueList[2]]}`)
    let tbody = parent.querySelector("tbody");
    tbody.appendChild(row);
}

/**
 * Remove a table row corresponding to the selected checkbox
 * 
 * https://stackoverflow.com/questions/26512386/remove-current-row-tr-when-checkbox-is-checked
 */
function removeRow(rowId) {

    let tr = document.querySelector(`#${rowId}`);
    tr.remove();
}

/**
 * Remove all table rows
 * 
 */
function selectAll() {
    let tbody_element = document.querySelector("tbody");
    let list_of_tr_elements = tbody_element.querySelectorAll("tr");
    for (tr_element of list_of_tr_elements) {
        removeRow(tr_element.id);
    }
}

/**
 * Add options to the specified element
 * 
 * @param {string} selectId `select` element to populate
 * @param {string[]} sList array of options
 */
function populateSelect(selectId, sList) {

    let sel = document.getElementById(selectId, sList);
    for (let item of sList) {
        sel.innerHTML += `<option value="${item}">${item}</option>`;
    }

}

window.onload = function () {
    populateSelect("assignedTo", team);
    populateSelect("priority", priority);
};