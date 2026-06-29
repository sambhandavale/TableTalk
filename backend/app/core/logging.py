import logging
import uuid
import contextvars
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

correlation_id: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="unknown")

class CorrelationIdFilter(logging.Filter):
    def filter(self, record):
        record.correlation_id = correlation_id.get()
        return True

def setup_logging():
    logger = logging.getLogger("TableTalk")
    logger.setLevel(logging.INFO)
    
    # Remove all handlers to avoid duplicates
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
        
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(correlation_id)s] [%(levelname)s] %(name)s: %(message)s"
    )
    handler.setFormatter(formatter)
    handler.addFilter(CorrelationIdFilter())
    logger.addHandler(handler)
    return logger

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        token = correlation_id.set(req_id)
        
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = req_id
        
        correlation_id.reset(token)
        return response
