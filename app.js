/**
 * TÜBİTAK 2209-A | ZİYAPAŞA MİMARİ ENTEGRASYON DEĞERLENDİRME SİSTEMİ
 * Saha Uygulaması ve İnteraktif Değerlendirme Motoru
 */

// Google E-Tablolar Canlı Veritabanı Webhook URL (Aktif Dağıtım)
const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxTD-fmevONeTx9lrAbSnkOBr0cgUQcPHZ7ygazLMYMqlmKVHIJ-xC1nxVPjVs9xnqV/exec";

// 1. URL parametresinden (?webhook=...)
// 2. localStorage'dan
// 3. Varsayılan tanımlı URL'den okunur
const _urlParams = new URLSearchParams(window.location.search);
if (_urlParams.has('webhook')) {
  try {
    localStorage.setItem('tubitak_google_sheets_webhook_url', _urlParams.get('webhook').trim());
  } catch (e) {}
}

let GOOGLE_SHEETS_WEBHOOK_URL = localStorage.getItem('tubitak_google_sheets_webhook_url') || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;

// 5 Binanın Veri Kümesi ve Görsel Yolları
const BUILDINGS_DATA = [
  {
    id: "bina01",
    index: 1,
    title: "Bina 01 (Tasarım 01 / Ada 12 Parsel 08 - F088)",
    badge: "BİNA 01 / 05 (SKETCHUP)",
    desc: "Orijinal 2 katlı taş/tuğla doku referans alınarak üretilen SketchUp 3B modeli ve Ziyapaşa sokak entegrasyonu.",
    images: {
      integ: { src: "assets/images/bina01_04_ana_entegrasyon.jpg", label: "Nihai Sokak Entegrasyonu (Fotomontaj)" },
      ref: { src: "assets/images/bina01_01_ref_sokak.jpg", label: "Orijinal Ziyapaşa Sokağı (Mevcut Doku - F088)" },
      model: { src: "assets/images/bina01_02_ham_model.jpg", label: "Trimble SketchUp Ham 3B Cephe Modeli" },
      ai: { src: "assets/images/bina01_03_yz_konsept.jpg", label: "Yapay Zekâ Cephe Konsepti (M1 / PR-006)" },
      v1: { src: "assets/images/bina01_05_v1_sagegreen.jpg", label: "2026 Trend Paleti V1: Adaçayı Yeşili Entegrasyonu" },
      v2: { src: "assets/images/bina01_06_v2_terracotta.jpg", label: "2026 Trend Paleti V2: Terrakotta Entegrasyonu" }
    }
  },
  {
    id: "bina02",
    index: 2,
    title: "Bina 02 (Tasarım 02 / Ada 15 Parsel 11 - F012)",
    badge: "BİNA 02 / 05 (BIM - REVIT)",
    desc: "Ziyapaşa konut dokusuna uygun düşey pencere ritimli Autodesk Revit BIM mimari modeli ve fotomontajı.",
    images: {
      integ: { src: "assets/images/bina02_04_ana_entegrasyon.jpg", label: "Nihai Sokak Entegrasyonu (Fotomontaj)" },
      ref: { src: "assets/images/bina02_01_ref_sokak.jpg", label: "Orijinal Ziyapaşa Sokağı (Mevcut Doku - F012)" },
      model: { src: "assets/images/bina02_02_ham_model.jpg", label: "Autodesk Revit BIM Ham 3B Cephe Modeli" },
      ai: { src: "assets/images/bina02_03_yz_konsept.jpg", label: "Yapay Zekâ Cephe Konsepti (M2 / PR-015)" },
      v1: { src: "assets/images/bina02_05_v1_sagegreen.jpg", label: "2026 Trend Paleti V1: Adaçayı Yeşili Entegrasyonu" },
      v2: { src: "assets/images/bina02_06_v2_terracotta.jpg", label: "2026 Trend Paleti V2: Terrakotta Entegrasyonu" }
    }
  },
  {
    id: "bina03",
    index: 3,
    title: "Bina 03 (Tasarım 03 / Ada 18 Parsel 04 - F140)",
    badge: "BİNA 03 / 05 (SKETCHUP)",
    desc: "Geniş saçak ve ahşap söve detayları içeren SketchUp modeli ve Ziyapaşa sokak perspektifi.",
    images: {
      integ: { src: "assets/images/bina03_04_ana_entegrasyon.jpg", label: "Nihai Sokak Entegrasyonu (Fotomontaj)" },
      ref: { src: "assets/images/bina03_01_ref_sokak.jpg", label: "Orijinal Ziyapaşa Sokağı (Mevcut Doku - F140)" },
      model: { src: "assets/images/bina03_02_ham_model.jpg", label: "Trimble SketchUp Ham 3B Cephe Modeli" },
      ai: { src: "assets/images/bina03_03_yz_konsept.jpg", label: "Yapay Zekâ Cephe Konsepti (M3 / PR-012)" },
      v1: { src: "assets/images/bina03_05_v1_sagegreen.jpg", label: "2026 Trend Paleti V1: Adaçayı Yeşili Entegrasyonu" },
      v2: { src: "assets/images/bina03_06_v2_terracotta.jpg", label: "2026 Trend Paleti V2: Terrakotta Entegrasyonu" }
    }
  },
  {
    id: "bina04",
    index: 4,
    title: "Bina 04 (Tasarım 04 / Ada 19 Parsel 02 - F127)",
    badge: "BİNA 04 / 05 (SKETCHUP)",
    desc: "Ziyapaşa tipik köşe parsel gabarisiyle uyumlu 3 katlı SketchUp modeli ve sokak entegrasyonu.",
    images: {
      integ: { src: "assets/images/bina04_04_ana_entegrasyon.jpg", label: "Nihai Sokak Entegrasyonu (Fotomontaj)" },
      ref: { src: "assets/images/bina04_01_ref_sokak.jpg", label: "Orijinal Ziyapaşa Sokağı (Mevcut Doku - F127)" },
      model: { src: "assets/images/bina04_02_ham_model.jpg", label: "Trimble SketchUp Ham 3B Cephe Modeli" },
      ai: { src: "assets/images/bina04_03_yz_konsept.jpg", label: "Yapay Zekâ Cephe Konsepti (M4 / PR-037)" },
      v1: { src: "assets/images/bina04_05_v1_sagegreen.jpg", label: "2026 Trend Paleti V1: Adaçayı Yeşili Entegrasyonu" },
      v2: { src: "assets/images/bina04_06_v2_terracotta.jpg", label: "2026 Trend Paleti V2: Terrakotta Entegrasyonu" }
    }
  },
  {
    id: "bina05",
    index: 5,
    title: "Bina 05 (Tasarım 05 / Ada 22 Parsel 07 - F059)",
    badge: "BİNA 05 / 05 (SKETCHUP)",
    desc: "Geleneksel cumba ve masif-şeffaf oranı dengelenmiş SketchUp modeli ve Ziyapaşa sokak fotomontajı.",
    images: {
      integ: { src: "assets/images/bina05_04_ana_entegrasyon.jpg", label: "Nihai Sokak Entegrasyonu (Fotomontaj)" },
      ref: { src: "assets/images/bina05_01_ref_sokak.jpg", label: "Orijinal Ziyapaşa Sokağı (Mevcut Doku - F059)" },
      model: { src: "assets/images/bina05_02_ham_model.jpg", label: "Trimble SketchUp Ham 3B Cephe Modeli" },
      ai: { src: "assets/images/bina05_03_yz_konsept.jpg", label: "Yapay Zekâ Cephe Konsepti (M5 / PR-048)" },
      v1: { src: "assets/images/bina05_05_v1_sagegreen.jpg", label: "2026 Trend Paleti V1: Adaçayı Yeşili Entegrasyonu" },
      v2: { src: "assets/images/bina05_06_v2_terracotta.jpg", label: "2026 Trend Paleti V2: Terrakotta Entegrasyonu" }
    }
  }
];

