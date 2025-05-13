import logging
import sys
import structlog


def setup_logging(debug: bool = False, json_logs: bool = False) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(stream=sys.stdout, level=level,
                        format="%(message)s" if json_logs else
                               "%(asctime)s %(levelname)-8s %(name)s - %(message)s")
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    if json_logs:
        structlog.configure(
            processors=[
                structlog.contextvars.merge_contextvars,
                structlog.stdlib.add_log_level,
                structlog.stdlib.add_logger_name,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.JSONRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(level),
            logger_factory=structlog.PrintLoggerFactory(),
        )
