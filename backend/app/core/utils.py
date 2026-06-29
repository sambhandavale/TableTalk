import logging
import httpx
import re
import json
from typing import List, Dict, Any
from datetime import datetime, timezone
from app.core.config import settings

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

async def scrape_real_google_reviews(maps_url: str) -> List[Dict[str, Any]]:
    """Extracts Google Maps CID dynamically and fetches real reviews via Apify (primary), SerpApi, or AJAX fallback."""
    if not maps_url:
        return []
        
    apify_token = settings.APIFY_API_TOKEN
    
    # 1. Primary Method: Apify Google Maps Reviews Actor API (compass/google-maps-reviews-scraper)
    if apify_token:
        masked_token = apify_token[:10] + "..." + apify_token[-4:] if len(apify_token) > 15 else "***"
        logger.info(f"Apify API token found ({masked_token}). Scraping real reviews via Apify Actor 'compass/google-maps-reviews-scraper'...")
        run_sync_items_url = f"https://api.apify.com/v2/acts/compass~google-maps-reviews-scraper/run-sync-get-dataset-items?token={apify_token}"
        
        # Configure the actor run input payload exactly as specified in the docs
        payload = {
            "language": "en",
            "maxReviews": 10,
            "personalData": True,
            "startUrls": [{"url": maps_url}]
        }
        
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                logger.info(f"Triggering Apify compass scraper run-sync for URL: {maps_url}...")
                response = await client.post(run_sync_items_url, json=payload)
                if response.status_code in [200, 201]:
                    items = response.json()
                    logger.info(f"Apify compass actor completed successfully! Fetched {len(items)} review items directly.")
                    
                    scraped_reviews = []
                    for idx, r in enumerate(items):
                        diner_name = r.get("name", f"Google Diner #{idx+1}")
                        text_content = r.get("text", "")
                        rating = int(r.get("stars", r.get("rating", 5)))
                        timestamp = r.get("publishedAtDate", datetime.now(timezone.utc))
                        owner_reply = r.get("responseFromOwnerText")
                        
                        review_obj = {
                            "diner_name": diner_name,
                            "text": text_content,
                            "rating": rating,
                            "timestamp": timestamp
                        }
                        if owner_reply:
                            review_obj["owner_approved_reply"] = True
                            review_obj["final_reply_content"] = owner_reply
                        else:
                            review_obj["owner_approved_reply"] = False
                            
                        scraped_reviews.append(review_obj)
                    return scraped_reviews
                else:
                    logger.warning(f"Apify compass REST API trigger returned status: {response.status_code} - {response.text}")
        except Exception as e:
            logger.error(f"Failed to scrape reviews from Apify compass actor: {e}", exc_info=True)


    # 3. Tertiary Method: Local HTML / ludocid AJAX Scraper
    logger.info("Attempting local HTML / ludocid AJAX fallback scraper...")
    cid = None
    
    # Try fetching the HTML to find the canonical CID (ludocid) which is the most reliable way!
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5"
        }
        logger.info(f"Fetching Google Maps HTML page to extract canonical identifiers...")
        async with httpx.AsyncClient(timeout=10.0, headers=headers, follow_redirects=True) as client:
            response = await client.get(maps_url)
            if response.status_code == 200:
                html_content = response.text
                
                # 1. Search for ludocid inside escaped scripts: ludocid\\u003d8303341987878155137
                match_ludo = re.search(r'ludocid(?:\\u003d|=|\\u003d)([0-9]+)', html_content)
                if match_ludo:
                    cid = int(match_ludo.group(1))
                    logger.info(f"Successfully extracted canonical CID (ludocid) from HTML scripts: {cid}")
                
                # 2. Search for any standard cid in links or scripts
                if not cid:
                    match_cid_html = re.search(r'cid(?:\\u003d|=|\\u003d)([0-9]+)', html_content)
                    if match_cid_html:
                        cid = int(match_cid_html.group(1))
                        logger.info(f"Extracted CID from HTML: {cid}")
                        
                # 3. Search for the place_id just in case
                match_place_id = re.search(r'(ChIJ[a-zA-Z0-9_-]{23})', html_content)
                if match_place_id:
                    logger.info(f"Extracted Google Place ID from HTML: {match_place_id.group(1)}")
            else:
                logger.warning(f"Google Maps HTML page fetch returned status code: {response.status_code}")
    except Exception as e:
        logger.warning(f"Failed to fetch HTML page or parse identifiers: {e}")

    # Fallbacks from URL parameter directly if HTML fetch failed or was blocked
    if not cid:
        logger.info("Falling back to parsing CID/Lid directly from the maps URL parameters...")
        match_cid = re.search(r'cid=([0-9]+)', maps_url)
        if match_cid:
            cid = int(match_cid.group(1))
            logger.info(f"Extracted CID from URL query: {cid}")
        else:
            match_hex = re.search(r'0x[0-9a-fA-F]+:0x([0-9a-fA-F]+)', maps_url)
            if match_hex:
                try:
                    hex_lid = match_hex.group(1)
                    cid = int(hex_lid, 16)
                    logger.info(f"Extracted hex Lid fallback: {hex_lid}, converted to CID: {cid}")
                except Exception as e:
                    logger.warning(f"Failed to parse hex Lid fallback: {e}")

    if not cid:
        logger.warning("Could not extract any Google Maps CID. Reverting to AI synthesis.")
        return []
        
    # Query Google's public reviews preview API (requests 8 reviews)
    ajax_url = f"https://www.google.com/maps/preview/review?authuser=0&hl=en&gl=in&pb=!1m2!1y{cid}!2m2!1i0!2i8"
    logger.info(f"Querying Google Reviews AJAX endpoint: {ajax_url}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9"
    }
    
    try:
        async with httpx.AsyncClient(timeout=12.0, headers=headers) as client:
            response = await client.get(ajax_url)
            if response.status_code != 200:
                logger.warning(f"Google Reviews AJAX endpoint returned status code: {response.status_code}")
                return []
                
            text = response.text
            if text.startswith(")]}'"):
                text = text[4:].strip()
                
            data = json.loads(text)
            
            # Google review payload: list is located in data[2]
            if len(data) > 2 and data[2]:
                reviews_list = data[2]
                scraped_reviews = []
                for idx, r in enumerate(reviews_list):
                    try:
                        # Author info is in r[0]
                        author_name = r[0][1] if len(r[0]) > 1 else "Google Diner"
                    except Exception:
                        author_name = f"Google Diner #{idx+1}"
                        
                    try:
                        text_content = r[3] if r[3] else ""
                    except Exception:
                        text_content = ""
                        
                    try:
                        rating = int(r[4])
                    except Exception:
                        rating = 5
                        
                    scraped_reviews.append({
                        "diner_name": author_name,
                        "text": text_content,
                        "rating": rating
                    })
                    
                logger.info(f"Successfully scraped {len(scraped_reviews)} REAL Google Reviews from Maps URL!")
                return scraped_reviews
            else:
                logger.warning("No review records found in Google Maps AJAX response payload.")
                return []
                
    except Exception as e:
        logger.error(f"Error occurred while scraping Google reviews AJAX: {e}", exc_info=True)
        return []
