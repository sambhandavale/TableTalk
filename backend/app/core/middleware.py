import time
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

# Simple rate limiting logic for hackathon purposes
RATE_LIMIT_DURATION = 60
RATE_LIMIT_REQUESTS = 100
ip_request_counts = defaultdict(list)

class RateLimitingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old requests
        ip_request_counts[client_ip] = [
            timestamp for timestamp in ip_request_counts[client_ip]
            if current_time - timestamp < RATE_LIMIT_DURATION
        ]
        
        if len(ip_request_counts[client_ip]) >= RATE_LIMIT_REQUESTS:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Too many requests. Please try again later."}
            )
            
        ip_request_counts[client_ip].append(current_time)
        
        response = await call_next(request)
        return response