// Sıralı Görsel Aşamaları Listesi (Kullanıcı İsteğine Göre)
const VIEW_SEQUENCE = ['ref', 'ai', 'model', 'integ', 'split', 'v1', 'v2'];

// Anket Durumu (State)
let currentBuildingIndex = 0; // 0..4
let currentViewMode = 'ref'; // 1. Orijinal sokaktan başlar: ref, ai, model, integ, split, v1, v2
let surveyRespondent = {
  timestamp: '',
  fullName: '',
  targetGroup: '',
  experienceAge: '',
  ziyapasaRelation: '',
  gender: '',
  ratings: {
    // bina01: { c1: 4, c2: 5, c3: 4, c4: 4, comment: "" }
  }
};

// DOM Elemanları
const stepIntro = document.getElementById('stepIntro');
const stepEvaluation = document.getElementById('stepEvaluation');
const stepFinish = document.getElementById('stepFinish');

const btnStartSurvey = document.getElementById('btnStartSurvey');
const btnPrevBuilding = document.getElementById('btnPrevBuilding');
const btnNextBuilding = document.getElementById('btnNextBuilding');
const btnNextText = document.getElementById('btnNextText');

const currentStepText = document.getElementById('currentStepText');
const progressBarFill = document.getElementById('progressBarFill');
const binaBadge = document.getElementById('binaBadge');
const binaTitle = document.getElementById('binaTitle');
const binaDesc = document.getElementById('binaDesc');
const quickNavDots = document.getElementById('quickNavDots');

