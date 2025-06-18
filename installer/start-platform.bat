
@echo off
setlocal

:: AI Desktop Platform Launcher
cd /d "%~dp0"

echo.
echo ========================================
echo   Starting AI Desktop Platform...
echo ========================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please run the installer again.
    pause
    exit /b 1
)

:: Start the platform
echo Starting AI Desktop Platform...
echo.
echo Platform will be available at: http://localhost:7777
echo.
echo Close this window to stop the platform.
echo.

python start.py

echo.
echo Platform stopped.
pause
