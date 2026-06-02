@echo off
setlocal enabledelayedexpansion
REM ─────────────────────────────────────────────────────────────────────
REM  Rukn — shut down the PHP server and MySQL.
REM ─────────────────────────────────────────────────────────────────────

title Rukn — stopping...

echo.
echo  Stopping Rukn.
echo  --------------

REM Auto-detect XAMPP for the MySQL stop command.
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
  if exist "%%~P\mysql_stop.bat" (
    set "XAMPP_DIR=%%~P"
    goto :found
  )
)
echo  XAMPP not found — only stopping PHP server.
goto :stop_php

:found
echo  [1/2] Stopping MySQL...
call "%XAMPP_DIR%\mysql_stop.bat" >nul 2>&1

:stop_php
echo  [2/2] Stopping PHP server on port 8000...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%P >nul 2>&1
)

echo.
echo  Done.
timeout /t 2 /nobreak >nul
exit
