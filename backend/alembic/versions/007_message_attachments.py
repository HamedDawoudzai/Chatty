"""add message attachment columns"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("messages", sa.Column("attachment_url", sa.Text))
    op.add_column("messages", sa.Column("attachment_name", sa.String(255)))
    op.add_column("messages", sa.Column("attachment_type", sa.String(100)))
    op.add_column("messages", sa.Column("link_preview", sa.Text))
    op.add_column("messages", sa.Column("is_pinned", sa.Boolean, server_default="false"))


def downgrade():
    for col in ["attachment_url", "attachment_name", "attachment_type", "link_preview", "is_pinned"]:
        op.drop_column("messages", col)
