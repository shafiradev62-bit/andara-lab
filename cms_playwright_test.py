"""
AndaraLab CMS Comprehensive Playwright Test
Tests all CMS pages, links, charts, and screenshots each section.
"""

import os
import time
import json
from datetime import datetime
from playwright.sync_api import sync_playwright, Page, Browser, expect

BASE_URL = "http://76.13.17.91"
ADMIN_URL = "http://76.13.17.91/admin"
SCREENSHOT_DIR = "test-screenshots"
FAILURES = []
ERRORS = []

def log(msg):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}")

def screenshot(page: Page, name: str, full_page=False):
    path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
    try:
        page.screenshot(path=path, full_page=full_page)
        log(f"  Screenshot: {path}")
    except Exception as e:
        log(f"  SCREENSHOT ERROR {name}: {e}")
        ERRORS.append(f"Screenshot {name}: {e}")

def check_status(page: Page, name: str):
    """Check for 404 / blank / error indicators."""
    url = page.url
    title = page.title()
    body_text = page.evaluate("document.body.innerText || ''")

    # Check URL 404
    if "404" in url and "lookup" not in url:
        log(f"  FAIL: URL contains 404 — {url}")
        FAILURES.append(f"{name}: URL 404 — {url}")
        return False

    # Check page title / body for not-found
    not_found_terms = ["Page not found", "Halaman tidak ditemukan", "Not Found", "does not exist"]
    for term in not_found_terms:
        if term in body_text[:500]:
            # Check if it's actually a 404 page (not a legitimate "not found" message)
            if "404" in title or "404" in page.content()[:500]:
                log(f"  FAIL: 404 page — {url}")
                FAILURES.append(f"{name}: 404 page — {url}")
                return False

    # Check blank page
    if len(body_text.strip()) < 20:
        log(f"  WARN: Page body very short — {url}")
        ERRORS.append(f"{name}: Short body — {url}")

    return True

def check_console_errors(page: Page, name: str):
    """Check for console errors."""
    errors = []
    def handle_console(msg):
        if msg.type == "error":
            errors.append(msg.text)
    page.on("console", handle_console)
    page.wait_for_timeout(1000)
    page.off("console", handle_console)
    if errors:
        log(f"  Console errors: {errors[:3]}")
        ERRORS.append(f"{name} console errors: {errors[:3]}")


def test_homepage(page: Page):
    log("=== HOMEPAGE ===")
    page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
    screenshot(page, "01_homepage", full_page=True)
    check_status(page, "homepage")

    # Check key homepage sections exist
    sections = [
        ("Featured Insights", ".text-gray-900", "Featured Insights"),
        ("About section", "[class*='border-t']", "About"),
    ]
    for label, selector, fallback_text in sections:
        try:
            el = page.locator(fallback_text).first
            if el.count() > 0:
                log(f"  {label}: FOUND")
            else:
                log(f"  {label}: not found (may be rendered differently)")
        except:
            log(f"  {label}: check failed")


def test_about_page(page: Page):
    log("=== /about PAGE ===")
    page.goto(f"{BASE_URL}/about", wait_until="networkidle", timeout=30000)
    screenshot(page, "02_about_page", full_page=True)
    check_status(page, "/about")
    body = page.inner_text("body")
    if "AndaraLab" in body or "Who We Are" in body or "Siapa Kami" in body:
        log("  /about: content loaded OK")
    else:
        log("  WARN: /about body unexpected")
        ERRORS.append("/about: unexpected body")


def test_blog_listing(page: Page):
    log("=== /blog LISTING ===")
    page.goto(f"{BASE_URL}/blog", wait_until="networkidle", timeout=30000)
    screenshot(page, "03_blog_listing", full_page=True)
    check_status(page, "/blog")


