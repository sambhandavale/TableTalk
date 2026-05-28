import logging
import httpx

logger = logging.getLogger("TableTalk.BackendUtils")

async def resolve_maps_url(url: str) -> str:
    """Follows redirects for shortened Google Maps links asynchronously (e.g., maps.app.goo.gl)."""
    if not url:
        return ""
    
    # Check if URL looks like a shortened link
    if "maps.app.goo.gl" in url or "goo.gl/maps" in url:
        logger.info(f"Resolving shortened Google Maps URL redirect: {url}")
        try:
            async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
                response = await client.head(url)
                resolved_url = str(response.url)
                logger.info(f"Resolved shortened URL to: {resolved_url}")
                return resolved_url
        except Exception as e:
            logger.warning(f"Failed to follow redirects for {url}: {e}. Reverting to original URL.")
            return url
    return url
