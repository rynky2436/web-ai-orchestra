
@echo off
echo Building AI Desktop Platform Installer...

:: Create temporary build directory
if exist "build" rmdir /S /Q "build"
mkdir build
cd build

:: Copy all necessary files
echo Copying application files...
xcopy /E /I /H /Y "..\..\" "AI-Desktop-Platform\" /EXCLUDE:..\build-exclude.txt

:: Ensure installer directory exists in the package
if not exist "AI-Desktop-Platform\installer" mkdir "AI-Desktop-Platform\installer"

:: Copy installer files to the package
copy "..\install.bat" "AI-Desktop-Platform\installer\install.bat"
copy "..\start-platform.bat" "AI-Desktop-Platform\installer\start-platform.bat"
copy "..\create-shortcuts.bat" "AI-Desktop-Platform\installer\create-shortcuts.bat"
copy "..\uninstall.bat" "AI-Desktop-Platform\installer\uninstall.bat"
copy "..\requirements.txt" "AI-Desktop-Platform\installer\requirements.txt"
copy "..\README.md" "AI-Desktop-Platform\installer\README.md"
copy "..\build-exclude.txt" "AI-Desktop-Platform\installer\build-exclude.txt"

:: Copy installer files to root for easy access
copy "..\install.bat" "install.bat"
copy "..\README.md" "README.md"

:: Create installation instructions
echo Creating installation instructions...
(
echo ========================================
echo   AI Desktop Platform - Installation
echo ========================================
echo.
echo 1. Right-click on install.bat
echo 2. Select "Run as administrator"
echo 3. Follow the installation prompts
echo 4. The platform will be available at http://localhost:7777
echo.
echo For more information, see README.md
) > "INSTALL-INSTRUCTIONS.txt"

:: Create the installer package
echo Creating installer archive...
powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '..\AI-Desktop-Platform-Installer.zip' -Force"

cd ..
echo.
echo ========================================
echo   Installer Package Created Successfully!
echo ========================================
echo.
echo Package: AI-Desktop-Platform-Installer.zip
echo.
echo To distribute:
echo 1. Share the AI-Desktop-Platform-Installer.zip file
echo 2. Users should extract it and run install.bat as administrator
echo 3. The installer will handle all dependencies and setup
echo.
pause
