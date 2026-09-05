# 📋 1 Dakikada Google E-Tablolar (Canlı Veritabanı) Kurulum Kılavuzu

Bu adımları tamamladığınızda, web anketine giren **herkesin yanıtları anında, otomatik olarak** tek bir Google E-Tabloya satır satır düşecektir.

---

### ⏱️ Adım Adım Kurulum (1 Dakika):

1. **Google E-Tablo Açın:**
   * Tarayıcınızda [sheets.new](https://sheets.new) adresine gidin.
   * Tablonun başlığını `TÜBİTAK 2209-A Ziyapaşa Anket Yanıtları` olarak adlandırın.

2. **Apps Script Editörünü Açın:**
   * Üst menüden sırasıyla: **Uzantılar (Extensions)** ➔ **Apps Script** seçeneğine tıklayın.

3. **Kodu Yapıştırın:**
   * Açılan kod ekranındaki mevcut her şeyi silin.
   * [`google_sheets_apps_script.js`](google_sheets_apps_script.js) dosyasındaki kodun tamamını kopyalayıp buraya yapıştırın.
   * Klavyeden `Ctrl + S` tuşuna basarak kaydedin.

4. **Dağıtın (Deploy As Web App):**
   * Sağ üst köşedeki mavi **Dağıt (Deploy)** butonuna tıklayın ➔ **Yeni Dağıtım (New deployment)** seçin.
   * Açılan pencerede sol taraftaki dişli çark (⚙️) simgesine tıklayıp **Web Uygulaması (Web app)** seçeneğini seçin.
   * Ayarları şu şekilde yapın:
     * **Açıklama:** `Ziyapaşa Anket API`
     * **Uygulamayı şu kullanıcı olarak çalıştır (Execute as):** `Ben (Me)`
     * **Erişimi olanlar (Who has access):** `Herkes (Anyone)` ⚠️ *(Burası "Herkes" olmalıdır ki anketi dolduran herkes veri gönderebilsin)*
   * **Dağıt** butonuna basın. (İlk defa yapıyorsanız Google izin isteyebilir; "İzinleri İncele" ➔ "Gelişmiş" ➔ "Güvenli Değil Bağlantısına Git" diyerek onaylayın).

5. **Web Uygulaması URL'sini Kopyalayın:**
   * Ekranda çıkan `https://script.google.com/macros/s/AKfycb.../exec` biçimindeki URL'yi kopyalayın.

6. **Bana İletin:**
   * Kopyaladığınız bu linki bana gönderin. Ben anında `app.js` içine yerleştirip GitHub'a yükleyeceğim.
   * Artık anket doldurulduğu saniye bu Google E-Tabloya canlı satır olarak düşecektir!
