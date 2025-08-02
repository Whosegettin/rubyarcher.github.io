/*
 * This script provides interactive behaviours across the website.  It
 * preserves the existing hamburger menu toggle and adds functionality
 * specific to the paintings page, including filtering works by
 * availability and sizing thumbnails consistently.  The lightbox
 * overlay code is also defined here to allow visitors to view larger
 * versions of paintings.
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ── burger toggle ───────────────────────────── */
  const hamBtn    = document.getElementById('hamBtn');
  const sidePanel = document.getElementById('sidePanel');

  if (hamBtn && sidePanel) {
    hamBtn.addEventListener('click', () => {
      hamBtn.classList.toggle('active');
      sidePanel.classList.toggle('active');
    });
  }

  /* ── paintings page logic ────────────────────── */
  // Filter buttons appear only on the paintings page.  When clicked
  // they show either all works or only those that are available for sale.
  const allFilter  = document.getElementById('filter-all');
  const saleFilter = document.getElementById('filter-sale');
  const paintItems = document.querySelectorAll('.paint-item');

  function updateFilter(showOnlyForSale) {
    paintItems.forEach(item => {
      const priceSpan = item.querySelector('.price');
      const priceText = priceSpan ? priceSpan.textContent.trim().toLowerCase() : '';
      const isForSale = !(priceText.includes('sold') || priceText.includes('nfs'));
      // When filtering, hide items not for sale; otherwise show all
      if (showOnlyForSale && !isForSale) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
      }
    });
    // update visual state of filter buttons
    if (allFilter) {
      allFilter.classList.toggle('active', !showOnlyForSale);
    }
    if (saleFilter) {
      saleFilter.classList.toggle('active', showOnlyForSale);
    }
  }

  if (allFilter && saleFilter) {
    allFilter.addEventListener('click', () => updateFilter(false));
    saleFilter.addEventListener('click', () => updateFilter(true));
    // default to showing all works
    updateFilter(false);
  }

  // Adjust the size of each painting image based on the listed
  // dimensions.  We derive the orientation (landscape or portrait)
  // from the width and height values extracted from the caption.  A
  // single scaling constant is applied to the longest side to
  // maintain the relative scale of works.  Smaller pieces still
  // receive adequate space, while larger works occupy more of the
  // available row.  In addition, we set the `loading` and
  // `decoding` attributes to improve page performance.
  paintItems.forEach(item => {
    const sizeSpan = item.querySelector('.size');
    const img      = item.querySelector('img');
    if (!sizeSpan || !img) return;
    const sizeText = sizeSpan.textContent;
    // Extract numeric values (allowing decimals) from the size text.
    const numbers  = sizeText.match(/(\d+(?:\.\d+)?)/g);
    if (!numbers || numbers.length < 2) return;
    const widthIn  = parseFloat(numbers[0]);
    const heightIn = parseFloat(numbers[1]);
    if (isNaN(widthIn) || isNaN(heightIn) || widthIn <= 0 || heightIn <= 0) return;
    // Determine the longest side and scale it to pixels.  The
    // constant determines how many pixels correspond to one inch.  On
    // narrow screens (e.g. mobile phones) we use a smaller factor so
    // that images do not become excessively tall, improving the
    // browsing experience.  For wider screens a larger factor helps
    // convey relative scale between works.
    const longest   = Math.max(widthIn, heightIn);
    const pxPerInch = window.innerWidth <= 600 ? 12 : 15;
    const majorPx   = longest * pxPerInch;
    // Apply orientation: landscape paintings set the width, portrait
    // paintings set the height.  The other dimension remains auto to
    // preserve the intrinsic aspect ratio.
    if (widthIn >= heightIn) {
      img.style.width  = `${majorPx}px`;
      img.style.height = 'auto';
    } else {
      img.style.height = `${majorPx}px`;
      img.style.width  = 'auto';
    }
    // Ensure the browser reserves space for the image and defers
    // decoding and loading offscreen images to improve perceived
    // performance.
    img.loading  = 'lazy';
    img.decoding = 'async';
  });

  /* ── lightbox overlay ─────────────────────────────── */
  // Create a reusable lightbox overlay to display enlarged versions
  // of paintings.  A close button (×) is added to the top‑left corner
  // for explicit closing on both desktop and mobile.  Clicking
  // outside the image also closes the overlay.
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);
  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('lightbox-close');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  lightbox.appendChild(closeBtn);
  // Handler to close overlay when clicking the button
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightbox.querySelectorAll('img').forEach(el => el.remove());
    document.body.style.overflow = '';
  });
  // When a painting is clicked, populate and open the lightbox.
  paintItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      // Clone the image to avoid manipulating the original element.  We
      // rely on CSS in paintings.css to size the image so it fills
      // the screen while preserving aspect ratio.
      const clone = img.cloneNode();
      // Remove any inline sizing that might have been applied to
      // thumbnails.  The lightbox styles will handle scaling.
      clone.style.width = '';
      clone.style.height = '';
      clone.style.maxWidth = '';
      clone.style.maxHeight = '';
      clone.style.objectFit = '';
      // Remove any previous enlarged image but retain the close button.
      lightbox.querySelectorAll('img').forEach(el => el.remove());
      lightbox.appendChild(clone);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  // Close the lightbox when clicking outside the image and not on the close button.
  lightbox.addEventListener('click', event => {
    if (event.target === closeBtn) return;
    // If the click is on the overlay itself (not the image), close
    if (event.target === lightbox) {
      lightbox.classList.remove('active');
      lightbox.querySelectorAll('img').forEach(el => el.remove());
      document.body.style.overflow = '';
    }
  });
});