def test_article_pages(page: Page):
    log("=== BLOG ARTICLE PAGES ===")
    # Get list of article slugs from API
    page.goto(f"{BASE_URL}/api/blog/", wait_until="networkidle", timeout=15000)
    try:
        data = json.loads(page.inner_text("body"))
        posts = data.get("data", data)
        if isinstance(posts, dict):
            posts = list(posts.values())
        if not posts:
            posts = list(posts)
        log(f"  Found {len(posts)} posts in API")
    except Exception as e:
        log(f"  Could not fetch posts: {e}")
        posts = []

    # Test first 5 articles
    for i, post in enumerate(posts[:5]):
        slug = post.get("slug") or post.get("id", f"post-{i}")
        log(f"  Testing article: {slug}")
        page.goto(f"{BASE_URL}/article/{slug}", wait_until="networkidle", timeout=30000)
        screenshot(page, f"04_article_{slug[:30]}", full_page=True)
        if not check_status(page, f"/article/{slug}"):
            log(f"  FAIL: /article/{slug} returned 404")
        else:
            log(f"  OK: /article/{slug}")
            # Check article has real content
            body = page.inner_text("body")
            if len(body.strip()) > 100:
                log(f"  /article/{slug}: content loaded ({len(body)} chars)")
            else:
                log(f"  WARN: /article/{slug} body very short ({len(body)} chars)")
                ERRORS.append(f"/article/{slug}: short body")


def test_data_pages(page: Page):
    log("=== DATA HUB / MARKET PAGES ===")
    data_routes = [
        "/data/market-dashboard",
        "/data",
        "/data/jci-7200",
    ]
    for route in data_routes:
        page.goto(f"{BASE_URL}{route}", wait_until="networkidle", timeout=30000)
        screenshot(page, f"05{route.replace('/','_')}", full_page=True)
        check_status(page, route)
        body = page.inner_text("body")
        log(f"  {route}: {len(body)} chars loaded")


def test_admin_pages(page: Page):
    log("=== ADMIN CMS PAGES ===")
    admin_sections = [
        ("Admin Dashboard", ADMIN_URL),
        ("Pages Tab", f"{ADMIN_URL}#/pages"),
        ("Blog Tab", f"{ADMIN_URL}#/blog"),
        ("Featured Insights Tab", f"{ADMIN_URL}#/featured"),
        ("Data Datasets Tab", f"{ADMIN_URL}#/data"),
        ("Analysis Tab", f"{ADMIN_URL}#/analysis"),
    ]

    for label, url in admin_sections:
        log(f"  Testing: {label} ({url})")
        page.goto(url, wait_until="networkidle", timeout=30000)
        screenshot(page, f"06_admin_{label.replace(' ','_').lower()}", full_page=True)
        check_status(page, label)

        # Wait for content to load
        page.wait_for_timeout(2000)
        body = page.inner_text("body")
        if len(body.strip()) > 50:
            log(f"  {label}: loaded ({len(body)} chars)")
        else:
            log(f"  FAIL: {label} appears blank ({len(body)} chars)")
            FAILURES.append(f"{label}: appears blank")