const mediaTabs = document.getElementById('mediaTabs');
const viewerStage = document.getElementById('viewerStage');
const btnStagePrev = document.getElementById('btnStagePrev');
const btnStageNext = document.getElementById('btnStageNext');

const singleImageView = document.getElementById('singleImageView');
const splitImageView = document.getElementById('splitImageView');
const mainViewerImg = document.getElementById('mainViewerImg');
const imageCaption = document.getElementById('imageCaption');
const splitImgBefore = document.getElementById('splitImgBefore');
const splitImgAfter = document.getElementById('splitImgAfter');
const binaCommentInput = document.getElementById('binaCommentInput');

const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalCaption = document.getElementById('modalCaption');
const btnZoomModal = document.getElementById('btnZoomModal');
const btnCloseModal = document.getElementById('btnCloseModal');

const btnDownloadCSV = document.getElementById('btnDownloadCSV');
const btnDownloadAllStorage = document.getElementById('btnDownloadAllStorage');
const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
const btnNewSurvey = document.getElementById('btnNewSurvey');
const summaryGrid = document.getElementById('summaryGrid');

// BAŞLATMA
document.addEventListener('DOMContentLoaded', () => {
  renderQuickDots();
  setupEventListeners();
  updateStorageCount();
  initGoogleSheetsIntegration();
});

// Hızlı Adım Noktaları
function renderQuickDots() {
  quickNavDots.innerHTML = '';
  BUILDINGS_DATA.forEach((b, idx) => {
    const dot = document.createElement('div');
    dot.className = `dot ${idx === currentBuildingIndex ? 'active' : ''}`;
    dot.textContent = idx + 1;
    dot.title = b.title;
    dot.addEventListener('click', () => {
      if (stepEvaluation.style.display !== 'none') {
        saveCurrentBuildingRatings();
        loadBuilding(idx);
      }
    });
    quickNavDots.appendChild(dot);
  });
}

