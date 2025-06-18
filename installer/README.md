
# AI Desktop Platform - Windows Installer

This installer package provides an easy way to install and set up the AI Desktop Platform on Windows systems.

## What it does:

1. **Installs Python 3.11.7** (if not already present)
2. **Installs Node.js 20.10.0** (if not already present)
3. **Installs all Python dependencies** required for the AI platform
4. **Installs and builds the React frontend**
5. **Creates desktop shortcut** for easy access
6. **Creates Start Menu entries** for the platform and configuration
7. **Sets up the complete environment** ready to use
8. **Optionally starts the server** immediately after installation

## System Requirements:

- Windows 10 or Windows 11
- Administrator privileges (required for installation)
- Internet connection (for downloading dependencies)
- At least 2GB free disk space

## Installation Instructions:

1. **Download** the complete AI Desktop Platform package
2. **Right-click** on `install.bat` and select **"Run as administrator"**
3. **Follow the prompts** - the installer will handle everything automatically
4. **Choose to start the server** when prompted after installation
5. **Wait for completion** - this may take 5-10 minutes depending on your internet speed

## After Installation:

- **Desktop shortcut**: Double-click "AI Desktop Platform" on your desktop
- **Start Menu**: Find "AI Desktop Platform" in your Start Menu
- **Web Interface**: The platform will open at http://localhost:7777
- **Auto-start**: Browser will open automatically when you launch the platform

## Running the Platform:

The platform runs as a local server on your computer:

1. **Start**: Double-click the desktop shortcut or run `start-platform.bat`
2. **Access**: Open http://localhost:7777 in your browser (opens automatically)
3. **Stop**: Close the command window that appears when starting

## Configuration:

- Use the "Configure Platform" shortcut to edit settings
- Configure your AI provider API keys in the web interface
- Enable/disable modules as needed

## Uninstalling:

- Use the "Uninstall" shortcut in the Start Menu
- Or run `uninstall.bat` from the installation directory

## Troubleshooting:

If you encounter issues:

1. **Make sure you ran as administrator**
2. **Check your internet connection**
3. **Disable antivirus temporarily** during installation
4. **Check Windows Defender** hasn't blocked any files
5. **Restart your computer** after installation if PATH issues occur

## Technical Details:

- **Backend**: Python-based AI processing server
- **Frontend**: React web application
- **Local Server**: Runs on localhost:7777
- **No Internet Required**: After installation, works offline (except for AI provider API calls)

## Support:

For support and updates, visit the project repository or contact support.

---

**AI Desktop Platform** - Revolutionary AI Automation System
