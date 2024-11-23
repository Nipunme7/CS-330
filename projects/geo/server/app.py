#!/usr/bin/env python3
from flask import Flask, jsonify, abort
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('geo.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/country')
def get_countries():
    conn = get_db_connection()
    countries = conn.execute('SELECT name FROM country;').fetchall()
    conn.close()
    return jsonify([dict(country) for country in countries])

@app.route('/region')
def get_regions():
    conn = get_db_connection()
    regions = conn.execute('SELECT DISTINCT continental_region FROM country WHERE continental_region IS NOT NULL;').fetchall()
    conn.close()
    return jsonify([dict(region) for region in regions])

@app.route('/subregion')
def get_subregions():
    conn = get_db_connection()
    subregions = conn.execute('SELECT DISTINCT subregion FROM country WHERE subregion IS NOT NULL;').fetchall()
    conn.close()
    return jsonify([dict(subregion) for subregion in subregions])

@app.route('/country/<string:name>')
def get_country(name):
    conn = get_db_connection()
    country = conn.execute('SELECT * FROM country WHERE name = ?;', (name,)).fetchone()
    conn.close()
    
    if country is None:
        abort(404)
    return jsonify(dict(country))

@app.route('/region/<string:name>')
def get_region(name):
    conn = get_db_connection()
    countries = conn.execute('SELECT * FROM country WHERE continental_region = ?;', (name,)).fetchall()
    conn.close()
    
    if not countries:
        abort(404)
    return jsonify([dict(country) for country in countries])

@app.route('/subregion/<string:name>')
def get_subregion(name):
    conn = get_db_connection()
    countries = conn.execute('SELECT * FROM country WHERE subregion = ?;', (name,)).fetchall()
    conn.close()
    
    if not countries:
        abort(404)
    return jsonify([dict(country) for country in countries])

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Server error'}), 500 