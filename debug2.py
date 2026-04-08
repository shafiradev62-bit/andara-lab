"""Quick debug - fix event handler signature"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://76.13.17.91"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    slug = "what-is-current-account-deficit"
    print(f"=== DEBUG /article/{slug} ===")

    # Intercept API calls to see what's happening
    api_calls = []
    def on_request(request):
        if "/api/" in request.url:
            api_calls.append(f"REQ: {request.method} {request.url}")
    def on_response(response):
        if "/api/" in response.url:
            status = response.status
            api_calls.append(f"RES: {status} {response.url}")
    page.on("request", on_request)
    page.on("response", on_response)

    page.goto(f"{BASE}/article/{slug}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)

    body_text = page.inner_text("body")
    print(f"Body length: {len(body_text)}")
    print(f"Body content:\n{body_text}")
    print(f"\nPage URL: {page.url}")

    print(f"\nAPI calls made:")
    for call in api_calls:
        print(f"  {call}")

    browser.close()
