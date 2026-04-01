# AndaraLab CMS — Manual Testing Guide

## Overview

```
URL:        http://76.13.17.91
API Base:  http://76.13.17.91/api
Admin:     http://76.13.17.91/admin
Data Hub:  http://76.13.17.91/data
Blog:      http://76.13.17.91/blog
```

---

## Pre-Test: Verify System is Up

### 1. API Health Check

```bash
curl http://76.13.17.91/api/healthz
```

**Expected:**
```json
{"status":"ok"}
```

If not `"ok"`, the API server is down. SSH to VPS and restart:
```bash
ssh root@76.13.17.91
pm2 restart api-server
```

### 2. Check All Data Counts

```bash
curl http://76.13.17.91/api/datasets | jq '.meta.total'
curl http://76.13.17.91/api/blog      | jq '.meta.total'
curl http://76.13.17.91/api/pages     | jq '.meta.total'
```

**Expected:** `11` datasets, `14` blog posts, `14` pages

---

## Section 1: Homepage (`/`)

### Test Steps

1. Open browser → `http://76.13.17.91`
2. Verify page loads without spinner/loading screen
3. Check for the following elements:

| Element | Should Appear |
|---------|--------------|
| Hero section | "Independent Economic Research for Indonesia" |
| Stats bar | 24+ Macro Reports, 8 Sectors Covered, 28+ Years of Data |
| Featured articles | 3 article cards |
| GDP Growth chart | Line chart with quarterly data |
| CTA section | Email subscription form |
| Navbar | Home, Data Hub, About, Contact |

### API Test
```bash
# Homepage is a page at slug "/"
curl "http://76.13.17.91/api/pages/slug/%2F?locale=en" | jq '.title'
# Expected: "AndaraLab — Independent Economic Research for Indonesia"
```

---

## Section 2: Data Hub (`/data`)

### Test Steps

1. Navigate to `http://76.13.17.91/data`
2. Verify 11 dataset cards appear
3. Click each dataset card to open chart view

### Expected Dataset List

| # | Dataset Title | Type | Category |
|---|--------------|------|----------|
| 1 | Produksi Minyak Bumi & Gas Alam | Line | Sectoral Intelligence |
| 2 | Indonesia GDP Growth Rate | Line | Macro Foundations |
| 3 | Indonesia Inflation Rate | Area | Macro Foundations |
| 4 | Bank Indonesia Policy Rate | Bar | Macro Foundations |
| 5 | Indonesia Trade Balance | Bar | Sectoral Intelligence |
| 6 | IDR/USD Exchange Rate | Line | Market Dashboard |
| 7 | Produksi Nikel Indonesia | Area | Sectoral Intelligence |
| 8 | Ekonomi Digital Indonesia | Line | Market Dashboard |
| 9 | Imbal Hasil SBN Indonesia | Line | Financial Markets |
| 10 | Produksi Batu Bara Indonesia | Bar | Sectoral Intelligence |
| 11 | Foreign Direct Investment | Bar | Macro Foundations |

### API Test
```bash
curl http://76.13.17.91/api/datasets | jq '.data[].title'
```

### Test Individual Chart
```bash
# Click "Produksi Minyak Bumi & Gas Alam" → should show line chart with data from 1996-2024
curl http://76.13.17.91/api/datasets/oil-gas-production | jq '.rows | length'
# Expected: 28 rows (1996-2024)
```

### Test Filter by Category
```bash
curl "http://76.13.17.91/api/datasets?category=Sectoral%20Intelligence" | jq '.meta.total'
# Expected: 4 datasets
```

---

## Section 3: Blog (`/blog`)

### Test Steps

1. Navigate to `http://76.13.17.91/blog`
2. Verify article list loads
3. Click any article to read full content

### Expected Blog Posts (14 total)

| # | Title (EN) | Category | Status |
|---|-----------|----------|--------|
| 1 | What Is a Current Account Deficit... | economics-101 | Published |
| 2 | CPI vs. Core Inflation: Why Central Banks... | economics-101 | Published |
| 3 | JCI at 7,200: Why BI's Rate Hold... | market-pulse | Published |
| 4 | How We Build Our Macro Models... | lab-notes | Published |
| 5 | Indonesia's Nickel Dominance... | sectoral-analysis | Published |
| 6 | Indonesia's Digital Economy: Why 2026... | sectoral-analysis | Published |
| 7 | Understanding G20's New Bank Capital... | financial-markets | Published |
| 8 | Omnibus Law Two Years Later... | policy-analysis | Published |
| 9 | Indonesia Government Bond Market... | financial-markets | Published |
| 10 | Tax Reform 2026 Indonesia... | policy-analysis | Draft |
| 11 | Prospek Makro Indonesia 2026... | economics-101 | Published |
| 12 | Downstreaming Nikel Indonesia... | sectoral-analysis | Published |
| 13 | Menggenggam Inflasi Harga Pangan... | economics-101 | Published |
| 14 | Ekonomi Digital Indonesia... | sectoral-analysis | Published |

