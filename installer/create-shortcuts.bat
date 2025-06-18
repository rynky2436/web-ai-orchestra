
@echo off
setlocal

set "INSTALL_DIR=%~1"
set "DESKTOP=%USERPROFILE%\Desktop"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

if "%INSTALL_DIR%"=="" (
    echo Error: Installation directory not provided
    exit /b 1
)

:: Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\AI Desktop Platform.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\installer\start-platform.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'AI Desktop Platform - Revolutionary AI Automation'; $Shortcut.Save()}" 2>nul

:: Create start menu folder and shortcuts
if not exist "%STARTMENU%\AI Desktop Platform" mkdir "%STARTMENU%\AI Desktop Platform" 2>nul

:: Main application shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\AI Desktop Platform.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\installer\start-platform.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Start AI Desktop Platform'; $Shortcut.Save()}" 2>nul

:: Configuration shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\Configure Platform.lnk'); $Shortcut.TargetPath = 'notepad.exe'; $Shortcut.Arguments = '%INSTALL_DIR%\config\server_config.json'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Configure AI Desktop Platform'; $Shortcut.Save()}" 2>nul

:: Uninstall shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\Uninstall.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\installer\uninstall.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Uninstall AI Desktop Platform'; $Shortcut.Save()}" 2>nul

echo Shortcuts created successfully!
