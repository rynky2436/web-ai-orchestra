
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

:: Check if we're in the right directory
if not exist "main_server.py" (
    echo Error: main_server.py not found
    echo Make sure you're running this from the correct directory.
    pause
    exit /b 1
)

:: Start the platform
echo Starting AI Desktop Platform...
echo.
echo Platform will be available at: http://localhost:7777
echo.
echo Opening browser in 5 seconds...
echo Close this window to stop the platform.
echo.

:: Start the Python server in the background
start /B python main_server.py

:: Wait a moment for server to start
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

:: Open the browser automatically
echo Opening browser...
start http://localhost:7777

echo.
echo AI Desktop Platform is now running!
echo.
echo - Web interface: http://localhost:7777
echo - Server console: Check the background process
echo.
echo Press any key to stop the platform...
pause >nul

:: Kill the Python process when user stops
echo Stopping platform...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *main_server*" 2>nul
taskkill /f /im python.exe /fi "COMMANDLINE eq *main_server.py*" 2>nul

echo.
echo Platform stopped.
pause
