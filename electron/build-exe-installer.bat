@echo off
echo Building CodeDrill Installer...
cd /d "%~dp0\.."
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
call npx electron-builder --win --project electron
echo.
echo Build complete!
echo Output: electron\dist\CodeDrill Setup *.exe
pause
