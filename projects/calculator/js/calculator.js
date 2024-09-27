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
    let display_element = document.querySelector("#result");
    if (display_element.innerText == '0') { display_element.innerText = '' }
    display_element.innerText += digit
}


/**
 * Clear `outputScreen` and set value to 0
 */
function clear_screen() {
    let display_element = document.querySelector("#result");
    display_element.innerText = 0
}


/**
 * Evaluate the expression and display its result or *ERROR*
 */
function eval_expr() {
    let display_element = document.querySelector("#result")
    let result;
    try {
        result = eval(display_element.innerText);
    }
    catch {
        result = "ERROR"
    }

    display_element.innerText = result;
}


/**
 * Display an operation on the `outputScreen`
 * 
 * @param {string} operation to add to the expression
 */
function enterOp(operation) {
    let display_element = document.querySelector("#result");
    display_element.innerText += operation
}


window.onload = function () {
    outputScreen = document.querySelector("#result");
    clearOnEntry = true;
};
