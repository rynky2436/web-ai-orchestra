
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

echo [1/8] Copying application files...
xcopy /E /I /H /Y "%~dp0\..\*" "%INSTALL_DIR%\" /EXCLUDE:"%~dp0\build-exclude.txt" >nul

:: Download and install Python if not present
python --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [2/8] Downloading and installing Python %PYTHON_VERSION%...
    cd /d "%TEMP%"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/%PYTHON_VERSION%/python-%PYTHON_VERSION%-amd64.exe' -OutFile 'python-installer.exe'}"
    if exist "python-installer.exe" (
        python-installer.exe /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
        del python-installer.exe
        echo Python installed successfully!
    ) else (
        echo Failed to download Python installer
        pause
        exit /b 1
    )
) else (
    echo [2/8] Python is already installed
)

:: Download and install Node.js if not present
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [3/8] Downloading and installing Node.js %NODE_VERSION%...
    cd /d "%TEMP%"
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v%NODE_VERSION%/node-v%NODE_VERSION%-x64.msi' -OutFile 'node-installer.msi'}"
    if exist "node-installer.msi" (
        msiexec /i node-installer.msi /quiet
        del node-installer.msi
        echo Node.js installed successfully!
    ) else (
        echo Failed to download Node.js installer
        pause
        exit /b 1
    )
) else (
    echo [3/8] Node.js is already installed
)

:: Refresh environment variables
echo [4/8] Refreshing environment variables...
call :RefreshEnv

echo [5/8] Installing Python dependencies...
cd /d "%INSTALL_DIR%"
if exist "installer\requirements.txt" (
    python -m pip install --upgrade pip --quiet
    python -m pip install -r installer\requirements.txt --quiet
    echo Python dependencies installed successfully!
) else (
    echo Warning: requirements.txt not found
)

echo [6/8] Installing Node.js dependencies and building frontend...
cd /d "%INSTALL_DIR%"
if exist "package.json" (
    call npm install --silent
    call npm run build --silent
    echo Frontend built successfully!
) else (
    echo Warning: package.json not found, skipping frontend build
)

echo [7/8] Creating desktop shortcuts and start menu entries...
call "%~dp0\create-shortcuts.bat" "%INSTALL_DIR%"

echo [8/8] Setting up installation completion...

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

:: Create the completion HTML file for browser popup
call :CreateCompletionPage "%INSTALL_DIR%"

echo Opening installation completion page...
start "" "%INSTALL_DIR%\installation-complete.html"

echo.
echo Installation complete! The browser will show additional options.
echo You can start the platform anytime using the desktop shortcut.
echo.
pause
goto :eof

:RefreshEnv
:: Refresh environment variables without requiring restart
for /f "skip=2 tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "SYSTEM_PATH=%%b"
for /f "skip=2 tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "USER_PATH=%%b"
if defined SYSTEM_PATH if defined USER_PATH (
    set "PATH=%SYSTEM_PATH%;%USER_PATH%"
) else if defined SYSTEM_PATH (
    set "PATH=%SYSTEM_PATH%"
) else if defined USER_PATH (
    set "PATH=%USER_PATH%"
)
goto :eof

:CreateCompletionPage
set "COMPLETION_FILE=%~1\installation-complete.html"
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>AI Desktop Platform - Installation Complete^</title^>
echo     ^<style^>
echo         body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
echo         .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1^); text-align: center; }
echo         .success { color: #28a745; font-size: 24px; margin-bottom: 20px; }
echo         .button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 10px; font-size: 16px; text-decoration: none; display: inline-block; }
echo         .button:hover { background: #0056b3; }
echo         .button.success { background: #28a745; }
echo         .button.success:hover { background: #1e7e34; }
echo         .info { margin: 20px 0; padding: 15px; background: #e9ecef; border-radius: 5px; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="container"^>
echo         ^<div class="success"^>✅ Installation Complete!^</div^>
echo         ^<h2^>AI Desktop Platform^</h2^>
echo         ^<p^>Your AI Desktop Platform has been successfully installed and is ready to use.^</p^>
echo         
echo         ^<div class="info"^>
echo             ^<strong^>Installation Location:^</strong^>^<br^>
echo             %~1
echo         ^</div^>
echo         
echo         ^<button class="button success" onclick="startPlatform(^)"^>🚀 Start Platform Now^</button^>
echo         ^<button class="button" onclick="createDesktopShortcut(^)"^>🔗 Create Desktop Shortcut^</button^>
echo         ^<button class="button" onclick="openInstallFolder(^)"^>📁 Open Install Folder^</button^>
echo         
echo         ^<div class="info"^>
echo             ^<strong^>How to start later:^</strong^>^<br^>
echo             • Double-click the desktop shortcut "AI Desktop Platform"^<br^>
echo             • Or use the Start Menu entry^<br^>
echo             • Platform will be available at: ^<a href="http://localhost:7777"^>http://localhost:7777^</a^>
echo         ^</div^>
echo     ^</div^>
echo     
echo     ^<script^>
echo         function startPlatform(^) {
echo             fetch('file:///%~1/start-platform.bat'^).catch(^(^) =^> {
echo                 // Fallback: try to execute via shell
echo                 window.open('%~1\\start-platform.bat', '_blank'^);
echo             }^);
echo             setTimeout(^(^) =^> {
echo                 window.open('http://localhost:7777', '_blank'^);
echo             }, 3000^);
echo         }
echo         
echo         function createDesktopShortcut(^) {
echo             const desktopPath = '%USERPROFILE%\\Desktop';
echo             const shortcutPath = desktopPath + '\\AI Desktop Platform.lnk';
echo             alert('Desktop shortcut has been created automatically during installation!\\n\\nYou can find it on your desktop as "AI Desktop Platform"'^);
echo         }
echo         
echo         function openInstallFolder(^) {
echo             window.open('file:///%~1', '_blank'^);
echo         }
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > "%COMPLETION_FILE%"
goto :eof
