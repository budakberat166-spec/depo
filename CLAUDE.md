# Güney Haber story üretimi

Bu klasör, kullanıcının Instagram'daki Güney Haber sayfası (`guneyhaberr`) için story üretir. Kullanıcıyla Türkçe ve samimi konuş ("kanka" diyor), kısa ve net yaz.

## Kullanıcının istedikleri

1. **İletilen haberler:** Kullanıcı kendisine gelen haberleri (basın açıklaması, metin, link, fotoğraf, video) iletir. Bunu haber diline çevir, şablona dök, dosyayı geri ver.
2. **2 saatte bir tarama:** İnterneti tarayıp güncel haberleri kullanıcıya gönder. Bu görev bu bilgisayarda henüz kurulmadı (bkz. "İlk açılışta").
3. **Paylaşım kullanıcıda:** Instagram'ı açma, hesap değiştirme, paylaşım yapma. Kullanıcı "paylaşımı bana bırak" dedi. Dosyayı ve kontrol edemediğin noktaları ver, telefondan o paylaşır.

## İlk açılışta

Kullanıcı bu klasörü yeni bilgisayarda ilk açtığında sırayla:
1. Şunları kontrol et: `arac.ps1` içindeki `Get-Browser` (Edge veya Chrome) ve FFmpeg. FFmpeg yoksa kullanıcıya sorup `winget install --id Gyan.FFmpeg -e` ile kur.
2. `story.ps1 -Card 0 -Out test.png` ile deneme üret, internet bağlantısı fontlar için gerekli. Sonucu kontrol et.
3. Tarama saatlerini kullanıcıya sor (öneri: 08.00-22.00 arası, 2 saatte bir), sonra zamanlanmış görev kur. Görev yalnızca uygulama açıkken çalışır, bunu söyle. Görevin metni aşağıdaki kuralları içermeli, çünkü her çalışma sıfırdan başlar.

## Haber karışımı

Ağırlık Siirt'te olsun, araya önemli ve çok konuşulan Türkiye ve dünya haberleri girsin. Günlük öneri: 5-6 Siirt, 2-3 Türkiye veya dünya. Yeterli yerel haber yoksa zayıf haberle doldurma.

## Tarama kaynakları

