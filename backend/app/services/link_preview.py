import asyncio
from urllib.parse import urlparse
import httpx
from bs4 import BeautifulSoup
import json


async def extract_link_preview(url: str) -> dict | None:
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return None
        async with httpx.AsyncClient(timeout=5, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Chatty/1.0"})
            if resp.status_code != 200:
                return None
        soup = BeautifulSoup(resp.text, "html.parser")
        title = (
            (soup.find("meta", property="og:title") or {}).get("content")
            or (soup.find("title") or BeautifulSoup("", "html.parser").new_tag("title")).get_text()
            or ""
        )
        desc = (soup.find("meta", property="og:description") or {}).get("content") or ""
        image = (soup.find("meta", property="og:image") or {}).get("content") or ""
        return {"url": url, "title": title[:200], "description": desc[:500], "image": image}
    except Exception:
        return None
