param([int]$Card, [string]$Video, [string]$Out, [int]$MaxMB = 10, [double]$Start = 0)
# Puts a news video into the photo area of the template, keeping its sound.
. "$PSScriptRoot\arac.ps1"
$ffmpeg = Get-Tool 'ffmpeg'; $ffprobe = Get-Tool 'ffprobe'
$dir = Split-Path -Parent $Out
if ($dir) { New-Item -ItemType Directory -Force $dir | Out-Null }
$overlay = Join-Path $env:TEMP "guney-overlay-$Card.png"
if (Test-Path $overlay) { Remove-Item $overlay }
New-Shot -Query "i=$Card&hole=1" -Png $overlay -Transparent
$ci = [Globalization.CultureInfo]::InvariantCulture
$dur = [double]::Parse((& $ffprobe -v error -show_entries format=duration -of csv=p=0 $Video), $ci) - $Start
$hasAudio = [bool](& $ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 $Video)
$audioK = 128
$videoK = [Math]::Min(6000, [Math]::Floor(($MaxMB * 8192 * 0.92 / $dur) - $audioK))
$filter = "[0:v]scale=727:915:force_original_aspect_ratio=increase,crop=727:915,setsar=1,pad=1080:1920:179:67:black,fps=30[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[out]"
$a = @('-y','-v','error')
if ($Start -gt 0) { $a += @('-ss',$Start.ToString($ci)) }
$a += @('-i',$Video,'-loop','1','-i',$overlay,'-filter_complex',$filter,'-map','[out]')
if ($hasAudio) { $a += @('-map','0:a:0','-c:a','aac','-b:a',"$($audioK)k"); if ($Start -gt 0) { $a += @('-af','afade=t=in:d=0.4') } }
$a += @('-c:v','libx264','-profile:v','high','-preset','medium','-b:v',"$($videoK)k",'-maxrate',"$($videoK)k",'-bufsize',"$($videoK*2)k",'-movflags','+faststart','-t',$dur.ToString($ci),$Out)
& $ffmpeg @a
if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed: $LASTEXITCODE" }
"OK $Out seconds=$([Math]::Round($dur,1)) sizeMB=$([Math]::Round((Get-Item $Out).Length/1MB,2)) audio=$hasAudio"
