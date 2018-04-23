"""empty message

Revision ID: 4736ec66ce19
Revises: f959a6652acd
Create Date: 2017-10-03 14:37:01.376578

"""

# revision identifiers, used by Alembic.
revision = '4736ec66ce19'
down_revision = 'f959a6652acd'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.exc import OperationalError

from superset.utils import (
    generic_find_fk_constraint_name,
    generic_find_fk_constraint_names,
    generic_find_uq_constraint_name,
)


conv = {
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
}

# Helper table for database migrations using minimal schema.
datasources = sa.Table(
    'datasources',
    sa.MetaData(),
    sa.Column('id', sa.Integer, primary_key=True),
    sa.Column('datasource_name', sa.String(255)),
)


def upgrade():
    bind = op.get_bind()
    insp = sa.engine.reflection.Inspector.from_engine(bind)

    # Add the new less restrictive uniqueness constraint.
    with op.batch_alter_table('datasources', naming_convention=conv) as batch_op:
        batch_op.create_unique_constraint(
            'uq_datasources_cluster_name',
            ['cluster_name', 'datasource_name'],
        )

    # Augment the tables which have a foreign key constraint related to the
    # datasources.datasource_name column.
    for foreign in ['columns', 'metrics']:
        with op.batch_alter_table(foreign, naming_convention=conv) as batch_op:

            # Add the datasource_id column with the relevant constraints.
            batch_op.add_column(sa.Column('datasource_id', sa.Integer))

            batch_op.create_foreign_key(
                'fk_{}_datasource_id_datasources'.format(foreign),
                'datasources',
                ['datasource_id'],
                ['id'],
            )

        # Helper table for database migration using minimal schema.
        table = sa.Table(
            foreign,
            sa.MetaData(),
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('datasource_name', sa.String(255)),
            sa.Column('datasource_id', sa.Integer),
        )

        # Migrate the existing data.
        for datasource in bind.execute(datasources.select()):
            bind.execute(
                table.update().where(
                    table.c.datasource_name == datasource.datasource_name,
                ).values(
                    datasource_id=datasource.id,
                ),
            )

        with op.batch_alter_table(foreign, naming_convention=conv) as batch_op:

            # Drop the datasource_name column and associated constraints. Note
            # due to prior revisions (1226819ee0e3, 3b626e2a6783) there may
            # incorectly be multiple duplicate constraints.
            names = generic_find_fk_constraint_names(
                foreign,
                {'datasource_name'},
                'datasources',
                insp,
            )

            for name in names:
                batch_op.drop_constraint(
                    name or 'fk_{}_datasource_name_datasources'.format(foreign),
                    type_='foreignkey',
                )

            batch_op.drop_column('datasource_name')

    # Drop the old more restrictive uniqueness constraint.
    with op.batch_alter_table('datasources', naming_convention=conv) as batch_op:
        batch_op.drop_constraint(
            generic_find_uq_constraint_name(
                'datasources',
                {'datasource_name'},
                insp,
            ) or 'uq_datasources_datasource_name',
            type_='unique',
        )


def downgrade():
    bind = op.get_bind()
    insp = sa.engine.reflection.Inspector.from_engine(bind)

    # Add the new more restrictive uniqueness constraint which is required by
    # the foreign key constraints. Note this operation will fail if the
    # datasources.datasource_name column is no longer unique.
    with op.batch_alter_table('datasources', naming_convention=conv) as batch_op:
        batch_op.create_unique_constraint(
            'uq_datasources_datasource_name',
            ['datasource_name'],
        )

    # Augment the tables which have a foreign key constraint related to the
    # datasources.datasource_id column.
    for foreign in ['columns', 'metrics']:
        with op.batch_alter_table(foreign, naming_convention=conv) as batch_op:

            # Add the datasource_name column with the relevant constraints.
            batch_op.add_column(sa.Column('datasource_name', sa.String(255)))

            batch_op.create_foreign_key(
                'fk_{}_datasource_name_datasources'.format(foreign),
                'datasources',
                ['datasource_name'],
                ['datasource_name'],
            )

        # Helper table for database migration using minimal schema.
        table = sa.Table(
            foreign,
            sa.MetaData(),
            sa.Column('id', sa.Integer, primary_key=True),
            sa.Column('datasource_name', sa.String(255)),
            sa.Column('datasource_id', sa.Integer),
        )

        # Migrate the existing data.
        for datasource in bind.execute(datasources.select()):
            bind.execute(
                table.update().where(
                    table.c.datasource_id == datasource.id,
                ).values(
                    datasource_name=datasource.datasource_name,
                ),
            )

        with op.batch_alter_table(foreign, naming_convention=conv) as batch_op:

            # Drop the datasource_id column and associated constraint.
            batch_op.drop_constraint(
                'fk_{}_datasource_id_datasources'.format(foreign),
                type_='foreignkey',
            )

            batch_op.drop_column('datasource_id')

    with op.batch_alter_table('datasources', naming_convention=conv) as batch_op:

        # Prior to dropping the uniqueness constraint, the foreign key
        # associated with the cluster_name column needs to be dropped.
        batch_op.drop_constraint(
            generic_find_fk_constraint_name(
                'datasources',
                {'cluster_name'},
                'clusters',
                insp,
            ) or 'fk_datasources_cluster_name_clusters',
            type_='foreignkey',
        )

        # Drop the old less restrictive uniqueness constraint.
        batch_op.drop_constraint(
            generic_find_uq_constraint_name(
                'datasources',
                {'cluster_name', 'datasource_name'},
                insp,
            ) or 'uq_datasources_cluster_name',
            type_='unique',
        )

        # Re-create the foreign key associated with the cluster_name column.
        batch_op.create_foreign_key(
                'fk_{}_datasource_id_datasources'.format(foreign),
                'clusters',
                ['cluster_name'],
                ['cluster_name'],
            )
