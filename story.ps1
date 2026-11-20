param([int]$Card, [string]$Out)
# Renders card number $Card from cards.js as a 1080x1920 photo story.
. "$PSScriptRoot\arac.ps1"
$dir = Split-Path -Parent $Out
if ($dir) { New-Item -ItemType Directory -Force $dir | Out-Null }
New-Shot -Query "i=$Card" -Png $Out
"OK $Out"
