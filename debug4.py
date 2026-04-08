"""Verify API calls after fix"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://76.13.17.91"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    api_calls = []
    def on_request(request):
        if "/api/" in request.url:
            api_calls.append(f"REQ: {request.method} {request.url}")
    def on_response(response):
        if "/api/" in response.url:
            api_calls.append(f"RES: {response.status} {response.url}")
    page.on("request", on_request)
    page.on("response", on_response)

    slug = "what-is-current-account-deficit"
    print(f"=== /article/{slug} API calls ===")
    page.goto(f"{BASE}/article/{slug}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)

    body = page.inner_text("body")
    print(f"Body length: {len(body)}")
    print(f"Page title: {page.title()}")

    for call in api_calls:
        print(f"  {call}")

    if len(body) > 1000:
        print("RESULT: Article loaded correctly!")
    else:
        print("RESULT: Still broken!")

    browser.close()
