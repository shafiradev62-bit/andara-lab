"""Quick debug - write output to file"""
import json
import os
from playwright.sync_api import sync_playwright

BASE = "http://76.13.17.91"
OUT = "debug_output.txt"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    slug = "what-is-current-account-deficit"
    lines = []
    lines.append(f"=== DEBUG /article/{slug} ===")

    api_calls = []
    def on_request(request):
        if "/api/" in request.url:
            api_calls.append(f"REQ: {request.method} {request.url}")
    def on_response(response):
        if "/api/" in response.url:
            api_calls.append(f"RES: {response.status} {response.url}")
    page.on("request", on_request)
    page.on("response", on_response)

    page.goto(f"{BASE}/article/{slug}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)

    body_text = page.inner_text("body")
    lines.append(f"Body length: {len(body_text)}")
    lines.append(f"Body preview: {body_text[:200]}")
    lines.append(f"Page URL: {page.url}")
    lines.append(f"Page title: {page.title()}")

    lines.append(f"\nAPI calls made ({len(api_calls)}):")
    for call in api_calls:
        lines.append(f"  {call}")

    # Check HTML structure
    h1s = page.eval_on_selector_all("h1,h2,h3", "els => els.map(el => el.tagName + ':' + el.innerText)")
    lines.append(f"\nHeadings: {h1s}")

    # Check for article/error elements
    error_div = page.locator("[class*='404'], [class*='not-found'], [class*='error']").count()
    lines.append(f"Error divs: {error_div}")

    # Get full HTML for analysis
    html_snippet = page.content()[:3000]
    lines.append(f"\nHTML snippet: {html_snippet}")

    # Test the homepage about section too
    page.goto(f"{BASE}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    about_body = page.inner_text("body")
    lines.append(f"\nHomepage body length: {len(about_body)}")
    lines.append(f"Homepage about section preview: {about_body[500:900]}")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Debug output written to {OUT}")
    browser.close()
