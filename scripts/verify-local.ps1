# CodeDrill 本机验收脚本（Windows）
# 用法: 在仓库根目录 powershell 运行  .\scripts\verify-local.ps1
# 或:   powershell -File scripts\verify-local.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Write-Host "== CodeDrill local verify ==" -ForegroundColor Cyan

Write-Host "[1/4] unit tests (vitest)" -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -ne 0) { throw "vitest failed" }

Write-Host "[2/4] vite build" -ForegroundColor Yellow
npm run build:www
if ($LASTEXITCODE -ne 0) { throw "build failed" }

$theme = Join-Path $root "dist\web\theme-images"
$css = Join-Path $root "dist\web\preview-theme.css"
$idx = Join-Path $root "dist\web\index.html"
$iconPng = Join-Path $root "resources\icon.png"
$iconIco = Join-Path $root "resources\icon.ico"

Write-Host "[3/4] artifact checks" -ForegroundColor Yellow
if (!(Test-Path $theme)) { throw "missing $theme" }
if (!(Test-Path $css)) { throw "missing $css" }
if (!(Select-String -Path $idx -Pattern "preview-theme" -Quiet)) { throw "index.html missing preview-theme link" }
if (!(Test-Path $iconPng)) { throw "missing icon.png" }
if (!(Test-Path $iconIco)) { throw "missing icon.ico" }
Write-Host "  theme-images: OK ($((Get-ChildItem $theme).Count) files)"
Write-Host "  preview-theme.css: OK"
Write-Host "  icons: OK"

Write-Host "[4/4] electron pack (optional, may take minutes)" -ForegroundColor Yellow
$doPack = $env:CODEDRILL_ELECTRON_PACK
if ($doPack -eq "1") {
  npm run electron:pack
  Write-Host "Pack done. Check dist/electron for icon."
} else {
  Write-Host "Skip electron pack. Set CODEDRILL_EVERIFY=1 or CODEDRILL_ELECTRON_PACK=1 to run."
}

Write-Host "== LOCAL VERIFY PASSED (UI theme/icon eyes-on still required for #2/#3) ==" -ForegroundColor Green
