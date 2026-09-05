/**
 * TÜBİTAK 2209-A ZİYAPAŞA MİMARİ ENTEGRASYON ANKETİ
 * GOOGLE APPS SCRIPT - CANLI MERKEZİ VERİTABANI KODU
 * 
 * KURULUM ADIMLARI (1 Dakika):
 * 1. https://sheets.new adresine girip yeni bir boş Google E-Tablo açın.
 * 2. Adını "TÜBİTAK 2209-A Ziyapaşa Anket Yanıtları" yapın.
 * 3. Üst menüden: Uzantılar (Extensions) -> Apps Script seçeneğine tıklayın.
 * 4. Açılan kod editöründeki her şeyi silip BU KODUN TAMAMINI yapıştırın.
 * 5. Sağ üstteki mavi "Dağıt" (Deploy) butonuna basın -> "Yeni Dağıtım" (New deployment) seçin.
 * 6. Dişli çark simgesinden "Web Uygulaması" (Web app) seçin.
 * 7. Açıklama: "Ziyapaşa Anket API"
 * 8. "Uygulamayı şu kullanıcı olarak çalıştır" (Execute as): "Ben" (Me)
 * 9. "Erişimi olanlar" (Who has access): "Herkes" (Anyone)  <--- ÇOK ÖNEMLİ!
 * 10. "Dağıt"a tıklayın ve size verilen "Web Uygulaması URL'si"ni kopyalayın.
 * 11. Bu URL'yi bana iletin veya app.js içindeki GOOGLE_SHEETS_WEBHOOK_URL değişkenine yapıştırın.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Eşzamanlı çakışmaları önlemek için kilit
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Tablo boşsa başlık satırını otomatik ekle
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Kayıt No",
        "Tarih ve Saat",
        "Katılımcı Ad Soyad",
        "Katılımcı Grubu",
        "Yaş Grubu",
        "Ziyapaşa İlişkisi",
        "Cinsiyet",
        
        // Bina 01
        "B01_Uyum (1-5)",
        "B01_Estetik (1-5)",
        "B01_Modernlik (1-5)",
        "B01_Ritim (1-5)",
        "B01_Ortalama",
        "B01_Nitel_Yorum",
        
        // Bina 02
        "B02_Uyum (1-5)",
        "B02_Estetik (1-5)",
        "B02_Modernlik (1-5)",
        "B02_Ritim (1-5)",
        "B02_Ortalama",
        "B02_Nitel_Yorum",
        
        // Bina 03
        "B03_Uyum (1-5)",
        "B03_Estetik (1-5)",
        "B03_Modernlik (1-5)",
        "B03_Ritim (1-5)",
        "B03_Ortalama",
        "B03_Nitel_Yorum",
        
        // Bina 04
        "B04_Uyum (1-5)",
        "B04_Estetik (1-5)",
        "B04_Modernlik (1-5)",
        "B04_Ritim (1-5)",
        "B04_Ortalama",
        "B04_Nitel_Yorum",
        
        // Bina 05
        "B05_Uyum (1-5)",
        "B05_Estetik (1-5)",
        "B05_Modernlik (1-5)",
        "B05_Ritim (1-5)",
        "B05_Ortalama",
        "B05_Nitel_Yorum",
        
        // Genel Özet
        "Genel_Proje_Ortalamasi"
      ];
      
      sheet.appendRow(headers);
      
      // Başlık formatı (Koyu mavi arka plan, beyaz kalın yazı)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#2B5B84");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Gelen JSON verisini ayrıştır
    var postData = "";
    if (e.postData && e.postData.contents) {
      postData = e.postData.contents;
    } else {
      postData = JSON.stringify(e.parameter);
    }
    
    var data = JSON.parse(postData);
    var rowNum = sheet.getLastRow(); // Mevcut satır sayısı
    
    var row = [
      rowNum, // Kayıt No (1, 2, 3...)
      data.timestamp || new Date().toLocaleString("tr-TR"),
      data.fullName || "Anonim",
      data.targetGroup || "",
      data.experienceAge || "",
      data.ziyapasaRelation || "",
      data.gender || ""
    ];
    
    var allScores = [];
    var buildings = ["bina01", "bina02", "bina03", "bina04", "bina05"];
    
    buildings.forEach(function(bid) {
      var r = (data.ratings && data.ratings[bid]) ? data.ratings[bid] : {};
      var c1 = parseFloat(r.c1) || "";
      var c2 = parseFloat(r.c2) || "";
      var c3 = parseFloat(r.c3) || "";
      var c4 = parseFloat(r.c4) || "";
      
      var validVals = [c1, c2, c3, c4].filter(function(v) { return v !== ""; });
      var bMean = validVals.length ? (validVals.reduce(function(a, b) { return a + b; }, 0) / validVals.length).toFixed(2) : "";
      
      if (validVals.length) {
        allScores = allScores.concat(validVals);
      }
      
      row.push(c1);
      row.push(c2);
      row.push(c3);
      row.push(c4);
      row.push(bMean);
      row.push(r.comment || "");
    });
    
    var generalMean = allScores.length ? (allScores.reduce(function(a, b) { return a + b; }, 0) / allScores.length).toFixed(2) : "";
    row.push(generalMean);
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "row": sheet.getLastRow(),
      "message": "Anket başarıyla Google E-Tabloya kaydedildi."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Test için GET fonksiyonu
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "online",
    "message": "TÜBİTAK 2209-A Ziyapaşa Webhook Servisi Aktif ve Çalışıyor!"
  })).setMimeType(ContentService.MimeType.JSON);
}
