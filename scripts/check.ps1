# CodeDrill Code Check Script
# Usage: .\scripts\check.ps1 [lint|format|all|fix]

param(
    [Parameter(Position=0)]
    [ValidateSet("lint", "format", "all", "fix")]
    [string]$Action = "all"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "CodeDrill Code Check - $Action" -ForegroundColor Cyan

Push-Location $ProjectRoot
try {
    switch ($Action) {
        "lint" {
            Write-Host "Running ESLint..." -ForegroundColor Yellow
            npm run lint
        }
        "format" {
            Write-Host "Checking Prettier format..." -ForegroundColor Yellow
            npm run format:check
        }
        "fix" {
            Write-Host "Auto fixing..." -ForegroundColor Yellow
            npm run lint:fix
            npm run format
            Write-Host "Fix complete" -ForegroundColor Green
        }
        "all" {
            Write-Host "Running full check..." -ForegroundColor Yellow
            Write-Host "`n[1/2] ESLint..." -ForegroundColor Gray
            npm run lint
            Write-Host "`n[2/2] Prettier..." -ForegroundColor Gray
            npm run format:check
            Write-Host "`nAll passed!" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Check failed: $_" -ForegroundColor Red
    Write-Host "`nPress any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
} finally {
    Pop-Location
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
