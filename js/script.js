// Toggle navigation menu on small screens
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav ul');
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Tab switching for Paintings page
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Activate correct tab
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Show corresponding content
      const target = btn.getAttribute('data-target');
      tabContents.forEach(section => {
        section.classList.toggle('active', section.id === target);
      });
    });
  });

  // Open modal with painting details
  const galleryImgs = document.querySelectorAll('.gallery img');
  const modal = document.getElementById('painting-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalYear = document.getElementById('modal-year');
  const modalDimensions = document.getElementById('modal-dimensions');
  const modalMedium = document.getElementById('modal-medium');
  const modalPrice = document.getElementById('modal-price');
  const closeBtn = modal.querySelector('.close-modal');

  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      modalTitle.textContent = img.dataset.title;
      modalYear.textContent = img.dataset.year;
      modalDimensions.textContent = img.dataset.dimensions;
      modalMedium.textContent = img.dataset.medium;
      modalPrice.textContent = img.dataset.price;
      modal.showModal();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.close();
  });
});