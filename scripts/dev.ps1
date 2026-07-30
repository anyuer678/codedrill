# CodeDrill Dev Script
# Usage: .\scripts\dev.ps1 [web|electron|all]

param(
    [Parameter(Position=0)]
    [ValidateSet("web", "electron", "all")]
    [string]$Target = "web"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "CodeDrill Dev Mode - $Target" -ForegroundColor Cyan

Push-Location $ProjectRoot
try {
    switch ($Target) {
        "web" {
            Write-Host "Starting Web dev server (localhost:3000)..." -ForegroundColor Yellow
            npm run dev
        }
        "electron" {
            Write-Host "Starting Electron dev mode..." -ForegroundColor Yellow
            npm run electron:dev
        }
        "all" {
            Write-Host "Starting all platforms..." -ForegroundColor Yellow
            npm run electron:dev
        }
    }
} catch {
    Write-Host "Start failed: $_" -ForegroundColor Red
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
} finally {
    Pop-Location
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
