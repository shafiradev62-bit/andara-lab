#!/usr/bin/env python3
"""Currency Unit Format Test — saves PNG screenshots to ./screenshots/"""

import asyncio
import os
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SCREENSHOTS_DIR = "./screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

BASE_URL = "http://76.13.17.91"
API_URL = "http://76.13.17.91:3001"


async def screenshot(page, path):
    full = os.path.join(SCREENSHOTS_DIR, path)
    await page.screenshot(path=full, full_page=True)
    print(f"  >> saved: {full}")
    return full


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        page.on("console", lambda msg: print(f"  [CONSOLE ERROR] {msg.text}") if msg.type == "error" else None)

        print("=== Currency Unit Format Test ===\n")

        # 0. API verify first
        print("[0] API unitType verification...")
        api_resp = await ctx.request.get(f"{API_URL}/api/datasets", timeout=10000)
        data = await api_resp.json()
        idr_datasets = []
        usd_datasets = []
        for ds in data["data"]:
            ut = ds.get("unitType", "MISSING")
            unit = ds.get("unit", "")
            label = f"  {ds['id'][:28]:28s} unitType={ut:15s} unit={unit}"
            print(label)
            if ut == "currency_idr":
                idr_datasets.append(ds)
            elif ut == "currency_usd":
                usd_datasets.append(ds)

        print(f"\n  IDR datasets: {[d['id'] for d in idr_datasets]}")
        print(f"  USD datasets: {[d['id'] for d in usd_datasets]}")

        # 1. Homepage
        print("\n[1] Homepage...")
        await page.goto(f"{BASE_URL}", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        await screenshot(page, "01_homepage.png")

        # 2. DataHub list page
        print("\n[2] Data Hub list page...")
        await page.goto(f"{BASE_URL}/data/market-dashboard", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        await screenshot(page, "02_datahub_market.png")

        # 3. Navigate to each IDR dataset page
        print("\n[3] IDR dataset detail pages...")
        for i, ds in enumerate(idr_datasets[:3]):
            try:
                await page.goto(f"{BASE_URL}/data/{ds['id']}", wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(2000)
                await screenshot(page, f"03_idr_{i+1}_{ds['id']}.png")
                print(f"  IDR {ds['id']} saved")
            except Exception as e:
                print(f"  ERR IDR {ds['id']}: {e}")

        # 4. Navigate to each USD dataset page
        print("\n[4] USD dataset detail pages...")
        for i, ds in enumerate(usd_datasets[:3]):
            try:
                await page.goto(f"{BASE_URL}/data/{ds['id']}", wait_until="domcontentloaded", timeout=20000)
                await page.wait_for_timeout(2000)
                await screenshot(page, f"04_usd_{i+1}_{ds['id']}.png")
                print(f"  USD {ds['id']} saved")
            except Exception as e:
                print(f"  ERR USD {ds['id']}: {e}")

        # 5. Admin panel
        print("\n[5] Admin panel — unit type editor...")
        await page.goto(f"{BASE_URL}/admin", wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        await screenshot(page, "05_admin.png")

        # Try to find a dataset row and click it
        try:
            rows = await page.query_selector_all("tr, [class*='border']")
            print(f"  Found {len(rows)} rows/elements in admin table")
            for row in rows[:5]:
                txt = await row.inner_text()
                if len(txt) > 10:
                    print(f"    row: {txt[:60]}")
        except Exception as e:
            print(f"  Admin row scan: {e}")

        print("\n=== COMPLETE ===")
        print(f"Screenshots: {SCREENSHOTS_DIR}/")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(run())
