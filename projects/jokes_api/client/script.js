'use strict';

var BASE_URL = "https://Nipun007.pythonanywhere.com/api/v1/jokes/";

const LANGUAGE_NAMES = {
    'cs': 'Czech',
    'de': 'German',
    'en': 'English',
    'es': 'Spanish',
    'eu': 'Basque',
    'fr': 'French',
    'gl': 'Galician',
    'hu': 'Hungarian',
    'it': 'Italian',
    'lt': 'Lithuanian',
    'pl': 'Polish',
    'sv': 'Swedish'
};

function populate_select(element, list_to_populate_with) {
    for (let item of list_to_populate_with) {
        let option_element = document.createElement('option');
        option_element.setAttribute("value", item);
        option_element.innerText = LANGUAGE_NAMES[item] || item;
        element.append(option_element);
    }
}

function disable_enable_id_element(element) {
    const jokeId = document.querySelector("#jokeId");
    if (element.value == 1) {
        jokeId.disabled = false;
    } else {
        jokeId.disabled = true;
        jokeId.value = "";
    }
}

function handle_id_click() {
    const numberSelect = document.querySelector("#selNum");
    const jokeId = document.querySelector("#jokeId");

    if (!jokeId.matches(':focus')) {
        numberSelect.value = "1";
        jokeId.disabled = false;
    }
}

function fetch_jokes() {
    let category_value = document.querySelector("#selCat").value;
    let lang_value = document.querySelector("#selLang").value;
    let number_value = document.querySelector("#selNum").value;
    let id_value = document.querySelector("#jokeId").value;

    if (number_value === 'all') {
        number_value = 999;
    }

    if (id_value === "") {
        get_and_display_data(category_value, lang_value, number_value);
    } else {
        get_and_display_data(category_value, lang_value, 1, id_value);
    }
}

async function get_and_display_data(category_value, lang_value, number_value, id_value = null) {
    var joke_div = document.querySelector("#jokes");
    joke_div.innerHTML = "";

    let fetch_url;
    if (id_value === null) {
        fetch_url = BASE_URL + `${lang_value}/${category_value}/${number_value}`;
    } else {
        fetch_url = BASE_URL + `${lang_value}/${category_value}/1/${id_value}`;
    }

    try {
        const response = await fetch(fetch_url);
        const data = await response.json();

        if (!response.ok) {
            let article = document.createElement("article");
            article.setAttribute("class", "notification is-danger");
            article.innerText = data.error || response.statusText;
            joke_div.append(article);
            return;
        }

        // Handle both array and single joke responses
        let jokes_to_display = [];
        if (Array.isArray(data.jokes)) {
            jokes_to_display = data.jokes;
        } else if (typeof data.jokes === 'string') {
            jokes_to_display = [data.jokes];
        } else {
            let article = document.createElement("article");
            article.setAttribute("class", "notification is-warning");
            article.innerText = "No kidding!";
            joke_div.append(article);
            return;
        }

        if (jokes_to_display.length === 0) {
            let article = document.createElement("article");
            article.setAttribute("class", "notification is-warning");
            article.innerText = "No kidding!";
            joke_div.append(article);
            return;
        }

        // Array of Bulma colors to cycle through
        const colors = ['is-primary', 'is-link', 'is-info', 'is-success', 'is-warning'];

        jokes_to_display.forEach((joke, index) => {
            let article = document.createElement("article");
            // Cycle through colors
            const colorClass = colors[index % colors.length];
            article.setAttribute("class", `notification ${colorClass} mb-4`);

            // Create delete button
            let deleteButton = document.createElement("button");
            deleteButton.className = "delete";
            deleteButton.onclick = function () {
                article.remove();
            };

            // Create joke content div
            let jokeContent = document.createElement("div");
            jokeContent.className = "content";
            jokeContent.innerText = joke;

            // Add delete button and content to article
            article.appendChild(deleteButton);
            article.appendChild(jokeContent);

            joke_div.append(article);
        });
    } catch (error) {
        let article = document.createElement("article");
        article.setAttribute("class", "notification is-danger");
        article.innerText = error.message || "ERROR fetching data";
        joke_div.append(article);
    }
}

window.onload = function () {
    populate_select(document.querySelector("#selLang"),
        ['cs', 'de', 'en', 'es', 'eu', 'fr', 'gl', 'hu', 'it', 'lt', 'pl', 'sv']);
    populate_select(document.querySelector("#selCat"), ['neutral', 'chuck', 'all']);

    const numberSelect = document.querySelector("#selNum");
    const jokeId = document.querySelector("#jokeId");

    numberSelect.addEventListener("change", (e) => { disable_enable_id_element(e.target) });
    jokeId.addEventListener("focus", handle_id_click);

    numberSelect.value = "1";
    jokeId.disabled = false;
}