### API Test
```bash
# List all published posts
curl "http://76.13.17.91/api/blog?status=published" | jq '.meta.total'
# Expected: 13 (1 is draft)

# Test language filter
curl "http://76.13.17.91/api/blog?locale=id" | jq '.meta.total'
# Expected: 4 Indonesian posts
```

### Test Article Detail
```bash
# Click article → should show full body
curl "http://76.13.17.91/api/blog" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    const r=JSON.parse(d).data;
    const p=r[0];
    console.log('Title:', p.title);
    console.log('Excerpt:', p.excerpt);
    console.log('Body paragraphs:', p.body.length);
    console.log('Category:', p.category);
    console.log('Read time:', p.readTime);
  })
"
```

---

## Section 4: Pages (Navigation)

### Test Steps

Navigate to each page and verify content loads:

| Page | URL | Content to Verify |
|------|-----|-----------------|
| Home EN | `/` | Hero + GDP chart + 3 featured posts |
| Home ID | `/?lang=id` | Hero Indonesia + chart |
| About EN | `/about` | "Who We Are" section |
| Data Hub | `/data` | 11 dataset cards with charts |
| Energy Sector | `/sectors/energy` | Oil, Gas, Coal, Nickel charts |
| Finance Sector | `/sectors/finance` | SBN Yield + IDR/USD charts |
| Contact | `/contact` | Contact form / email CTA |

### API Test
```bash
# All published pages
curl http://76.13.17.91/api/pages?status=published | jq '.meta.total'
# Expected: 14

# About page content
curl "http://76.13.17.91/api/pages/slug/about?locale=en" | jq '.content[0]'
# Expected: {type: "hero", headline: "Who We Are"...}

# Pages by section
curl "http://76.13.17.91/api/pages?section=Sectoral%20Intelligence" | jq '.meta.total'
# Expected: 2 pages (Energy EN + ID)
```

---

## Section 5: CMS Admin Panel (`/admin`)

### Test Steps

1. Open `http://76.13.17.91/admin`
2. Verify 3 tabs appear: **Data Hub**, **Pages**, **Blog**
3. Data should load without error

---

### Tab 1: Data Hub

**Verify:**
- [ ] 11 dataset cards visible in grid
- [ ] Each card shows: title, category badge, chart type icon, unit
- [ ] Search/filter bar works
- [ ] "New Dataset" button exists

**Test Create New Dataset:**

1. Click **"+ New Dataset"**
2. Fill form:
   - Title: `Test Dataset`
   - Category: `Macro Foundations`
   - Chart Type: `bar`
   - Unit: `%`
   - Columns: `["Quarter", "Value"]`
   - Add a row: `Q1 2025`, `5.5`
3. Click **Save**
4. Verify new card appears in list
5. Verify API returns it:
   ```bash
   curl http://76.13.17.91/api/datasets | jq '.meta.total'
   # Should now be 12
   ```

**Test Edit Dataset:**

1. Click edit icon on any dataset card
2. Change Title (e.g., add "(Updated)")
3. Change Color to `#ff0000`
4. Add new row
5. Save
6. Click back to Data Hub
7. Verify changes reflected in card

**Test Delete Dataset:**

1. Click delete icon on the "Test Dataset" you created
2. Confirm deletion
3. Verify it's gone:
   ```bash
   curl http://76.13.17.91/api/datasets | jq '.meta.total'
   # Should be back to 11
   ```

**Test Reset:**

1. Make several changes to datasets
2. Click **"Reset to Default"** button
3. Confirm
4. Verify all datasets restored to original state

---

### Tab 2: Pages

**Verify:**
- [ ] List of all pages (EN + ID)
- [ ] Status badge (Published / Draft)
- [ ] Language badge (EN / ID)
- [ ] Edit and Delete buttons

**Test Edit Page:**

1. Click **Edit** on "About EN" page
2. Change Title to: `About AndaraLab — Research & Analysis`
3. Change description
4. Add a new content section (e.g., CTA)
5. Click Save
6. Go to `/about` in new tab
7. Verify changes appear

**Test Create New Page:**

1. Click **"+ New Page (EN)"**
2. Fill:
   - Slug: `/test-page`
   - Title: `Test Page`
   - Status: `Draft`
   - Section: `root`
3. Add content: Hero section
4. Save
5. Verify page exists:
   ```bash
   curl http://76.13.17.91/api/pages | jq '.meta.total'
   # Should be 15
   ```

**Test Delete Page:**
1. Delete "Test Page"
2. Verify count back to 14

---

### Tab 3: Blog

**Verify:**
- [ ] List of all blog posts
- [ ] Language toggle (EN / ID)
- [ ] Category badge
- [ ] Status badge

**Test Create New Blog Post:**

1. Click **"+ New Post (EN)"**
2. Fill form:
   - Slug: `test-post-2026`
   - Title: `Test Post — CMS Testing`
   - Status: `Draft`
   - Category: `economics-101`
   - Tag: `Testing`
   - Excerpt: `This is a test post from the CMS admin panel.`
   - Body: Add 3 paragraphs of text
   - Published Date: today's date
3. Save
4. Verify in list:
   ```bash
   curl http://76.13.17.91/api/blog | jq '.meta.total'
   # Should be 15
   ```

