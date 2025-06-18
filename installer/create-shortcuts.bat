
@echo off
setlocal

set "INSTALL_DIR=%1"
set "DESKTOP=%USERPROFILE%\Desktop"
set "STARTMENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

:: Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\AI Desktop Platform.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\start-platform.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\installer\icon.ico'; $Shortcut.Description = 'AI Desktop Platform - Revolutionary AI Automation'; $Shortcut.Save()}"

:: Create start menu folder and shortcuts
if not exist "%STARTMENU%\AI Desktop Platform" mkdir "%STARTMENU%\AI Desktop Platform"

:: Main application shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\AI Desktop Platform.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\start-platform.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.IconLocation = '%INSTALL_DIR%\installer\icon.ico'; $Shortcut.Description = 'Start AI Desktop Platform'; $Shortcut.Save()}"

:: Configuration shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\Configure Platform.lnk'); $Shortcut.TargetPath = 'notepad.exe'; $Shortcut.Arguments = '%INSTALL_DIR%\config\server_config.json'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Configure AI Desktop Platform'; $Shortcut.Save()}"

:: Uninstall shortcut
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%STARTMENU%\AI Desktop Platform\Uninstall.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\installer\uninstall.bat'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Uninstall AI Desktop Platform'; $Shortcut.Save()}"

echo Shortcuts created successfully!
