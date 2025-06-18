
@echo off
setlocal

set "INSTALL_DIR=%USERPROFILE%\AI-Desktop-Platform"
set "DESKTOP=%USERPROFILE%\Desktop"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

echo.
echo ========================================
echo   AI Desktop Platform - Uninstaller
echo ========================================
echo.

echo This will remove the AI Desktop Platform from your computer.
echo Installation directory: %INSTALL_DIR%
echo.
set /p confirm="Are you sure you want to uninstall? (Y/N): "

if /I "%confirm%" neq "Y" (
    echo Uninstall cancelled.
    pause
    exit /b 0
)

echo.
echo Removing application files...
if exist "%INSTALL_DIR%" (
    rmdir /S /Q "%INSTALL_DIR%" 2>nul
    echo Application files removed.
)

echo Removing shortcuts...
if exist "%DESKTOP%\AI Desktop Platform.lnk" (
    del "%DESKTOP%\AI Desktop Platform.lnk"
    echo Desktop shortcut removed.
)

if exist "%STARTMENU%\AI Desktop Platform" (
    rmdir /S /Q "%STARTMENU%\AI Desktop Platform"
    echo Start menu entries removed.
)

echo.
echo ========================================
echo   Uninstall Complete!
echo ========================================
echo.
echo The AI Desktop Platform has been removed from your computer.
echo.
echo Note: Python and Node.js were not removed as they may be
echo used by other applications.
echo.
pause
