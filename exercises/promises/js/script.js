/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint node: true */
'use strict';

function append_div(all_numbers, main_div, text_div, number_div) {

    main_div.appendChild(number_div);
    main_div.appendChild(text_div);
    all_numbers.appendChild(main_div);
}

function show_number(num, all_numbers, text) {
    let main_div = document.createElement('div');
    main_div.setAttribute("class", "row")

    let number_div = document.createElement('div');
    number_div.setAttribute("class", "col-5 fs-1")

    let text_div = document.createElement('div');
    text_div.setAttribute("class", "alert alert-primary col-6")

    number_div.innerHTML = `${num}`
    text_div.innerHTML = `${text}`
    append_div(all_numbers, main_div, text_div, number_div)
}

async function get_individual(num, all_numbers) {
    all_numbers.innerHTML = ""
    for (let number = num - 1; number < num + 2; number++) {
        let data = await fetch(`http://numbersapi.com/${number}`).then((response) => response.text()).then((text) => { show_number(number, all_numbers, text) })
    }
}

async function get_batch(num, all_numbers) {

    all_numbers.innerHTML = ""

    Promise.all([
        fetch(`http://numbersapi.com/${num - 1}`),
        fetch(`http://numbersapi.com/${num}`),
        fetch(`http://numbersapi.com/${num + 1}`),
    ]).then(function (responses) {
        return Promise.all(responses.map(response => response.text()));
    }).then(function (data) {
        let counter = -1;
        for (let text of data) {
            show_number(num + counter, all_numbers, text);
            counter += 1;
        }
    })
}

async function clickedon() {
    let num = parseInt(document.querySelector('#number').value);
    let all_numbers = document.querySelector('#number_info');
    if (document.querySelector('#batch').checked) {
        get_batch(num, all_numbers);
    } else {
        get_individual(num, all_numbers);
    }
}