// Olay Dinleyicileri
function setupEventListeners() {
  // Girişten Değerlendirmeye Geçiş
  btnStartSurvey.addEventListener('click', () => {
    const targetGroup = document.getElementById('targetGroup').value;
    const experienceAge = document.getElementById('experienceAge').value;
    const consentCheck = document.getElementById('consentCheck').checked;

    if (!targetGroup) {
      alert('Lütfen Katılımcı Grubu seçiniz (Mimar veya Mahalle Sakini).');
      document.getElementById('targetGroup').focus();
      return;
    }
    if (!experienceAge) {
      alert('Lütfen Yaş Grubunuzu seçiniz.');
      document.getElementById('experienceAge').focus();
      return;
    }
    if (!consentCheck) {
      alert('Lütfen araştırmaya katılım onamını onaylayınız.');
      return;
    }

    // Bilgileri kaydet
    surveyRespondent.timestamp = new Date().toISOString();
    surveyRespondent.fullName = document.getElementById('fullName').value.trim() || 'Anonim Katılımcı';
    surveyRespondent.targetGroup = targetGroup;
    surveyRespondent.experienceAge = experienceAge;
    surveyRespondent.ziyapasaRelation = document.getElementById('ziyapasaRelation').value;
    surveyRespondent.gender = document.getElementById('gender').value;

    // Ekrana geç
    stepIntro.style.display = 'none';
    stepEvaluation.style.display = 'block';
    loadBuilding(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Sekmeler (Tablar)
  mediaTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    setStageView(btn.getAttribute('data-view'));
  });

  // Sahne İçi Sağ/Sol Oklar
  if (btnStagePrev) {
    btnStagePrev.addEventListener('click', () => navigateStageView(-1));
  }
  if (btnStageNext) {
    btnStageNext.addEventListener('click', () => navigateStageView(1));
  }

  // MOBİLDE PARMAKLA SAĞA-SOLA KAYDIRMA (TOUCH SWIPE)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (viewerStage) {
    viewerStage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    viewerStage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    // Yatay kaydırma dikey kaydırmadan belirgin şekilde fazlaysa ve min 40px ise
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        // Parmağı sola çekti -> Sonraki görsele geç
        navigateStageView(1);
      } else {
        // Parmağı sağa çekti -> Önceki görsele geç
        navigateStageView(-1);
      }
    }
  }

  // İleri / Geri Bina Butonları
  btnPrevBuilding.addEventListener('click', () => {
    saveCurrentBuildingRatings();
    if (currentBuildingIndex > 0) {
      loadBuilding(currentBuildingIndex - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  });

  btnNextBuilding.addEventListener('click', () => {
    // 4 Kriterin girilip girilmediğini kontrol et
    const valid = validateCurrentRatings();
    if (!valid) {
      const proceed = confirm('Bu bina için bazı puanları işaretlemediniz. Yine de devam etmek istiyor musunuz? (Akademik geçerlilik için tüm puanların doldurulması önerilir)');
      if (!proceed) return;
    }

    saveCurrentBuildingRatings();

    if (currentBuildingIndex < BUILDINGS_DATA.length - 1) {
      loadBuilding(currentBuildingIndex + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // 5 Bina da bitti, sonuç ekranına git
      finishSurvey();
    }
  });

  // Modal İşlemleri
  btnZoomModal.addEventListener('click', () => {
    modalImg.src = mainViewerImg.src;
    modalCaption.textContent = imageCaption.textContent;
    imageModal.style.display = 'flex';
  });

  btnCloseModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
  });

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      imageModal.style.display = 'none';
    }
  });

  // Veri İndirme & WhatsApp
  btnDownloadCSV.addEventListener('click', downloadCurrentCSV);
  btnDownloadAllStorage.addEventListener('click', downloadAllLocalStorageCSV);
  btnNewSurvey.addEventListener('click', resetForNewSurvey);
}

// Binayı Yükleme Fonksiyonu
function loadBuilding(index) {
  currentBuildingIndex = index;
  const b = BUILDINGS_DATA[index];

  binaBadge.textContent = b.badge;
  binaTitle.textContent = b.title;
  binaDesc.textContent = b.desc;

  // Header Sayaç
  currentStepText.textContent = `${index + 1} / 5`;
  progressBarFill.style.width = `${((index + 1) / 5) * 100}%`;

  // Önceki butonunu gizle/göster
  btnPrevBuilding.style.visibility = index === 0 ? 'hidden' : 'visible';

  // İleri buton metni
  if (index === BUILDINGS_DATA.length - 1) {
    btnNextText.textContent = 'Değerlendirmeyi Tamamla ve Kaydet';
  } else {
    btnNextText.textContent = `Sonraki Binaya Geç (${index + 2}/5)`;
  }

  // Dots güncelle
  document.querySelectorAll('.quick-nav-dots .dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
    const bid = BUILDINGS_DATA[i].id;
    if (surveyRespondent.ratings[bid] && surveyRespondent.ratings[bid].c1) {
      d.classList.add('completed');
    }
  });

  // Görsel modunu 1. Orijinal sokaktan başlat
  setStageView('ref');
  restoreBuildingRatings(b.id);
}

// Görsel Aşamaları Arasında Adım Adım Gezinme (-1 veya +1)
function navigateStageView(direction) {
  let currIdx = VIEW_SEQUENCE.indexOf(currentViewMode);
  if (currIdx === -1) currIdx = 0;
  let nextIdx = currIdx + direction;
  
  if (nextIdx < 0) {
    nextIdx = VIEW_SEQUENCE.length - 1; // Başa dön (döngüsel)
  } else if (nextIdx >= VIEW_SEQUENCE.length) {
    nextIdx = 0; // Sona gelince başa sar
  }
  
  setStageView(VIEW_SEQUENCE[nextIdx]);
}

