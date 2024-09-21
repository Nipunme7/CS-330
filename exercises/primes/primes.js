/* jshint esversion: 8 */
/* jshint node: true */
/* jshint browser: true */
'use strict';

console.log('hi')
/**
 * Greet user by name
 *
 * @param {string} name visitor's name
 * @param {string} selector element to use for display
 */
function greet(name, selector) {
    console.log(name);

    let greeting = document.querySelector(selector);

    greeting.innerText = `Hello ${name}`;
}


/**
 * Check if a number is prime
 *
 * @param {number} number number to check
 * @return {boolean} result of the check
 */
function isPrime(number) {
    if (number <= 1) return false;
    if (number % 2 == 0 && number > 2) return false;
    const square_root = Math.sqrt(number);
    for (let i = 3; i <= square_root; i += 2) {
        if (number % i === 0) return false;
    }
    return true;
}


/**
 * Print whether a number is prime
 *
 * @param {number} number number to check
 * @param {string} selector element to use for display
 */
function printNumberInfo(number, selector) {
    let prime_message = document.querySelector(selector);
    if (isPrime(number)) {
        prime_message.innerHTML = `${number} is a prime number`;
    } else {
        prime_message.innerHTML = `${number} is not a prime number`;
    }
}


/**
 * Generate an array of prime numbers
 *
 * @param {number} number number of primes to generate
 * @return {number[]} an array of `number` prime numbers
 */
function getNPrimes(number) {
    let list_of_primes = [];
    let current_number = 2;
    while (number > 0) {
        if (isPrime(current_number)) {
            list_of_primes.push(current_number);
            number -= 1
        }
        current_number += 1
    }
    return list_of_primes
}

/**
 * Print a table of prime numbers
 *
 * @param {number} number number of primes to display
 * @param {string} selector element to use for display
 */
function printNPrimes(number, selector) {
    let list_of_primes = getNPrimes(number)
    console.log(list_of_primes)
    let thead = document.querySelector('thead');
    let tbody = document.querySelector('tbody');
    thead.innerHTML += `<tr class="is-danger has-text-centered is-size-4"><td class ='heading'>First <b>${number}</b> primes</td></tr>`
    for (let prime of list_of_primes) {
        tbody.innerHTML += `<tr class="is-success has-text-centered is-size-4"><td>${prime}</td></tr>`
    }
}

/**
 * Display warning about missing URL query parameters
 *
 * @param {Object} urlParams URL parameters
 * @param {string} selector element to use for display
 */
function displayWarnings(urlParams, selector) {
    let warning = document.querySelector(selector);
    if (urlParams.get('number') == null) {
        warning.innerHTML += '<div class="warning number has-text-right has-text-warning"><span class="closebtn" onclick=\'this.parentElement.style.display="none";\'>&times;</span> No numbers were provided.</div>'
    }
    if (urlParams.get('name') == null) {
        warning.innerHTML += '<div class="warning name has-text-right has-text-warning"><span class="closebtn" onclick=\'this.parentElement.style.display="none";\'>&times;</span> No names were provided.</div>'
    }
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    let number = urlParams.get('number');
    if (number == null) {
        number = urlParams.get('n');
    }
    if (number == null) {
        number = 330
    }
    let name = urlParams.get('name');
    if (name == null) {
        name = 'student'
    }
    this.displayWarnings(urlParams, "#warnings");
    greet(name, "#greeting");
    printNumberInfo(number, "#numberInfo");
    printNPrimes(number, "table#nPrimes");
}
