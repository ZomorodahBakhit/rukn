@echo off
setlocal enabledelayedexpansion
REM ─────────────────────────────────────────────────────────────────────
REM  Rukn — one-click boot
REM  Works for anyone with XAMPP installed, anywhere on disk.
REM
REM  What it does:
REM    1. Finds XAMPP on this machine (checks common install paths)
REM    2. Starts MySQL (skipped if already running)
REM    3. Imports database/schema.sql if 'rukn' database is missing
REM    4. Starts PHP built-in server in this folder on port 8000
REM    5. Opens the app in your default browser
REM
REM  No htdocs copy required. No Apache required. Just MySQL + PHP.
REM ─────────────────────────────────────────────────────────────────────

title Rukn — booting...

REM Project root is wherever this batch file lives.
set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo.
echo  ============================================================
echo   Rukn — booting up
echo   Project: %PROJECT_DIR%
echo  ============================================================
echo.

REM ── 1. Find XAMPP ────────────────────────────────────────────────
set "XAMPP_DIR="
for %%P in (
  "C:\xampp1"
  "C:\xampp"
  "C:\xampp7"
  "C:\xampp8"
  "D:\xampp"
  "C:\Program Files\xampp"
  "C:\Program Files (x86)\xampp"
) do (
  if exist "%%~P\php\php.exe" if exist "%%~P\mysql\bin\mysql.exe" (
    set "XAMPP_DIR=%%~P"
    goto :xampp_found
  )
)

echo  [x] Could not find XAMPP on this machine.
echo      Expected one of:
echo        C:\xampp\, C:\xampp1\, D:\xampp\, ...
echo      Install XAMPP from https://www.apachefriends.org/
echo      then run this script again.
echo.
pause
exit /b 1

:xampp_found
echo  [1/4] Found XAMPP at: %XAMPP_DIR%

set "PHP=%XAMPP_DIR%\php\php.exe"
set "MYSQL=%XAMPP_DIR%\mysql\bin\mysql.exe"
set "MYSQL_START=%XAMPP_DIR%\mysql_start.bat"

REM ── 2. Ensure MySQL is running ───────────────────────────────────
"%MYSQL%" -u root -e "SELECT 1;" >nul 2>&1
if %errorlevel%==0 (
  echo  [2/4] MySQL is already running.
) else (
  echo  [2/4] MySQL is not running — starting it now...
  start "MySQL (Rukn)" /MIN "%MYSQL_START%"

  REM Wait up to 15 seconds for MySQL to come online.
  set /a TRIES=0
  :wait_mysql
  set /a TRIES+=1
  timeout /t 1 /nobreak >nul
  "%MYSQL%" -u root -e "SELECT 1;" >nul 2>&1
  if %errorlevel%==0 goto :mysql_up
  if !TRIES! lss 15 goto :wait_mysql

  echo  [x] MySQL did not come online within 15 seconds.
  echo      Open the XAMPP Control Panel and start MySQL manually,
  echo      then re-run this script.
  pause
  exit /b 1
  :mysql_up
  echo       MySQL is up.
)

REM ── 3. Import schema if 'rukn' database is missing ───────────────
"%MYSQL%" -u root -e "USE rukn;" >nul 2>&1
if %errorlevel%==0 (
  echo  [3/4] Database 'rukn' already exists — skipping import.
) else (
  echo  [3/4] Database 'rukn' is missing — importing schema...
  "%MYSQL%" -u root < "%PROJECT_DIR%\database\schema.sql"
  if errorlevel 1 (
    echo  [x] Schema import failed.
    pause
    exit /b 1
  )
  echo       Schema imported, seed data loaded.
)

REM ── 4. Start PHP built-in server and open the browser ────────────
echo  [4/4] Starting PHP server at http://localhost:8000
echo.
echo  Opening browser at http://localhost:8000/RUKN/Homepage.html
start "" "http://localhost:8000/RUKN/Homepage.html"

echo.
echo  ============================================================
echo   Rukn is running.
echo   Press Ctrl+C in this window to stop the server.
echo  ============================================================
echo.

cd /d "%PROJECT_DIR%"
"%PHP%" -S localhost:8000

endlocal
