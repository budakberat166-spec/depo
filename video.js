// Linux/bulut (mobil oturum) için video story üretici. Windows'taki video.ps1'in karşılığı.
// Kullanım: node video.js <kart-no> <video.mp4> <cikti.mp4> [baslangic-saniye] [max-MB]
// Haberin videosunu şablonun fotoğraf alanına yerleştirir, sesi korur.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

(async () => {
  const [card, video, out, startArg = '0', maxArg = '10'] = process.argv.slice(2);
  if (!card || !video || !out) {
    console.error('Kullanım: node video.js <kart-no> <video.mp4> <cikti.mp4> [baslangic-saniye] [max-MB]');
    process.exit(1);
  }
  for (const t of ['ffmpeg', 'ffprobe']) {
    try { execFileSync('which', [t]); } catch { throw new Error(`${t} bulunamadı. Kur: sudo apt-get install -y ffmpeg`); }
  }
  const start = parseFloat(startArg), maxMB = parseFloat(maxArg);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });

  // 1) Şablonu fotoğraf alanı şeffaf olacak şekilde PNG'ye çiz.
  const overlay = path.join(os.tmpdir(), `guney-overlay-${card}.png`);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'card.html') + `?i=${card}&hole=1`);
  await page.waitForFunction(() => document.title === 'ready', null, { timeout: 30000 });
  await page.screenshot({ path: overlay, omitBackground: true });
  await browser.close();

  // 2) Süre, ses ve bit hızı.
  const probe = (args) => execFileSync('ffprobe', ['-v', 'error', ...args, video]).toString().trim();
  const dur = parseFloat(probe(['-show_entries', 'format=duration', '-of', 'csv=p=0'])) - start;
  if (!(dur > 0)) throw new Error('Video süresi okunamadı ya da başlangıç saniyesi videodan uzun.');
  const hasAudio = probe(['-select_streams', 'a', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0']) !== '';
  const audioK = 128;
  const videoK = Math.min(6000, Math.floor((maxMB * 8192 * 0.92) / dur - audioK));

  // 3) Videoyu 727x915 alana kırp, şablonu üstüne bindir.
  const filter = '[0:v]scale=727:915:force_original_aspect_ratio=increase,crop=727:915,setsar=1,pad=1080:1920:179:67:black,fps=30[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[out]';
  const a = ['-y', '-v', 'error'];
  if (start > 0) a.push('-ss', String(start));
  a.push('-i', video, '-loop', '1', '-i', overlay, '-filter_complex', filter, '-map', '[out]');
  if (hasAudio) {
    a.push('-map', '0:a:0', '-c:a', 'aac', '-b:a', `${audioK}k`);
    if (start > 0) a.push('-af', 'afade=t=in:d=0.4');
  }
  a.push('-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-b:v', `${videoK}k`, '-maxrate', `${videoK}k`,
    '-bufsize', `${videoK * 2}k`, '-movflags', '+faststart', '-t', String(dur), out);
  execFileSync('ffmpeg', a, { stdio: 'inherit' });

  const mb = fs.statSync(out).size / 1048576;
  console.log(`OK ${out} seconds=${dur.toFixed(1)} sizeMB=${mb.toFixed(2)} audio=${hasAudio}`);
})().catch(e => { console.error(e.message || e); process.exit(1); });
