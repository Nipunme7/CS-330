#!/usr/bin/env python3
"""
Geography query app

@authors:
@version: 2024.11
"""

import pathlib
import sqlite3

from dotenv import load_dotenv
from flask import Flask, abort, flash, redirect, render_template, request, url_for
from werkzeug.wrappers import Response


def create_app():
    """Create Flask app"""
    this_app = Flask(__name__)
    if pathlib.Path(".flaskenv").exists():
        this_app.config.from_prefixed_env()
    else:
        load_dotenv("exercises/geo/.flaskenv")
        this_app.config.from_prefixed_env()
    return this_app


app = create_app()


def get_data_from_db(query: str, params: tuple | None = None) -> list:
    """Retrieve data from the database

    :param query: parametrized query to execute
    :param params: query parameters
    """
    db_path = pathlib.Path(__file__).parent / "world.sqlite3"
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    try:
        if params:
            cur.execute(query, params)
        else:
            cur.execute(query)
        data = cur.fetchall()
        return data
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return []
    finally:
        cur.close()
        conn.close()


@app.route("/")
def index() -> str:
    """Display default page"""
    return render_template("index.html")


@app.get("/country")
def country_form() -> str | Response:
    """Display country search form"""
    query = "SELECT name FROM country ORDER BY name;"
    countries = get_data_from_db(query)
    return render_template("country.html", countries=countries)


@app.get("/country/<string:name>")
def country_info(name: str) -> str:
    """Display country information"""
    query = """
    SELECT 
        c.name,
        COALESCE(ci.name, '') as capital,
        c.continental_region,
        COALESCE(c.subregion, '') as subregion,
        c.area,
        c.population_2023,
        CASE 
            WHEN c.area > 0 AND c.population_2023 IS NOT NULL 
            THEN ROUND(CAST(c.population_2023 AS FLOAT) / c.area, 2)
            ELSE NULL
        END as density,
        c.government_system
    FROM country c
    LEFT JOIN city ci ON c.capital = ci.id
    WHERE c.name = ?;
    """
    result = get_data_from_db(query, (name,))
    if not result:
        abort(404)
    return render_template("index.html", data=result)


@app.get("/region")
def region_form() -> str | Response:
    """Display region search form"""
    query = "SELECT DISTINCT continental_region FROM country ORDER BY continental_region;"
    regions = get_data_from_db(query)
    return render_template("region.html", regions=regions)


@app.get("/region/<string:name>")
def region_info(name: str) -> str:
    """Display region information"""
    query = """
    SELECT 
        name,
        COALESCE((SELECT name FROM city WHERE id = country.capital), '') as capital,
        continental_region,
        COALESCE(subregion, '') as subregion,
        area,
        population_2023,
        CASE 
            WHEN area > 0 AND population_2023 IS NOT NULL 
            THEN ROUND(CAST(population_2023 AS FLOAT) / area, 2)
            ELSE NULL
        END as density,
        government_system
    FROM country
    WHERE continental_region = ?
    ORDER BY name;
    """
    result = get_data_from_db(query, (name,))
    if not result:
        abort(404)
    return render_template("index.html", data=result)


@app.get("/subregion")
def subregion_form() -> str | Response:
    """Display subregion search form"""
    query = "SELECT DISTINCT subregion FROM country WHERE subregion IS NOT NULL ORDER BY subregion;"
    subregions = get_data_from_db(query)
    return render_template("subregion.html", subregions=subregions)


@app.get("/subregion/<string:name>")
def subregion_info(name: str) -> str:
    """Display subregion information"""
    query = """
    SELECT 
        name,
        COALESCE((SELECT name FROM city WHERE id = country.capital), '') as capital,
        continental_region,
        COALESCE(subregion, '') as subregion,
        area,
        population_2023,
        CASE 
            WHEN area > 0 AND population_2023 IS NOT NULL 
            THEN ROUND(CAST(population_2023 AS FLOAT) / area, 2)
            ELSE NULL
        END as density,
        government_system
    FROM country
    WHERE subregion = ?
    ORDER BY name;
    """
    result = get_data_from_db(query, (name,))
    if not result:
        abort(404)
    return render_template("index.html", data=result)


@app.errorhandler(404)
def not_found(err):
    """Handle 404 errors"""
    return render_template("error.html", error=err), 404


if __name__ == "__main__":
    app.run()