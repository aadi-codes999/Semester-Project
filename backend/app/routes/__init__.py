"""HTTP route blueprints."""

from app.routes.assessment_routes import assessment_bp
from app.routes.auth_routes import auth_bp
from app.routes.dashboard_routes import dashboard_bp
from app.routes.gis_routes import gis_bp
from app.routes.land_routes import land_bp
from app.routes.recommendation_routes import recommendation_bp
from app.routes.report_routes import report_bp
from app.routes.village_routes import village_bp


def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    app.register_blueprint(gis_bp, url_prefix="/api")
    app.register_blueprint(village_bp, url_prefix="/api")
    app.register_blueprint(land_bp, url_prefix="/api")
    app.register_blueprint(assessment_bp, url_prefix="/api")
    app.register_blueprint(recommendation_bp, url_prefix="/api")
    app.register_blueprint(report_bp, url_prefix="/api")
