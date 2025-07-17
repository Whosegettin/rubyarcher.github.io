document.addEventListener('DOMContentLoaded', () => {
  //
  // ── 1. ☰ MENU PANEL TOGGLE ────────────────────────────────────────────────
  //
  const menuBtn   = document.querySelector('.menu-toggle');
  const sidePanel = document.querySelector('.side-menu');
  if (menuBtn && sidePanel) {
    menuBtn.addEventListener('click', () => {
      sidePanel.classList.toggle('active');
    });
  }

  //
  // ── 2. EXISTING: Toggle navigation menu on small screens ──────────────────
  //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('nav ul');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  //
  // ── 3. EXISTING: Tab switching for Paintings page ──────────────────────────
  //
  const tabButtons  = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.target;
      tabContents.forEach(section => {
        section.classList.toggle('active', section.id === target);
      });
    });
  });

  //
  // ── 4. EXISTING: Open modal with painting details ───────────────────────────
  //
  const galleryImgs    = document.querySelectorAll('.gallery img');
  const modal          = document.getElementById('painting-modal');
  const modalTitle     = document.getElementById('modal-title');
  const modalYear      = document.getElementById('modal-year');
  const modalDimensions= document.getElementById('modal-dimensions');
  const modalMedium    = document.getElementById('modal-medium');
  const modalPrice     = document.getElementById('modal-price');
  const closeBtn       = modal?.querySelector('.close-modal');

  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      modalTitle.textContent      = img.dataset.title;
      modalYear.textContent       = img.dataset.year;
      modalDimensions.textContent = img.dataset.dimensions;
      modalMedium.textContent     = img.dataset.medium;
      modalPrice.textContent      = img.dataset.price;
      modal.showModal();
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.close();
  });
});
