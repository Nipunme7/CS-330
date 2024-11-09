from flask import Flask, render_template, request, redirect, flash, url_for, abort
import pyjokes
from pyjokes.exc import PyjokesError

app = Flask(__name__)
app.secret_key = "supersecretkey" 

# Language codes and names
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

CATEGORIES = ["all", "neutral", "chuck"]
RANGE = list(range(1, 10))

@app.route("/", methods=["GET", "POST"])
def index():
    """Render the form template or the jokes based on the selected options."""
    if not request.method:
        return redirect("Method not allowed", code=405)

    if request.method == "POST":
        language = request.form.get("language", "en")
        category = request.form.get("category", "neutral")
        try:
            number = int(request.form.get("number", 1))
            if number not in RANGE:
                raise ValueError
        except ValueError:
            flash("Please select a valid number of jokes between 1 and 9.")
            return redirect(url_for("index"))

        # Validate category and language
        category = category if category in CATEGORIES else "neutral"
        language = language if language in LANGUAGES else "en"

        # Get jokes
        jokes = get_jokes(language, category, number)
        return render_template(
            "jokes.html",
            LANGUAGES=LANGUAGES,
            CATEGORIES=CATEGORIES,
            jokes=jokes,
            RANGE=RANGE,
            selected_language=language,
            selected_category=category,
            selected_number=number,
        )

    # If GET request, render the form
    return render_template(
        "base.html",
        LANGUAGES=LANGUAGES,
        CATEGORIES=CATEGORIES,
        RANGE=RANGE,
        selected_language="en",
        selected_category="neutral",
        selected_number=1,
    )


def get_jokes(language: str = "en", category: str = "all", number: int = 1) -> list[str]:
    """Return a list of jokes based on language, category, and number."""
    try:
        jokes = pyjokes.get_jokes(language=language, category=category)
        return jokes[:number] if jokes else ["No jokes available for this selection."]
    except PyjokesError as e:
        print(f"Error fetching jokes: {e}")
        return ["No kidding!"]

if __name__ == "__main__":
    app.run(debug=True)