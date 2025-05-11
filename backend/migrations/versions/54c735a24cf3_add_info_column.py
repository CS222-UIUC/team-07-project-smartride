"""Add info column

Revision ID: 54c735a24cf3
Revises: 6e7cf1db297b
Create Date: 2025-05-11 02:14:16.197791
"""

from alembic import op
import sqlalchemy as sa
import json

# revision identifiers, used by Alembic.
revision = '54c735a24cf3'
down_revision = '6e7cf1db297b'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = sa.orm.Session(bind=bind)

    # Step 1: Add new columns
    with op.batch_alter_table('map_routes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('info', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('data', sa.Text(), nullable=True))

    # Step 2: Migrate data from old columns into new structure
    map_routes = sa.table(
        'map_routes',
        sa.column('id', sa.Integer),
        sa.column('route_name', sa.String),
        sa.column('route_data', sa.Text),
        sa.column('info', sa.Text),
        sa.column('data', sa.Text),
    )

    result = session.execute(sa.select(
        map_routes.c.id,
        map_routes.c.route_name,
        map_routes.c.route_data
    )).fetchall()

    for row in result:
        route_id = row.id
        route_name = row.route_name
        route_data = row.route_data

        info_json = json.dumps({"name": route_name}) if route_name else None
        data_json = route_data  # already JSON text

        session.execute(
            map_routes.update().where(map_routes.c.id == route_id).values(
                info=info_json,
                data=data_json
            )
        )

    session.commit()

    # Step 3: Drop old columns
    with op.batch_alter_table('map_routes', schema=None) as batch_op:
        batch_op.drop_column('route_data')
        batch_op.drop_column('route_name')


def downgrade():
    bind = op.get_bind()
    session = sa.orm.Session(bind=bind)

    # Step 1: Re-add old columns
    with op.batch_alter_table('map_routes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('route_name', sa.VARCHAR(length=100), nullable=False, server_default="Unnamed"))
        batch_op.add_column(sa.Column('route_data', sa.Text(), nullable=True))

    # Step 2: Migrate data from new fields back to old ones
    map_routes = sa.table(
        'map_routes',
        sa.column('id', sa.Integer),
        sa.column('info', sa.Text),
        sa.column('data', sa.Text),
        sa.column('route_name', sa.String),
        sa.column('route_data', sa.Text),
    )

    result = session.execute(sa.select(
        map_routes.c.id,
        map_routes.c.info,
        map_routes.c.data
    )).fetchall()

    for row in result:
        route_id = row.id
        route_name = "Unnamed"
        try:
            info_dict = json.loads(row.info) if row.info else {}
            if "name" in info_dict:
                route_name = info_dict["name"]
        except Exception:
            pass

        session.execute(
            map_routes.update().where(map_routes.c.id == route_id).values(
                route_name=route_name,
                route_data=row.data
            )
        )

    session.commit()

    # Step 3: Drop new columns
    with op.batch_alter_table('map_routes', schema=None) as batch_op:
        batch_op.drop_column('data')
        batch_op.drop_column('info')
