@echo off
echo Building CodeDrill Portable EXE...
cd /d "%~dp0"

echo Cleaning...
if exist dist rmdir /s /q dist
if exist web rmdir /s /q web

echo Copying web files...
xcopy /s /e /i /y "..\dist\web" "web"

echo Building...
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
call npx electron-builder --win portable

echo.
echo Build complete!
echo Output: dist\CodeDrill-Portable.exe
pause
