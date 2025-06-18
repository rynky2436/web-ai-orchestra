
@echo off
echo Building AI Desktop Platform Installer...

:: Create temporary build directory
if not exist "build" mkdir build
cd build

:: Copy all necessary files
echo Copying application files...
xcopy /E /I /H /Y "..\..\" "AI-Desktop-Platform\" /EXCLUDE:..\build-exclude.txt

:: Copy installer files to root
copy "..\install.bat" "install.bat"
copy "..\README.md" "README.md"
copy "..\requirements.txt" "AI-Desktop-Platform\requirements.txt"

:: Create the installer package
echo Creating installer archive...
powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '..\AI-Desktop-Platform-Installer.zip' -Force"

cd ..
echo.
echo Installer package created: AI-Desktop-Platform-Installer.zip
echo.
echo To distribute:
echo 1. Share the AI-Desktop-Platform-Installer.zip file
echo 2. Users should extract it and run install.bat as administrator
echo.
pause