function setStageView(viewMode) {
  currentViewMode = viewMode;
  mediaTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewMode);
  });
  renderViewerStage();
}

// Görsel Sahnesini Çizme
function renderViewerStage() {
  const b = BUILDINGS_DATA[currentBuildingIndex];

  if (currentViewMode === 'split') {
    singleImageView.style.display = 'none';
    splitImageView.style.display = 'grid';

    splitImgBefore.src = b.images.ref.src;
    splitImgAfter.src = b.images.integ.src;
  } else {
    splitImageView.style.display = 'none';
    singleImageView.style.display = 'block';

    const item = b.images[currentViewMode] || b.images.ref;
    mainViewerImg.src = item.src;
    imageCaption.textContent = item.label;
  }
}

// Mevcut Puanları Kaydetme
function saveCurrentBuildingRatings() {
  const b = BUILDINGS_DATA[currentBuildingIndex];
  
  const c1Val = document.querySelector('input[name="b_c1"]:checked')?.value || '';
  const c2Val = document.querySelector('input[name="b_c2"]:checked')?.value || '';
  const c3Val = document.querySelector('input[name="b_c3"]:checked')?.value || '';
  const c4Val = document.querySelector('input[name="b_c4"]:checked')?.value || '';
  const comment = binaCommentInput.value.trim();

  surveyRespondent.ratings[b.id] = {
    c1: c1Val,
    c2: c2Val,
    c3: c3Val,
    c4: c4Val,
    comment: comment
  };
}

// Daha Önce Verilmiş Puanları Forma Geri Yükleme
function restoreBuildingRatings(buildingId) {
  // Radyo butonlarını temizle
  document.querySelectorAll('.likert-buttons input[type="radio"]').forEach(r => r.checked = false);
  binaCommentInput.value = '';

  const r = surveyRespondent.ratings[buildingId];
  if (r) {
    if (r.c1) checkRadio('b_c1', r.c1);
    if (r.c2) checkRadio('b_c2', r.c2);
    if (r.c3) checkRadio('b_c3', r.c3);
    if (r.c4) checkRadio('b_c4', r.c4);
    if (r.comment) binaCommentInput.value = r.comment;
  }
}

function checkRadio(name, val) {
  const input = document.querySelector(`input[name="${name}"][value="${val}"]`);
  if (input) input.checked = true;
}

// Zorunluluk Kontrolü
function validateCurrentRatings() {
  const c1 = document.querySelector('input[name="b_c1"]:checked');
  const c2 = document.querySelector('input[name="b_c2"]:checked');
  const c3 = document.querySelector('input[name="b_c3"]:checked');
  const c4 = document.querySelector('input[name="b_c4"]:checked');
  return !!(c1 && c2 && c3 && c4);
}

// Anketi Tamamlama
function finishSurvey() {
  stepEvaluation.style.display = 'none';
  stepFinish.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Yerel Depolamaya (LocalStorage) Toplu Kayıt Ekle
  saveToLocalStorage(surveyRespondent);
  updateStorageCount();

  // Özet Kartını Doldur
  renderSummaryCard();

  // WhatsApp Paylaşım Linkini Hazırla
  setupWhatsAppLink();

  // Google E-Tablolara Canlı Otomatik Kayıt
  sendToGoogleSheets(surveyRespondent);
}

function renderSummaryCard() {
  summaryGrid.innerHTML = '';

  BUILDINGS_DATA.forEach(b => {
    const r = surveyRespondent.ratings[b.id] || { c1: '-', c2: '-', c3: '-', c4: '-' };
    const vals = [r.c1, r.c2, r.c3, r.c4].map(v => parseFloat(v)).filter(v => !isNaN(v));
    const mean = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '-';

    const cell = document.createElement('div');
    cell.className = 'score-cell';
    cell.innerHTML = `
      <h5>${b.title.split('(')[0].trim()}</h5>
      <div class="mean-score">${mean} <small style="font-size:12px;font-weight:400;color:var(--text-dim)">/ 5</small></div>
      <div class="metric-breakdown">
        Uyum: <strong>${r.c1}</strong> | Estetik: <strong>${r.c2}</strong><br>
        Modern: <strong>${r.c3}</strong> | Ritim: <strong>${r.c4}</strong>
      </div>
    `;
    summaryGrid.appendChild(cell);
  });
}

