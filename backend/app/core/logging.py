import logging
import sys


def setup_logging(debug: bool = False) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        stream=sys.stdout,
        level=level,
        format="%(asctime)s %(levelname)-8s %(name)s - %(message)s",
    )
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
