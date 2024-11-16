#!/usr/bin/env python3
"""
jokes api
"""
import random
from typing import List, Union
import werkzeug.exceptions
import pyjokes
from flask import Flask, request, abort, Response, jsonify
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

LANGUAGE_NAMES = {
    'eu': 'Basque',
    'fr': 'French',
    'gl': 'Galician',
    'lt': 'Lithuanian',
    'sv': 'Swedish'
}

@app.route("/api/v1/jokes", methods=["GET"])
@app.route("/api/v1/jokes/<string:lang>/<string:category>", methods=["GET"])
@app.route("/api/v1/jokes/<string:lang>/<string:category>/<int:number>", methods=["GET"])
@app.route("/api/v1/jokes/<string:lang>/<string:category>/<int:number>/<int:id>", methods=["GET"])
def api_response(lang="en", category="all", number=1, id=None):
    jokes = None
    
    if request.path == '/api/v1/jokes':
        dict_values = dict(request.args)
        category = dict_values.get('category', 'all')
        lang = dict_values.get("language", 'en')
        number = int(dict_values.get("number", 1))
        id = dict_values.get("id")
        if id is not None:
            id = int(id)

    if lang not in ['cs', 'de', 'en', 'es', 'eu', 'fr', 'gl', 'hu', 'it', 'lt', 'pl', 'sv'] or \
            category not in ['neutral', 'all', 'chuck']:
        abort(404)

    if number != 1 and id is not None:
        abort(404)
        
    try:
        if id is not None:
            return get_the_joke(id)
        else:
            return get_joke(lang, category, number)
    except werkzeug.exceptions.NotFound as e:
        abort(404, description=str(e))

def get_joke(language: str = "en", category: str = "all", number: int = 1) -> Response:
    if category == 'chuck' and language in LANGUAGE_NAMES:
        abort(404, description=f"There are no chuck jokes in {LANGUAGE_NAMES[language]}")

    jokes = {
        'language': language,
        'category': category,
        'jokes': [],
        'number': number
    }

    try:
        all_jokes = pyjokes.get_jokes(language, category)
    except:
        abort(404)

    try:
        if number >= len(all_jokes):
            indexes = range(len(all_jokes))
            jokes['number'] = len(all_jokes)
        else:
            indexes = random.sample(range(len(all_jokes)), k=number)
    except ValueError:
        indexes = range(len(all_jokes))
        jokes['number'] = len(all_jokes)

    for index in indexes:
        jokes['jokes'].append(all_jokes[index])

    response = jsonify(jokes)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

def get_all_jokes(language: str, category: str) -> Response:
    return get_joke(language, category, 999)

def get_n_jokes(language: str, category: str, number: int) -> Response:
    return get_joke(language, category, number)

def get_the_joke(joke_id: int) -> Response:
    MAX_JOKE_ID = 952
    
    if joke_id < 0 or joke_id > MAX_JOKE_ID:
        abort(404, description=f"Joke {joke_id} not found, try an id between 0 and {MAX_JOKE_ID}")
    
    all_jokes = []
    current_index = 0
    
    for lang in ['cs', 'de', 'en', 'es', 'eu', 'fr', 'gl', 'hu', 'it', 'lt', 'pl', 'sv']:
        try:
            jokes = pyjokes.get_jokes(lang, 'all')
            for joke in jokes:
                if current_index == joke_id:
                    response = jsonify({
                        'jokes': joke
                    })
                    response.headers['Access-Control-Allow-Origin'] = '*'
                    return response
                current_index += 1
        except:
            continue
    
    abort(404, description=f"Joke {joke_id} not found, try an id between 0 and {MAX_JOKE_ID}")

@app.errorhandler(404)
def not_found_error(error):
    if error.description:
        message = f"404 Not Found: {error.description}"
    else:
        message = "404 Not Found"
    return jsonify({'error': message}), 404
