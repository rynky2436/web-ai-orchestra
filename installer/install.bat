
@echo off
setlocal enabledelayedexpansion

:: AI Desktop Platform - Windows Installer
:: This script installs all dependencies and sets up the platform

echo.
echo ========================================
echo   AI Desktop Platform - Installer
echo ========================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This installer requires administrator privileges.
    echo Please run as administrator.
    pause
    exit /b 1
)

:: Set installation directory
set "INSTALL_DIR=%USERPROFILE%\AI-Desktop-Platform"
set "PYTHON_VERSION=3.11.7"
set "NODE_VERSION=20.10.0"

echo Installing to: %INSTALL_DIR%
echo.

:: Create installation directory
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
cd /d "%INSTALL_DIR%"

:: Download and install Python if not present
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [1/6] Downloading and installing Python %PYTHON_VERSION%...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/%PYTHON_VERSION%/python-%PYTHON_VERSION%-amd64.exe' -OutFile 'python-installer.exe'}"
    python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    del python-installer.exe
    echo Python installed successfully!
) else (
    echo [1/6] Python is already installed
)

:: Download and install Node.js if not present
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [2/6] Downloading and installing Node.js %NODE_VERSION%...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi' -OutFile 'node-installer.msi'}"
    msiexec /i node-installer.msi /quiet
    del node-installer.msi
    echo Node.js installed successfully!
) else (
    echo [2/6] Node.js is already installed
)

:: Refresh environment variables
call refreshenv.cmd 2>nul || (
    echo Refreshing environment variables...
    for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH') do set "SYSTEM_PATH=%%b"
    for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH') do set "USER_PATH=%%b"
    set "PATH=%SYSTEM_PATH%;%USER_PATH%"
)

echo [3/6] Copying application files...
xcopy /E /I /H /Y "%~dp0\..\*" "%INSTALL_DIR%\" >nul

echo [4/6] Installing Python dependencies...
cd /d "%INSTALL_DIR%"
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo [5/6] Installing Node.js dependencies and building frontend...
cd /d "%INSTALL_DIR%"
if exist "package.json" (
    npm install
    npm run build
)

echo [6/6] Creating desktop shortcuts and start menu entries...
call "%~dp0\create-shortcuts.bat" "%INSTALL_DIR%"

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo The AI Desktop Platform has been installed to:
echo %INSTALL_DIR%
echo.
echo Desktop shortcut created: "AI Desktop Platform"
echo Start menu entry created under "AI Desktop Platform"
echo.
echo To start the platform, double-click the desktop icon
echo or run: "%INSTALL_DIR%\start-platform.bat"
echo.
pause
