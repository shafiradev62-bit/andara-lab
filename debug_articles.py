"""
Deep debug script - captures detailed info about article page rendering
"""
import json
from playwright.sync_api import sync_playwright

BASE = "http://76.13.17.91"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # Capture all network requests for failed ones
    failed_requests = []
    def track_failed(request, response):
        if response.status >= 400:
            failed_requests.append({
                "url": request.url,
                "status": response.status,
                "method": request.method,
            })
    page.on("response", track_failed)

    # Capture console messages
    console_logs = []
    def track_console(msg):
        console_logs.append(f"[{msg.type}] {msg.text}")
    page.on("console", track_console)

    slug = "what-is-current-account-deficit"
    print(f"\n=== DEBUG /article/{slug} ===")
    page.goto(f"{BASE}/article/{slug}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)

    body_text = page.inner_text("body")
    print(f"Body length: {len(body_text)}")
    print(f"Body content:\n{body_text[:500]}")
    print(f"\nPage URL: {page.url}")

    # Check page content structure
    html = page.content()
    print(f"\nHTML length: {len(html)}")

    # Check if there's an error div
    error_count = page.locator("[class*='error'], [class*='404'], [class*='not-found']").count()
    print(f"Error/404 elements: {error_count}")

    # Check for key article elements
    title_count = page.locator("h1, h2").count()
    print(f"H1/H2 elements: {title_count}")

    # Check for article content
    article_text_count = page.locator("article, [role='article'], .article").count()
    print(f"Article elements: {article_text_count}")

    print(f"\nFailed requests ({len(failed_requests)}):")
    for r in failed_requests[:10]:
        print(f"  {r['status']} {r['method']} {r['url']}")

    print(f"\nConsole messages:")
    for c in console_logs[:20]:
        print(f"  {c}")

    # Check the actual API call the browser makes
    print("\n--- Testing /api/blog/slug from browser context ---")
    page2 = browser.new_page(viewport={"width": 1440, "height": 900})
    page2.goto(f"{BASE}/api/blog/slug/{slug}", wait_until="networkidle", timeout=15000)
    body2 = page2.inner_text("body")
    try:
        data = json.loads(body2)
        print(f"API response: slug={data.get('data', {}).get('slug')}, title={data.get('data', {}).get('title', '')[:40]}")
    except Exception as e:
        print(f"API response parse error: {e}, body: {body2[:200]}")

    browser.close()
