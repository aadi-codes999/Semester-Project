"""Application package for the GIS Village Land Intelligence API."""

from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.database.db import initialize_database
from app.routes import register_blueprints


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    initialize_database(app)
    register_blueprints(app)
    return app