function setupWhatsAppLink() {
  const phoneInput = document.getElementById('targetPhoneInput');
  const updateLink = () => {
    let rawPhone = (phoneInput ? phoneInput.value.trim() : '').replace(/[^0-9]/g, '');
    let text = `*TÜBİTAK 2209-A Ziyapaşa Cephe Değerlendirmesi*%0A`;
    text += `👤 *Katılımcı:* ${surveyRespondent.fullName} (${surveyRespondent.targetGroup})%0A`;
    text += `🎂 *Yaş:* ${surveyRespondent.experienceAge} | *İlişki:* ${surveyRespondent.ziyapasaRelation}%0A`;
    text += `📅 *Tarih:* ${new Date().toLocaleDateString('tr-TR')}%0A%0A`;

    BUILDINGS_DATA.forEach((b, i) => {
      const r = surveyRespondent.ratings[b.id] || {};
      text += `*Bina 0${i+1}:* Uyum:${r.c1 || '-'} | Estetik:${r.c2 || '-'} | Modernlik:${r.c3 || '-'} | Ritim:${r.c4 || '-'}`;
      if (r.comment) text += ` _("${r.comment}")_`;
      text += `%0A`;
    });

    if (rawPhone && rawPhone.length >= 10) {
      btnShareWhatsApp.href = `https://wa.me/${rawPhone}?text=${text}`;
    } else {
      btnShareWhatsApp.href = `https://api.whatsapp.com/send?text=${text}`;
    }
  };

  if (phoneInput) {
    phoneInput.addEventListener('input', updateLink);
  }
  updateLink();
}

// LocalStorage İşlemleri
function saveToLocalStorage(record) {
  try {
    const existing = JSON.parse(localStorage.getItem('tubitak_ziyapasa_surveys') || '[]');
    existing.push(record);
    localStorage.setItem('tubitak_ziyapasa_surveys', JSON.stringify(existing));
  } catch (err) {
    console.error('LocalStorage hatası:', err);
  }
}

function updateStorageCount() {
  try {
    const existing = JSON.parse(localStorage.getItem('tubitak_ziyapasa_surveys') || '[]');
    btnDownloadAllStorage.textContent = `Tüm Kayıtları İndir (Cihazda Kayıtlı: ${existing.length} Anket)`;
  } catch (e) {}
}

