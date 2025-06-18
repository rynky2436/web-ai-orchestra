
# AI Desktop Platform - Windows Installer

This installer package provides an easy way to install and set up the AI Desktop Platform on Windows systems.

## Quick Start

1. **Extract** the installer package
2. **Right-click** on `install.bat` and select **"Run as administrator"**
3. **Follow the prompts** - installation takes 5-10 minutes
4. **Click "Start Platform Now"** in the browser popup after installation
5. **Access your platform** at http://localhost:7777

## What the Installer Does

1. **Installs Python 3.11.7** (if not already present)
2. **Installs Node.js 20.10.0** (if not already present)
3. **Installs all Python dependencies** required for the AI platform
4. **Installs and builds the React frontend**
5. **Creates desktop shortcut** for easy access
6. **Creates Start Menu entries** for the platform and configuration
7. **Sets up the complete environment** ready to use
8. **Opens browser with completion page** and shortcut options

## System Requirements

- **Windows 10 or Windows 11**
- **Administrator privileges** (required for installation)
- **Internet connection** (for downloading dependencies)
- **At least 2GB free disk space**

## Installation Process

The installer will:
- Download and install Python and Node.js automatically
- Set up all dependencies and build the frontend
- Create shortcuts and start menu entries
- Show a completion page with launch options
- Optionally start the platform immediately

## After Installation

### Starting the Platform
- **Desktop shortcut**: Double-click "AI Desktop Platform" on your desktop
- **Start Menu**: Find "AI Desktop Platform" in your Start Menu
- **Direct launch**: The completion page provides a "Start Platform Now" button

### Accessing the Platform
- **Web Interface**: http://localhost:7777 (opens automatically)
- **Auto-start**: Browser opens automatically when you launch the platform
- **Local Server**: Runs completely on your computer

### Configuration
- Use the "Configure Platform" shortcut to edit settings
- Configure your AI provider API keys in the web interface
- Enable/disable modules as needed through the web interface

## How It Works

The platform consists of:
- **Backend**: Python-based AI processing server (`main_server.py`)
- **Frontend**: React web application
- **Local Server**: Runs on localhost:7777
- **No Internet Required**: Works offline after installation (except for AI provider API calls)

## Managing the Platform

### Starting
1. Use the desktop shortcut or Start Menu entry
2. The platform launches a command window (don't close it)
3. Browser automatically opens to http://localhost:7777

### Stopping
- Close the command window that appears when starting
- Or press any key in the command window when prompted

### Uninstalling
- Use the "Uninstall" shortcut in the Start Menu
- Or run `uninstall.bat` from the installation directory

## Troubleshooting

### Common Issues
1. **"Run as administrator" required**: The installer needs admin privileges to install Python/Node.js
2. **Antivirus blocking**: Temporarily disable antivirus during installation
3. **Windows Defender**: Allow the installer files if blocked
4. **PATH issues**: Restart your computer if environment variables aren't updated
5. **Port 7777 in use**: Close other applications using port 7777

### Installation Problems
- **Internet connection**: Required for downloading Python/Node.js
- **Disk space**: Ensure at least 2GB free space
- **Existing installations**: The installer will detect and skip if Python/Node.js already installed

### Runtime Issues
- **Server won't start**: Check if Python is properly installed
- **Browser won't open**: Manually navigate to http://localhost:7777
- **Module errors**: Check that all dependencies installed correctly

## Technical Details

### Installation Directory
- **Default location**: `%USERPROFILE%\AI-Desktop-Platform`
- **Customizable**: Can be modified in the installer script

### Dependencies Installed
- **Python 3.11.7**: For running the AI processing backend
- **Node.js 20.10.0**: For building the React frontend
- **Python packages**: Listed in `requirements.txt`
- **Node packages**: Listed in `package.json`

### Files Created
- Desktop shortcut: "AI Desktop Platform"
- Start Menu folder: "AI Desktop Platform"
- Installation completion page (temporary)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify system requirements are met
3. Try running the installer again as administrator
4. Check the installation logs for specific errors

---

**AI Desktop Platform** - Revolutionary AI Automation System
