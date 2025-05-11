from server.core.extensions import db
from sqlalchemy.orm import Session
from json_migrations.versions import m001_initial_migrate_route_data_format as m001
from server.app import app

def run_upgrades():
    with app.app_context():
        session = Session(bind=db.engine)
        m001.upgrade(session)
        session.commit()

def run_downgrades():
    with app.app_context():
        session = Session(bind=db.engine)
        m001.downgrade(session)
        session.commit()

if __name__ == "__main__":
    run_upgrades()
    # run_downgrades()