// CSV İndirme (Tekil Anket)
function downloadCurrentCSV() {
  const headers = [
    'Zaman_Damgasi', 'Ad_Soyad', 'Hedef_Grup', 'Yas_Grubu', 'Ziyapasa_Iliskisi', 'Cinsiyet',
    'Bina01_Uyum', 'Bina01_Estetik', 'Bina01_Modernlik', 'Bina01_Ritim', 'Bina01_Yorum',
    'Bina02_Uyum', 'Bina02_Estetik', 'Bina02_Modernlik', 'Bina02_Ritim', 'Bina02_Yorum',
    'Bina03_Uyum', 'Bina03_Estetik', 'Bina03_Modernlik', 'Bina03_Ritim', 'Bina03_Yorum',
    'Bina04_Uyum', 'Bina04_Estetik', 'Bina04_Modernlik', 'Bina04_Ritim', 'Bina04_Yorum',
    'Bina05_Uyum', 'Bina05_Estetik', 'Bina05_Modernlik', 'Bina05_Ritim', 'Bina05_Yorum'
  ];

  const row = [
    `"${surveyRespondent.timestamp}"`,
    `"${surveyRespondent.fullName}"`,
    `"${surveyRespondent.targetGroup}"`,
    `"${surveyRespondent.experienceAge}"`,
    `"${surveyRespondent.ziyapasaRelation}"`,
    `"${surveyRespondent.gender}"`
  ];

  BUILDINGS_DATA.forEach(b => {
    const r = surveyRespondent.ratings[b.id] || {};
    row.push(r.c1 || '');
    row.push(r.c2 || '');
    row.push(r.c3 || '');
    row.push(r.c4 || '');
    row.push(`"${(r.comment || '').replace(/"/g, '""')}"`);
  });

  const csvContent = '\uFEFF' + headers.join(';') + '\n' + row.join(';');
  triggerDownload(csvContent, `ziyapasa_anket_${surveyRespondent.fullName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
}

// CSV İndirme (Cihazdaki Tüm Anketler)
function downloadAllLocalStorageCSV() {
  const surveys = JSON.parse(localStorage.getItem('tubitak_ziyapasa_surveys') || '[]');
  if (!surveys.length) {
    alert('Bu cihazda henüz kayıtlı anket bulunmuyor.');
    return;
  }

  const headers = [
    'Zaman_Damgasi', 'Ad_Soyad', 'Hedef_Grup', 'Yas_Grubu', 'Ziyapasa_Iliskisi', 'Cinsiyet',
    'Bina01_Uyum', 'Bina01_Estetik', 'Bina01_Modernlik', 'Bina01_Ritim', 'Bina01_Yorum',
    'Bina02_Uyum', 'Bina02_Estetik', 'Bina02_Modernlik', 'Bina02_Ritim', 'Bina02_Yorum',
    'Bina03_Uyum', 'Bina03_Estetik', 'Bina03_Modernlik', 'Bina03_Ritim', 'Bina03_Yorum',
    'Bina04_Uyum', 'Bina04_Estetik', 'Bina04_Modernlik', 'Bina04_Ritim', 'Bina04_Yorum',
    'Bina05_Uyum', 'Bina05_Estetik', 'Bina05_Modernlik', 'Bina05_Ritim', 'Bina05_Yorum'
  ];

  const rows = surveys.map(s => {
    const r = [
      `"${s.timestamp}"`,
      `"${s.fullName}"`,
      `"${s.targetGroup}"`,
      `"${s.experienceAge}"`,
      `"${s.ziyapasaRelation}"`,
      `"${s.gender}"`
    ];

    BUILDINGS_DATA.forEach(b => {
      const br = s.ratings[b.id] || {};
      r.push(br.c1 || '');
      r.push(br.c2 || '');
      r.push(br.c3 || '');
      r.push(br.c4 || '');
      r.push(`"${(br.comment || '').replace(/"/g, '""')}"`);
    });

    return r.join(';');
  });

  const csvContent = '\uFEFF' + headers.join(';') + '\n' + rows.join('\n');
  triggerDownload(csvContent, `ziyapasa_tum_anketler_N${surveys.length}_${Date.now()}.csv`);
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function resetForNewSurvey() {
  surveyRespondent = {
    timestamp: '',
    fullName: '',
    targetGroup: '',
    experienceAge: '',
    ziyapasaRelation: '',
    gender: '',
    ratings: {}
  };
  document.getElementById('fullName').value = '';
  document.getElementById('targetGroup').selectedIndex = 0;
  document.getElementById('experienceAge').selectedIndex = 0;
  
  stepFinish.style.display = 'none';
  stepIntro.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// GOOGLE E-TABLOLAR CANLI MERKEZİ VERİTABANI VE BULUT SENKRONİZASYONU
// ==========================================================================

function initGoogleSheetsIntegration() {
  const webhookInput = document.getElementById('webhookUrlInput');
  const btnSave = document.getElementById('btnSaveWebhook');
  const btnTest = document.getElementById('btnTestWebhook');
  const notice = document.getElementById('webhookSaveNotice');

  // Mevcut URL'i kutuya yaz
  const currentUrl = GOOGLE_SHEETS_WEBHOOK_URL || localStorage.getItem('tubitak_google_sheets_webhook_url') || '';
  if (webhookInput && currentUrl) {
    webhookInput.value = currentUrl;
  }

  // Kaydet Butonu
  if (btnSave && webhookInput) {
    btnSave.addEventListener('click', () => {
      const val = webhookInput.value.trim();
      if (!val) {
        localStorage.removeItem('tubitak_google_sheets_webhook_url');
        GOOGLE_SHEETS_WEBHOOK_URL = '';
        if (notice) notice.textContent = 'Webhook URL temizlendi.';
        return;
      }
      localStorage.setItem('tubitak_google_sheets_webhook_url', val);
      GOOGLE_SHEETS_WEBHOOK_URL = val;
      if (notice) {
        notice.style.color = '#2ecc71';
        notice.textContent = '✓ Google E-Tablolar bağlantısı başarıyla kaydedildi!';
        setTimeout(() => { notice.textContent = ''; }, 4000);
      }
    });
  }

  // Test Butonu
  if (btnTest && webhookInput) {
    btnTest.addEventListener('click', async () => {
      const url = webhookInput.value.trim() || GOOGLE_SHEETS_WEBHOOK_URL;
      if (!url) {
        alert('Lütfen önce Apps Script Web Uygulaması URL\'nizi yapıştırın.');
        return;
      }
      btnTest.disabled = true;
      btnTest.textContent = 'İletiliyor...';

      const testPayload = {
        timestamp: new Date().toLocaleString('tr-TR'),
        fullName: 'Test Kullanıcısı (Canlı Bağlantı Kontrolü)',
        targetGroup: 'Sistem Testi',
        experienceAge: '26-40',
        ziyapasaRelation: 'Araştırmacı',
        gender: 'Belirtmek İstemiyor',
        ratings: {
          bina01: { c1: 5, c2: 5, c3: 5, c4: 5, comment: 'Otomatik canlı entegrasyon testi başarılı.' },
          bina02: { c1: 5, c2: 5, c3: 5, c4: 5, comment: 'Test' },
          bina03: { c1: 5, c2: 5, c3: 5, c4: 5, comment: 'Test' },
          bina04: { c1: 5, c2: 5, c3: 5, c4: 5, comment: 'Test' },
          bina05: { c1: 5, c2: 5, c3: 5, c4: 5, comment: 'Test' }
        }
      };

      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(testPayload)
        });
        alert('✅ Test paketi Google E-Tablonuza iletildi! Lütfen tablonuzu açıp yeni satırın gelip gelmediğini kontrol edin.');
      } catch (err) {
        alert('⚠️ Test gönderiminde bir hata oluştu: ' + err.message);
      } finally {
        btnTest.disabled = false;
        btnTest.textContent = 'Test Gönder';
      }
    });
  }
}

