"""add thread support to messages"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "008"
down_revision = "007"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("messages", sa.Column("thread_id", UUID(as_uuid=True),
                  sa.ForeignKey("messages.id", ondelete="CASCADE")))
    op.create_index("ix_messages_thread_id", "messages", ["thread_id"])


def downgrade():
    op.drop_index("ix_messages_thread_id")
    op.drop_column("messages", "thread_id")