- Siirt: artisiirt.com, dha.com.tr/siirt-haber, yenisiirt.com, kanal56.net, haberler.com/siirt
- Türkiye: Anadolu Ajansı "Gündem Özeti" (sondakika.com veya haberler.com'da yayımlanır), memurlar.net gündem başlıkları
- Dünya: aa.com.tr "Morning Briefing", euronews

Tarama sonucunda daha önce gönderilmemiş haberleri, başlık, kısa özet ve kaynak linkiyle listele. Hangi haberlerin önceden gönderildiğini `gonderilen-haberler.txt` dosyasında tut. "En çok konuşulan" için elinde trend ölçümü olmadığını, seçimin ajans ve site manşetlerine dayandığını unutma.

## Yazım kuralları

- Ham metni, özellikle resmi basın açıklamalarını kısa haber diline çevir, en önemli bilgiyi başa al. Metni kopyalama, kendi cümlelerinle yaz.
- Rakamlara ve suç isimlerine dokunma. Haberin eski olduğu durumlarda tarihi metne yaz ve kullanıcıya söyle.
- Soruşturma haberlerinde "öne sürülen", "suçlama", "gözaltına alındı" gibi ifadeler kullan. "Suçlu" gibi kesin hüküm kurma. Ölenlerin adlarını yazma.
- Doğrulanmamış bilgiyi kesinmiş gibi yazma ("bekleniyor" gibi). Kaynaklar çelişiyorsa söyle. Kontrol edemediğin noktaları dosyayla birlikte bildir.
- Çocuk içeren ve kanıtlanmamış iddiaları varsayılan olarak alma, kullanıcıya sor.
- Başlık iki bölüm: `lines[0]` siyah, sonrakiler kırmızı. Büyük harf, Türkçe İ/I doğru.
- Kategoriler: GÜNDEM, EKONOMİ, SPOR, KÜLTÜR, SAĞLIK, EĞİTİM, TEKNOLOJİ, SON DAKİKA, DÜNYA.

## Fotoğraf ve video

- Öncelik kullanıcının verdiği görseldir.
- Haber sitelerinin fotoğraflarını izinsiz kullanma. Wikimedia Commons'tan kullanım izni olan görsel kullan, lisansı kontrol et, `credit` alanına isim ve lisansı yaz, temsiliyse "Temsili foto" de.
- Görselin içeriğine bak: Haberle ilgisiz, filigranlı ya da yanıltıcı olmasın (haberde adı geçmeyen şirket logosu, tutuklama haberinde gülümseyen portre gibi). Riskliyse söyle.
- Kullanıcının videosunu koymadan önce karelerine bak. Süre, ses ve yüzleri kontrol et. Tamamını izleyemediğini ve sesi dinleyemediğini söyle.
- Yatay videolar kenarlardan kırpılır. Baştaki logo girişini fark edersen sor; bu kullanıcı kesilmesini istedi (`-Start` saniye).

## Üretim

Haberi `cards.js` içindeki `CARDS` listesinin sonuna ekle:

```js
{cat:'GÜNDEM',pos:'50% 50%',credit:'Video: Kaynak',photo:'foto-yolu-veya-url',lines:['SİYAH SATIR','KIRMIZI SATIR'],body:'Haber metni.'}
```

Numara, listedeki sıradır (ilk kart 0). Bilgisayar yolunda dosya kullanırken `photo` alanına bu klasöre göre göreli yol yaz.

```powershell
.\story.ps1 -Card 11 -Out .\2026-11-08\story-01.png
.\video.ps1 -Card 11 -Video "C:\...\video.mp4" -Out .\2026-11-08\haber.mp4 -Start 6.85
```

Çıktı klasörü her gün için tarih adlı olsun. Üretimden sonra çıktıyı mutlaka görüntüleyip kontrol et.

Şablon ölçüleri: 1080×1920, fotoğraf alanı x=179 y=67, 727×915. Başlık fontu Archivo 900 dar (font-stretch 75%), gövde Figtree. Canva'daki gerçek font adları bilinmiyor. Kullanıcı isterse boş şablonun Canva PNG'siyle `plate-final.png` yenilenebilir, logo daha net olur.

## Bilinen eksikler

- Instagram paylaşımı denenmedi: bilgisayar menüsünde story seçeneği yoktu ve `guneyhaberr` Chrome'da açık değildi.
- Dosya boyutu sınırı 10 MB'a göre ayarlı, çünkü tarayıcıya yükleme sınırı buydu. Kullanıcı telefondan paylaşacağı için daha kaliteli çıktı gerekirse `-MaxMB` artırılabilir.

## Mobil / bulut oturumu (Linux)

Kullanıcı mobil uygulamadan bulut oturumu açtığında PowerShell scriptleri çalışmaz. Bunun yerine:

```bash
node story.js 11 ./2026-11-08/story-01.png
```

`story.js`, Playwright ve Chromium ile `story.ps1`'in yaptığını yapar. Bu ikisi bulut ortamında hazır kurulu gelir. Üretilen PNG'yi kontrol et, sonra kullanıcıya dosya olarak gönder ki telefondan indirip paylaşabilsin. Yeni kartları ve çıktıları commit'leyip depoya push et, yoksa oturum kapanınca kaybolur.

Video (`video.ps1`) bulutta henüz yok. Kullanıcı mobilde video isterse bunu söyle (FFmpeg ile aynı mantık Linux'a taşınabilir).

Zamanlanmış 2 saatlik tarama bulutta "scheduled task" olarak kurulabilir. Kullanıcı isterse saatleri sorup kur.
