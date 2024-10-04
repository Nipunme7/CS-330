/* jshint esversion: 8 */
/* jshint browser: true */
'use strict';

var outputScreen;
var clearOnEntry;


/**
 * Display a digit on the `outputScreen`
 * 
 * @param {number} digit digit to add or display on the `outputScreen`
 */
function enterDigit(digit) {
    let d_element = document.querySelector("#result");
    if (d_element.innerText == '0') { d_element.innerText = '' }
    d_element.innerText += digit
}


/**
 * Clear `outputScreen` and set value to 0
 */
function clear_screen() {
    let d_element = document.querySelector("#result");
    d_element.innerText = 0
}


/**
 * Evaluate the expression and display its result or *ERROR*
 */
function eval_expr() {
    let d_element = document.querySelector("#result")
    let result;
    try {
        result = eval(d_element.innerText);
    }
    catch {
        result = "ERROR"
    }

    d_element.innerText = result;
}


/**
 * Display an operation on the `outputScreen`
 * 
 * @param {string} operation to add to the expression
 */
function enterOp(operation) {
    let d_element = document.querySelector("#result");
    d_element.innerText += operation
}


window.onload = function () {
    outputScreen = document.querySelector("#result");
    clearOnEntry = true;
};