**Test Edit Blog Post:**

1. Click **Edit** on "Test Post — CMS Testing"
2. Change Status to `Published`
3. Add body paragraph
4. Save
5. Visit `/blog/test-post-2026`
6. Verify full content displayed

**Test Delete:**
1. Delete the test post
2. Verify count back to 14

**Test Link EN/ID:**
1. Open an English blog post
2. Click "Link to Indonesian Version"
3. Select matching Indonesian post
4. Save
5. Verify linked post icon appears

---

## Section 6: Language Toggle

### Test Steps

1. Go to `/data`
2. Toggle language to ID (if available)
3. Verify labels change (if localized content exists)

### API Language Test
```bash
# English pages
curl "http://76.13.17.91/api/pages?locale=en" | jq '.meta.total'
# Indonesian pages
curl "http://76.13.17.91/api/pages?locale=id" | jq '.meta.total'
```

---

## Section 7: CORS (API from Browser)

If accessing from a different domain:

```bash
curl -H "Origin: http://example.com" -i http://76.13.17.91/api/healthz
# Should include: Access-Control-Allow-Origin: http://example.com
```

---

## Section 8: Error Scenarios

### Test 404 on Dataset
```bash
curl http://76.13.17.91/api/datasets/nonexistent-id
# Expected: 404 Not Found
```

### Test Validation Error on Create
```bash
curl -X POST http://76.13.17.91/api/datasets \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'  # Missing required fields
# Expected: 400 Bad Request with validation error
```

### Test Delete Non-existent
```bash
curl -X DELETE http://76.13.17.91/api/datasets/99999
# Expected: 404 Not Found
```

---

## Section 9: Performance

### Response Time Test
```bash
time curl -s http://76.13.17.91/api/datasets > /dev/null
time curl -s http://76.13.17.91/api/blog > /dev/null
time curl -s http://76.13.17.91/api/pages > /dev/null
```

Expected: All responses under **500ms**

### Large Payload Test
```bash
curl http://76.76.13.17.91/api/datasets/oil-gas-production | jq '.rows | length'
# Expected: 28 rows
```

---

## Section 10: Deployment / VPS Commands

### Restart API Server
```bash
ssh root@76.13.17.91
pm2 restart api-server
```

### Check API Logs
```bash
ssh root@76.13.17.91
pm2 logs api-server --lines 50
```

### Pull Latest Code & Rebuild
```bash
ssh root@76.13.17.91
cd /opt/andara-lab
git pull origin main
pnpm --filter @workspace/api-server run build
pm2 restart api-server
# Rebuild frontend
pnpm --filter @workspace/andaralab run build
nginx -s reload
```

### Rebuild Frontend Only
```bash
ssh root@76.13.17.91
cd /opt/andara-lab
pnpm --filter @workspace/andaralab run build
nginx -s reload
```

### PM2 Status
```bash
ssh root@76.13.17.91
pm2 list
```

### Check Nginx Logs
```bash
ssh root@76.13.17.91
tail -20 /var/log/nginx/access.log
tail -20 /var/log/nginx/error.log
```

### VPS System Status
```bash
ssh root@76.13.17.91
uptime
df -h
free -m
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Blank page at `/admin` | API unreachable | Check PM2 status, restart if needed |
| Charts not showing | Wrong datasetId in page config | Check API `/api/pages` content sections |
| Changes not saving | API 500 error | Check PM2 logs |
| Slow response | Server load | Check `free -m` on VPS |
| 502 Bad Gateway | Nginx can't reach API | Check if PM2 is running |
| CORS error | Wrong origin | Add domain to `app.ts` CORS list |

---

## Quick Smoke Test (2 minutes)

Run this in terminal:

```bash
echo "=== 1. API Health ==="
curl -s http://76.13.17.91/api/healthz

echo ""
echo "=== 2. Dataset Count ==="
curl -s http://76.13.17.91/api/datasets | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total"

echo ""
echo "=== 3. Blog Post Count ==="
curl -s http://76.13.17.91/api/blog | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total"

echo ""
echo "=== 4. Pages Count ==="
curl -s http://76.13.17.91/api/pages | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).meta.total"

echo ""
echo "=== 5. Frontend HTML ==="
curl -s http://76.13.17.91/ | grep -o '<title>[^<]*</title>'

echo ""
echo "=== 6. Blog Post Titles ==="
curl -s http://76.13.17.91/api/blog | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).data.map(p=>p.title).join(', ')"

echo ""
echo "=== 7. Datasets by Category ==="
curl -s http://76.13.17.91/api/datasets | node -p "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')).data; const cats=[...new Set(d.map(x=>x.category))]; cats.forEach(c=>console.log(c,':',d.filter(x=>x.category===c).length))"
```

**Expected output:**
```
=== 1. API Health ===
{"status":"ok"}
=== 2. Dataset Count ===
11
=== 3. Blog Post Count ===
14
=== 4. Pages Count ===
14
=== 5. Frontend HTML ===
<title>AndaraLab</title>
```

---

Last updated: April 1, 2026
