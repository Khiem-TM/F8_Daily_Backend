import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# ── Thêm root project vào sys.path để import được src/ ──────────────────────
# __file__ = /path/to/project/alembic/env.py
# dirname(__file__) = /path/to/project/alembic/
# dirname(dirname(__file__)) = /path/to/project/   ← đây là root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ── Import sau khi đã có sys.path đúng ──────────────────────────────────────
from src.config import settings          # đọc DATABASE_URL từ .env
from src.database import Base            # Base chứa metadata của tất cả models
from src.models import User, RefreshToken  # import để Alembic "thấy" models

# ── Alembic Config object ────────────────────────────────────────────────────
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Đây là dòng quan trọng nhất: báo cho Alembic biết schema trông như thế nào
target_metadata = Base.metadata

# ── Offline mode: sinh SQL script mà không kết nối DB thực ──────────────────
def run_migrations_offline() -> None:
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

# ── Online mode: kết nối DB thực và chạy migration ──────────────────────────
def run_migrations_online() -> None:
    connectable = create_engine(settings.DATABASE_URL)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()

# ── Entry point: Alembic gọi hàm này khi chạy lệnh ─────────────────────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()