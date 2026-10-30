"""Application package for the GIS Village Land Intelligence API."""

from pathlib import Path

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from app.config import Config
from app.database.db import initialize_database
from app.routes import register_blueprints


def create_app(test_config=None):
    frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    initialize_database(app)
    register_blueprints(app)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def frontend(path):
        index_path = frontend_dist / "index.html"
        is_api_path = path == "api" or path.startswith("api/")
        if index_path.is_file():
            requested_path = frontend_dist / path
            if path and requested_path.is_file():
                return send_from_directory(frontend_dist, path)
            if is_api_path:
                return jsonify({"message": "API endpoint not found"}), 404
            return send_from_directory(frontend_dist, "index.html")

        if is_api_path:
            return jsonify({"message": "API endpoint not found"}), 404

        return (
            '<!doctype html><html lang="en"><meta charset="utf-8">'
            "<title>Village Land Intelligence</title>"
            '<meta name="viewport" content="width=device-width, initial-scale=1">'
            "<h1>Village Land Intelligence API is running</h1>"
            "<p>The frontend has not been built yet. Start the frontend with "
            "<code>cd frontend; npm run dev</code>, then open "
            '<a href="http://127.0.0.1:5173/">http://127.0.0.1:5173/</a>.</p>'
            '<p>API health: <a href="/api/health">/api/health</a></p></html>',
            200,
            {"Content-Type": "text/html; charset=utf-8"},
        )

    return app