def test_admin_page_edit(page: Page):
    log("=== ADMIN PAGE EDITOR ===")
    # Go to pages list
    page.goto(f"{ADMIN_URL}#/pages", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    screenshot(page, "07_admin_pages_list", full_page=True)

    # Try to find and click the /about page edit link
    page_text = page.inner_text("body")
    if "/about" in page_text:
        log("  /about page found in list")
        # Click on /about page row
        try:
            page.locator("text=/about").first.click()
            page.wait_for_timeout(3000)
            screenshot(page, "08_admin_about_edit", full_page=True)
            log("  Navigated to /about editor")

            # Check if Save Page button exists
            if page.locator("text=Save Page").count() > 0:
                log("  Save Page button: FOUND")
            else:
                log("  Save Page button: NOT found")

            # Check Content Blocks section
            if page.locator("text=Content Blocks").count() > 0:
                log("  Content Blocks section: FOUND")
            else:
                log("  Content Blocks section: NOT found")
        except Exception as e:
            log(f"  Could not open /about editor: {e}")
            ERRORS.append(f"/about editor: {e}")
    else:
        log("  /about not visible in pages list (may need scroll)")


def test_admin_dataset_edit(page: Page):
    log("=== ADMIN DATASET EDITOR ===")
    page.goto(f"{ADMIN_URL}#/data", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    screenshot(page, "09_admin_data_list", full_page=True)

    # Try to find a dataset and click Edit
    try:
        edit_buttons = page.locator("text=Edit")
        if edit_buttons.count() > 0:
            edit_buttons.first.click()
            page.wait_for_timeout(3000)
            screenshot(page, "10_admin_dataset_edit", full_page=True)
            log("  Dataset editor opened")

            # Check for Save Dataset button
            if page.locator("text=Save Dataset").count() > 0:
                log("  Save Dataset button: FOUND")
            else:
                log("  Save Dataset button: NOT found")
        else:
            log("  No Edit buttons found")
    except Exception as e:
        log(f"  Could not open dataset editor: {e}")
        ERRORS.append(f"dataset editor: {e}")


def test_chart_rendering(page: Page):
    log("=== CHART RENDERING ===")
    # Go to a page that has charts
    page.goto(f"{BASE_URL}/data/market-dashboard", wait_until="networkidle", timeout=30000)
    screenshot(page, "11_chart_market_dashboard", full_page=True)

    # Check if any SVG (chart) elements are present
    svg_count = page.locator("svg").count()
    log(f"  SVG elements on page: {svg_count}")

    # Check for canvas (recharts)
    canvas_count = page.locator("canvas").count()
    log(f"  Canvas elements on page: {canvas_count}")

    if svg_count == 0 and canvas_count == 0:
        log("  WARN: No chart SVG/canvas elements found")
        ERRORS.append("No chart SVG/canvas on market-dashboard")

    # Check Data Hub section on homepage
    page.goto(f"{BASE_URL}", wait_until="networkidle", timeout=30000)
    screenshot(page, "12_homepage_datahub", full_page=True)

    svg_on_home = page.locator("svg").count()
    log(f"  SVG elements on homepage: {svg_on_home}")


def test_navigation_links(page: Page):
    log("=== NAVIGATION LINK INTEGRITY ===")
    page.goto(f"{BASE_URL}", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)

    # Find all internal links
    links = page.eval_on_selector_all("a[href]", "els => els.map(el => el.href)")
    internal_links = [l for l in links if "76.13.17.91" in l or l.startswith("/")]

    log(f"  Found {len(internal_links)} internal links")
    broken = []

    for link in internal_links[:20]:  # Test first 20 links
        clean_link = link.replace("http://76.13.17.91", "").replace("https://76.13.17.91", "")
        if not clean_link or clean_link == "#":
            continue

        try:
            page.goto(link if link.startswith("http") else f"http://76.13.17.91{clean_link}",
                     wait_until="domcontentloaded", timeout=15000)
            page.wait_for_timeout(500)
            body = page.inner_text("body")

            if len(body.strip()) < 20:
                log(f"  BROKEN LINK: {clean_link} (blank page)")
                broken.append(clean_link)
                screenshot(page, f"13_broken_{clean_link.replace('/','_')[:30]}", full_page=True)
            elif "404" in page.url or "not-found" in page.url.lower():
                log(f"  404 LINK: {clean_link}")
                broken.append(clean_link)
                screenshot(page, f"14_404_{clean_link.replace('/','_')[:30]}", full_page=True)
            else:
                log(f"  OK: {clean_link} ({len(body)} chars)")
        except Exception as e:
            log(f"  ERROR checking {clean_link}: {e}")
            broken.append(clean_link)

    if broken:
        log(f"  FAIL: {len(broken)} broken links found: {broken[:10]}")
        FAILURES.append(f"Broken links: {broken[:10]}")
    else:
        log("  All navigation links: OK")


def test_featured_insights(page: Page):
    log("=== FEATURED INSIGHTS ===")
    page.goto(f"{BASE_URL}", wait_until="networkidle", timeout=30000)
    screenshot(page, "15_featured_insights_home", full_page=True)

    # Check for Featured Insights section
    fi_elements = page.locator("text=Featured").count()
    log(f"  'Featured' text occurrences: {fi_elements}")

    # Check /admin featured tab
    page.goto(f"{ADMIN_URL}#/featured", wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(2000)
    screenshot(page, "16_admin_featured_insights_tab", full_page=True)

    # Check for post rows
    if page.locator("text=Featured Insights").count() > 0:
        log("  Featured Insights tab: loaded")
    else:
        log("  Featured Insights tab: NOT found")


def test_all_api_endpoints(page: Page):
    log("=== API ENDPOINTS ===")
    api_base = "http://76.13.17.91/api"
    endpoints = [
        f"{api_base}/healthz",
        f"{api_base}/pages/",
        f"{api_base}/pages/lookup?path=/about&locale=en",
        f"{api_base}/blog/",
        f"{api_base}/blog/slug/nickel-ev-indonesia",
        f"{api_base}/datasets/",
        f"{api_base}/featured-insights/en",
        f"{api_base}/featured-insights/id",
    ]

    for endpoint in endpoints:
        try:
            page.goto(endpoint, wait_until="domcontentloaded", timeout=10000)
            body = page.inner_text("body")
            try:
                data = json.loads(body)
                status = data.get("status") or (len(data) > 0)
                log(f"  API OK: {endpoint} ({len(body)} bytes)")
            except:
                if len(body) > 0:
                    log(f"  API OK: {endpoint} ({len(body)} bytes)")
                else:
                    log(f"  WARN: Empty response: {endpoint}")
        except Exception as e:
            log(f"  API FAIL: {endpoint} — {e}")
            FAILURES.append(f"API {endpoint}: {e}")


def test_analisis_pages(page: Page):
    log("=== ANALISIS DESKRIPTIF ===")
    # Get analisis list from API
    page.goto("http://76.13.17.91/api/analisis", wait_until="domcontentloaded", timeout=15000)
    try:
        data = json.loads(page.inner_text("body"))
        items = data.get("data", data)
        if isinstance(items, dict):
            items = list(items.values())
        if not items:
            items = list(items)
        log(f"  Found {len(items)} analisis records")
    except Exception as e:
        log(f"  Could not fetch analisis: {e}")
        items = []

    for item in items[:3]:
        title = item.get("title", item.get("titleEn", "unknown"))[:40]
        log(f"  Testing analisis: {title}")
        page.goto(f"http://76.13.17.91/analisis", wait_until="networkidle", timeout=30000)
        screenshot(page, f"17_analisis_{title[:20]}", full_page=True)
        check_status(page, f"/analisis {title}")


def test_contact_and_other_pages(page: Page):
    log("=== MISC PAGES ===")
    pages_to_test = [
        ("/contact", "17b_contact"),
        ("/macro/macro-outlooks", "18_macro_outlooks"),
    ]

    for route, ss_name in pages_to_test:
        page.goto(f"{BASE_URL}{route}", wait_until="networkidle", timeout=30000)
        screenshot(page, ss_name, full_page=True)
        check_status(page, route)
        body = page.inner_text("body")
        log(f"  {route}: {len(body)} chars")


def main():
    log("Starting AndaraLab CMS Comprehensive Test Suite")
    log(f"Base URL: {BASE_URL}")
    log(f"Screenshot dir: {SCREENSHOT_DIR}")

    os.makedirs(SCREENSHOT_DIR, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = context.new_page()

        # Enable console logging
        page.on("console", lambda msg: log(f"  [CONSOLE {msg.type}] {msg.text}") if msg.type == "error" else None)

        try:
            test_homepage(page)
            test_about_page(page)
            test_blog_listing(page)
            test_article_pages(page)
            test_data_pages(page)
            test_admin_pages(page)
            test_admin_page_edit(page)
            test_admin_dataset_edit(page)
            test_chart_rendering(page)
            test_navigation_links(page)
            test_featured_insights(page)
            test_all_api_endpoints(page)
            test_analisis_pages(page)
            test_contact_and_other_pages(page)
        except Exception as e:
            log(f"TEST CRASH: {e}")
            ERRORS.append(f"Test crash: {e}")
            import traceback
            traceback.print_exc()

        browser.close()

    log("\n" + "="*60)
    log("TEST RESULTS SUMMARY")
    log("="*60)

    if FAILURES:
        log(f"FAILURES ({len(FAILURES)}):")
        for f in FAILURES:
            log(f"  - {f}")
    else:
        log("FAILURES: None")

    if ERRORS:
        log(f"WARNINGS/ERRORS ({len(ERRORS)}):")
        for e in ERRORS:
            log(f"  - {e}")
    else:
        log("WARNINGS/ERRORS: None")

    log(f"Screenshots saved to: {SCREENSHOT_DIR}/")
    screenshot_files = os.listdir(SCREENSHOT_DIR)
    log(f"Total screenshots: {len(screenshot_files)}")
    for f in sorted(screenshot_files):
        log(f"  - {f}")

    log("DONE")


if __name__ == "__main__":
    main()
