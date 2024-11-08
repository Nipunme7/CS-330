#!/usr/bin/env python3
"""
jokes api
"""
import random
from typing import List, Union

import pyjokes
from flask import Flask, request, abort, Response
import json

app = Flask(__name__)


@app.route("/api/v1/jokes", methods=["GET"])
@app.route("/api/v1/jokes/<string:lang>/<string:category>/<int:number>", methods =["GET"])
@app.route("/api/v1/jokes/<string:lang>/<string:category>/<int:number>/<int:id>", methods =["GET"])
def api_response(lang="", category="", number=0, id=None):
    if request.path == '/api/v1/jokes':
        # first implementation
        dict_values = dict(request.args)
        category = dict_values.get('category', 'all')
        lang = dict_values.get("language", 'en')
        number = int(dict_values.get("number", 1))
        id = int(dict_values.get("id", None))

    if lang not in ['en', 'es', 'de'] or \
            category not in ['neutral', 'all', 'chuck']:
        # raise 404 error if invalid category
        abort(404)

    if number != 1 and id is not None:
        abort(404)
    else:
        jokes = get_joke(lang, category, number, id=id)

    response_object = Response(json.dumps(jokes), status=200)
    response_object.headers['Content-Type'] = 'application/json'
    response_object.headers['Access-Control-Allow-Origin'] = '*'
    return response_object


def get_joke(language: str = "en", category: str = "all", number: int = 1,
            id: Union[int, None] = None) -> List[dict]:
    jokes = {'language':language,
             'category':category,
             'jokes':[],
             'number':number}

    if category == 'chuck' and language == 'es':
        jokes['number'] = 0
        return jokes
    else:
        all_jokes = pyjokes.get_jokes(language, category)
        if id is not None and id >= len(all_jokes):
            # id is not in the list, raise an error 
            abort(404)
        try:
            indexes = random.sample(range(0,len(all_jokes)), k=number)
        except ValueError:
            indexes = range(0, len(all_jokes))
            jokes['number'] = len(all_jokes)

        if id is None:
            for index in indexes:
                jokes['jokes'].append(all_jokes[index])
        else:
            jokes['jokes'].append(all_jokes[id])

    return jokes