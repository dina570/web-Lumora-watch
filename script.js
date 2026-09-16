/* =========================================================
   LUMORA WATCH — script.js
   Dipakai bersama oleh: index, collections, product, about, contact
   Semua fungsi dibuat "aman": kalau elemen yang dibutuhkan
   tidak ada di halaman tertentu, fungsi itu berhenti diam-diam
   (tidak melempar error).
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initProductFilter();
  initOrderModal();
  initContactForm();
});

/* ---------------------------------------------------------
   1. MOBILE MENU
   Berlaku di semua halaman karena navbar-nya sama.
   --------------------------------------------------------- */
function initMobileMenu() {
  var navToggle = document.getElementById('navToggle');
  var navList = document.getElementById('mainNavList');

  if (!navToggle || !navList) {
    return; // elemen tidak ditemukan, hentikan fungsi
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navList.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Tutup menu otomatis saat salah satu link navbar diklik (khusus tampilan HP)
  var navLinks = navList.querySelectorAll('a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navList.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   2. FILTER PRODUK (Classic Watch / Smartwatch)
   Hanya berjalan di collections.html, karena hanya di sana
   ada elemen #productGrid dan .filter-btn.
   Ada animasi fade-in sederhana setiap kali kartu produk
   muncul kembali setelah filter diganti.
   --------------------------------------------------------- */
function initProductFilter() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var productGrid = document.getElementById('productGrid');

  if (filterButtons.length === 0 || !productGrid) {
    return;
  }

  var productCards = productGrid.querySelectorAll('.product-card');
  var emptyMessage = document.getElementById('productEmptyMessage');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var selectedFilter = button.getAttribute('data-filter');

      // Tandai tombol yang aktif
      filterButtons.forEach(function (btn) {
        btn.classList.remove('is-active');
      });
      button.classList.add('is-active');

      // Tampilkan / sembunyikan produk sesuai kategori
      var visibleCount = 0;
      productCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var isMatch = selectedFilter === 'all' || category === selectedFilter;

        if (isMatch) {
          card.hidden = false;
          // Reset lalu tambahkan lagi class animasi supaya efek fade-in
          // selalu terlihat, meskipun kartu ini sudah pernah tampil sebelumnya.
          card.classList.remove('is-visible');
          void card.offsetWidth; // memaksa browser "membaca ulang" elemen (reflow)
          card.classList.add('is-visible');
          visibleCount++;
        } else {
          card.hidden = true;
          card.classList.remove('is-visible');
        }
      });

      // Tampilkan pesan jika tidak ada produk yang cocok
      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    });
  });
}

/* ---------------------------------------------------------
   3. MODAL "ORDER NOW"
   Hanya berjalan di product.html, karena hanya di sana ada
   tombol #openOrderModal dan overlay #orderModalOverlay.

   CATATAN PENTING:
   Website ini adalah static website yang berjalan di GitHub
   Pages tanpa backend/database. Jadi form pemesanan di bawah
   ini HANYA SIMULASI — data yang diisi pengguna tidak benar-benar
   dikirim ke server mana pun, hanya divalidasi dan ditampilkan
   pesan konfirmasi di browser.
   --------------------------------------------------------- */
function initOrderModal() {
  var openButton = document.getElementById('openOrderModal');
  var overlay = document.getElementById('orderModalOverlay');
  var closeButton = document.getElementById('orderModalClose');
  var form = document.getElementById('orderForm');
  var feedbackEl = document.getElementById('orderFormMessage');

  if (!openButton || !overlay) {
    return;
  }

  function openModal() {
    overlay.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }

  openButton.addEventListener('click', openModal);

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Klik di area gelap luar kotak modal juga menutup modal
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      closeModal();
    }
  });

  // Tombol "Escape" di keyboard menutup modal
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('orderName');
      var whatsappInput = document.getElementById('orderWhatsapp');
      var quantityInput = document.getElementById('orderQuantity');

      var isValid = true;
      var message = '';

      if (nameInput && nameInput.value.trim() === '') {
        isValid = false;
        message = 'Nama wajib diisi.';
      } else if (whatsappInput && whatsappInput.value.trim() === '') {
        isValid = false;
        message = 'Nomor WhatsApp wajib diisi.';
      } else if (quantityInput && (Number(quantityInput.value) < 1 || quantityInput.value.trim() === '')) {
        isValid = false;
        message = 'Jumlah pesanan minimal 1.';
      }

      if (isValid) {
        // Simulasi "pesanan tercatat" — tidak ada pengiriman data ke server.
        message = 'Pesanan berhasil dicatat secara demo. Tim LUMORA akan menghubungi WhatsApp kamu.';
      }

      if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.style.color = isValid ? '' : '#B3452F';
      }

      if (isValid) {
        form.reset();
        var productInput = document.getElementById('orderProduct');
        if (productInput) {
          productInput.value = 'LUMORA Heritage';
        }
        window.setTimeout(closeModal, 1800);
      }
    });
  }
}

/* ---------------------------------------------------------
   4 & 5. VALIDASI FORM CONTACT + PESAN BERHASIL
   Hanya berjalan di contact.html, karena hanya di sana ada
   elemen dengan id #contactForm.

   CATATAN: Sama seperti form pemesanan, form ini juga tidak
   terhubung ke backend/database mana pun (GitHub Pages adalah
   static hosting). Validasi dan pesan sukses sepenuhnya
   berjalan di browser pengguna.
   --------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');

  if (!form) {
    return;
  }

  var nameInput = document.getElementById('contactName');
  var emailInput = document.getElementById('contactEmail');
  var whatsappInput = document.getElementById('contactWhatsapp');
  var subjectInput = document.getElementById('contactSubject');
  var messageInput = document.getElementById('contactMessage');
  var feedbackEl = document.getElementById('contactFormMessage');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var result = validateContactForm(nameInput, emailInput, whatsappInput, subjectInput, messageInput);

    if (feedbackEl) {
      feedbackEl.textContent = result.message;
      feedbackEl.style.color = result.isValid ? '' : '#B3452F';
    }

    if (result.isValid) {
      form.reset();
    }
  });
}

/**
 * Mengecek isian form contact satu per satu.
 * Setiap input dicek keberadaannya dulu (defensive), supaya form
 * yang strukturnya berbeda tetap tidak menyebabkan error.
 */
function validateContactForm(nameInput, emailInput, whatsappInput, subjectInput, messageInput) {
  if (nameInput && nameInput.value.trim() === '') {
    return { isValid: false, message: 'Nama wajib diisi.' };
  }

  if (emailInput && !isValidEmail(emailInput.value.trim())) {
    return { isValid: false, message: 'Masukkan alamat email yang valid.' };
  }

  if (whatsappInput && whatsappInput.value.trim() === '') {
    return { isValid: false, message: 'Nomor WhatsApp wajib diisi.' };
  }

  if (subjectInput && subjectInput.value.trim() === '') {
    return { isValid: false, message: 'Subjek wajib diisi.' };
  }

  if (messageInput && messageInput.value.trim() === '') {
    return { isValid: false, message: 'Pesan tidak boleh kosong.' };
  }

  return {
    isValid: true,
    message: 'Pesan berhasil dikirim (demo). Terima kasih telah menghubungi LUMORA Watch.'
  };
}

function isValidEmail(email) {
  var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}