async function sendToGoogleSheets(record) {
  const syncBanner = document.getElementById('cloudSyncStatus');
  const syncText = document.getElementById('cloudSyncText');
  if (!syncBanner || !syncText) return;

  const activeWebhook = GOOGLE_SHEETS_WEBHOOK_URL || localStorage.getItem('tubitak_google_sheets_webhook_url');

  syncBanner.style.display = 'flex';

  if (!activeWebhook || !activeWebhook.trim()) {
    syncBanner.className = 'cloud-sync-banner warning';
    syncBanner.innerHTML = `
      <span class="sync-icon">ℹ️</span>
      <span id="cloudSyncText">Verileriniz bu cihaza kaydedildi. Canlı merkezi tablo kaydı için Google E-Tablolar bağlantısı bekleniyor.</span>
    `;
    return;
  }

  syncBanner.className = 'cloud-sync-banner';
  syncBanner.innerHTML = `
    <span class="sync-icon">⏳</span>
    <span id="cloudSyncText">Yanıtlarınız merkezi Google E-Tablolar veritabanına aktarılıyor...</span>
  `;

  try {
    // Google Apps Script Web App'e 'no-cors' ve text/plain ile gönderim:
    // Bu sayede tarayıcı OPTIONS preflight engeline takılmaz ve doğrudan doPost'a düşer.
    await fetch(activeWebhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(record)
    });

    syncBanner.className = 'cloud-sync-banner success';
    syncBanner.innerHTML = `
      <span class="sync-icon">✅</span>
      <span id="cloudSyncText"><strong>Canlı Kayıt Başarılı!</strong> Yanıtınız merkezi Google E-Tablolar tablosuna canlı olarak işlendi.</span>
    `;
  } catch (err) {
    console.warn('Google Sheets gönderim hatası:', err);
    syncBanner.className = 'cloud-sync-banner warning';
    syncBanner.innerHTML = `
      <span class="sync-icon">⚠️</span>
      <span id="cloudSyncText">Bulut kaydı sırasında geçici bir ağ aksaması oluştu. Verileriniz yerel bellekte güvendedir, CSV indirebilir veya WhatsApp ile iletebilirsiniz.</span>
    `;
  }
}

