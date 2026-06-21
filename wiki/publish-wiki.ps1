# Publish wiki pages to GitHub (PowerShell)
# Before first run:
# 1. Settings → General → Features → enable Wiki
# 2. Create the first page via GitHub (can be empty)

$ErrorActionPreference = "Stop"
$Repo = "ziffmafiya/zambretti_sager"
$WikiDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TempDir = Join-Path $env:TEMP "zambretti_sager_wiki_$(Get-Random)"

Write-Host "Cloning wiki repository..."
git clone "https://github.com/$Repo.wiki.git" $TempDir

Write-Host "Copying wiki pages..."
Copy-Item "$WikiDir\*.md" $TempDir

Push-Location $TempDir
git add -A
git status

$diff = git diff --cached --quiet 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "No changes to publish."
    Pop-Location
    Remove-Item -Recurse -Force $TempDir
    exit 0
}

git commit -m "docs: update wiki pages"
git push origin master 2>$null
if ($LASTEXITCODE -ne 0) { git push origin main }

Write-Host "Wiki published successfully!"
Pop-Location
Remove-Item -Recurse -Force $TempDir
