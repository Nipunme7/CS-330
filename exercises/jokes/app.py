from flask import Flask, render_template, request, redirect, flash, make_response
import pyjokes
from pyjokes.exc import PyjokesError

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Required for flash messages

# Define constants globally to avoid redundancy
LANGUAGES = {
    "cs": "CZECH",
    "de": "GERMAN",
    "en": "ENGLISH",
    "es": "SPANISH",
    "eu": "BASQUE",
    "fr": "FRENCH",
    "gl": "GALICIAN",
    "hu": "HUNGARIAN",
    "it": "ITALIAN",
    "lt": "LITHUANIAN",
    "pl": "POLISH",
    "sv": "SWEDISH",
}

@app.get("/")
def index():
    """Render the form template."""
    my_range = list(range(1, 10))
    categorize = ["all", "neutral", "chuck"]
    return render_template(
        "base.html",
        LANGUAGES=LANGUAGES,
        my_range=my_range,
        categorize=categorize,
    )

@app.post("/")
def index_jokes():
    """Render the template with jokes."""
    # Retrieve form data with fallback defaults
    my_range = list(range(1, 10))
    categorize = ["all", "neutral", "chuck"]
    category = request.form.get("category", "neutral")
    language = request.form.get("language", "en")
    if not request.form:
        return redirect("Method not allowed", code=405)
    try:
        innernumber = int(request.form.get("number", 1))
        if innernumber < 1 or innernumber > 9:
            raise ValueError
    except ValueError:
        flash("Invalid number of jokes selected. Please select between 1 and 9.")
        return redirect(url_for("index"))

    if category not in categorize:
        category = "neutral"
    if language not in LANGUAGES:
        language = "en"

    jokes = get_jokes(language, category, innernumber)

    return render_template(
        "jokes.html",
        LANGUAGES=LANGUAGES,
        categorize=categorize,
        jokes=jokes,
        my_range=my_range,
    )

def get_jokes(language: str = "en", category: str = "all", number: int = 1) -> list[str]:
    
    """Return a list of jokes, limited by available jokes if needed."""
    my_range = list(range(1, 10))
    categorize = ["all", "neutral", "chuck"]
    try:
        # Fetch the specified number of jokes
        jokes = pyjokes.get_jokes(language=language, category=category)
        return jokes[:number] if jokes else ["No jokes available for this selection."]
    except PyjokesError as e:
        print(f"Error fetching jokes: {e}")
        return ["No kidding!"]

