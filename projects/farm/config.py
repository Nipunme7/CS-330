import os
import secrets
from pathlib import Path
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


class Config:
    """Application configuration class"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.db_path = self.base_dir / "farm.sqlite3"
        
        # Core Flask settings
        self.secret_key = os.environ.get("FLASK_SECRET_KEY") or secrets.token_hex(32)
        
        # Database settings
        self.db_uri = f"sqlite:////{self.db_path}"
        self.track_modifications = False
        self.echo = True


def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    config = config_class()
    
    # Configure Flask app
    app.config["SECRET_KEY"] = config.secret_key
    
    # Configure SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = config.db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.track_modifications
    app.config["SQLALCHEMY_ECHO"] = config.echo
    
    return app


# Initialize Flask app
app = create_app()

# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)