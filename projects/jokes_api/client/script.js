'use strict';

var BASE_URL = "https://Nipun007.pythonanywhere.com/api/v1/jokes/";

function populate_select(element, list_to_populate_with) {
    for (let item of list_to_populate_with) {
        let option_element = document.createElement('option');
        option_element.setAttribute("value", item)
        option_element.innerText = item
        element.append(option_element)
    }
}
function disable_enable_id_element(element) {
    if (element.value == 1) {
        document.querySelector("#joke_id").disabled = false;
    } else {
        document.querySelector("#joke_id").disabled = true;
        document.querySelector("#joke_id").value = "";
    }

}
function fetch_jokes() {
    // give error under certain conditions
    let category_value = document.querySelector("#selCat").value
    let lang_value = document.querySelector("#selLang").value;
    let number_value = document.querySelector("#number").value;
    let id_value = document.querySelector("#joke_id").value;
    if (id_value == "") {
        get_and_display_data(category_value, lang_value, number_value)
    } else {
        get_and_display_data(category_value, lang_value, number_value, id_value)
    }
}

async function get_and_display_data(category_value, lang_value, number_value, id_value = null) {

    var joke_div = document.querySelector("#jokes");
    joke_div.innerHTML = "";
    if (id_value == null) {
        var fetch_url = BASE_URL + `${lang_value}\/${category_value}\/${number_value}`;
    } else {
        var fetch_url = BASE_URL + `${lang_value}\/${category_value}\/${number_value}\/${id_value}`;
    }
    fetch(fetch_url)
        .then((response) => response.json())
        .then((response) => {
            let all_jokes = response.jokes
            for (let joke of all_jokes) {
                let p_element = document.createElement("p");
                p_element.setAttribute("class", "alert alert-primary")
                p_element.innerText = joke
                joke_div.append(p_element);
            }
            if (all_jokes.length == 0) {
                let p_element = document.createElement("p");
                p_element.setAttribute("class", "alert alert-primary")
                p_element.innerText = "No kidding!"
                joke_div.append(p_element);
            }
        })
        .catch((reject) => {
            let p_element = document.createElement("p");
            p_element.setAttribute("class", "alert alert-primary")
            p_element.innerText = "ERROR fetching data"
            joke_div.append(p_element);
        }
        )
}

window.onload = function () {
    populate_select(document.querySelector("#selLang"), ['en', 'es', 'de'])
    populate_select(document.querySelector("#selCat"), ['neutral', 'chuck', 'all'])
    document.querySelector("#number").addEventListener("input", (e) => { disable_enable_id_element(e.target) })
    document.querySelector("#number").value = 1;
}


