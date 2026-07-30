# CodeDrill Build Script
# Usage: .\scripts\build.ps1 [web|electron|android|all]

param(
    [Parameter(Position=0)]
    [ValidateSet("web", "electron", "android", "all")]
    [string]$Target = "all"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CodeDrill Build System" -ForegroundColor Cyan
Write-Host "Target: $Target" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Check environment
Write-Host "`n[1/4] Check environment..." -ForegroundColor Yellow
$nodeOk = Get-Command "node" -ErrorAction SilentlyContinue
if (-not $nodeOk) {
    Write-Host "ERROR: Node.js not installed" -ForegroundColor Red
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host "  Node.js: OK" -ForegroundColor Green

# Step 2: Build Web
if ($Target -in @("web", "all")) {
    Write-Host "`n[2/4] Build Web..." -ForegroundColor Yellow
    Push-Location $ProjectRoot
    try {
        npm run build
        Write-Host "  Web: OK" -ForegroundColor Green
    } catch {
        Write-Host "  Web build failed: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }
} else {
    Write-Host "`n[2/4] Skip Web build" -ForegroundColor Gray
}

# Step 3: Build Electron
if ($Target -in @("electron", "all")) {
    Write-Host "`n[3/4] Build Electron..." -ForegroundColor Yellow
    Push-Location $ProjectRoot
    try {
        $env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
        npx electron-builder --win portable --project electron
        Write-Host "  Electron: OK" -ForegroundColor Green
        Write-Host "  Output: electron\dist\CodeDrill-Portable.exe" -ForegroundColor Cyan
    } catch {
        Write-Host "  Electron build failed: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }
} else {
    Write-Host "`n[3/4] Skip Electron build" -ForegroundColor Gray
}

# Step 4: Done
Write-Host "`n[4/4] Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
