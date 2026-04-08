@echo off
setlocal EnableDelayedExpansion

title Andara Lab - Playwright Automation Runner

echo.
echo ============================================================
echo   ANDARA LAB - PLAYWRIGHT AUTOMATION TEST + VIDEO RECORDER
echo ============================================================
echo.

:: Navigate to project root
cd /d "%~dp0.."

echo [STEP 1] Checking Playwright browsers...
call npx playwright install chromium --with-deps 2>nul
echo.

echo [STEP 2] Starting dev server in background...
start /B cmd /C "cd /d artifacts\andaralab && npx vite --port 5173 2>nul"
echo Waiting 8 seconds for dev server to boot...
timeout /t 8 /nobreak >nul
echo.

echo [STEP 3] Running Playwright automation tests with video recording...
echo          Tests: Contact Form (15x) + Admin Blog Posts + Navigation
echo.
call npx playwright test tests\automation.spec.ts --config tests\playwright.config.ts --reporter=list

echo.
echo [STEP 4] Converting WebM recordings to MP4...
call node tests\convert-videos.mjs

echo.
echo ============================================================
echo   TEST COMPLETE!
echo   Reports : test-results\
echo   Videos  : test-recordings-mp4\
echo   HTML    : playwright-report\index.html
echo ============================================================
echo.

:: Open output folder
explorer test-recordings-mp4

pause
