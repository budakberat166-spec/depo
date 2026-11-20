# Shared helpers: finds a browser and FFmpeg on whichever computer this folder is on.
function Get-Browser {
    $c = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe")
    foreach ($p in $c) { if ($p -and (Test-Path $p)) { return $p } }
    throw 'Edge or Chrome not found'
}
function Get-Tool([string]$Name) {
    $g = Get-Command $Name -ErrorAction SilentlyContinue
    if ($g) { return $g.Source }
    $w = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "$Name.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($w) { return $w.FullName }
    throw "$Name not found. Install it with: winget install --id Gyan.FFmpeg -e"
}
function New-Shot([string]$Query, [string]$Png, [switch]$Transparent) {
    $root = $PSScriptRoot
    $prof = Join-Path $env:TEMP 'guney-haber-browser'
    $args2 = @('--headless=new','--disable-gpu','--hide-scrollbars','--allow-file-access-from-files',"--user-data-dir=$prof",'--window-size=1080,1920','--force-device-scale-factor=1','--timeout=25000','--virtual-time-budget=15000',"--screenshot=$Png")
    if ($Transparent) { $args2 += '--default-background-color=00000000' }
    $args2 += "file:///$(($root -replace '\\','/'))/card.html?$Query"
    Start-Process -FilePath (Get-Browser) -ArgumentList $args2 -Wait -WindowStyle Hidden
    if (-not (Test-Path $Png)) { throw "Could not render $Png" }
}
