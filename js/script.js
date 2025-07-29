/*
 * This script provides several interactive behaviours across the
 * website.  It preserves the existing hamburger menu toggle and adds
 * functionality specific to the paintings page, including filtering
 * works by availability and adjusting image aspect ratios based on
 * dimensions listed in the captions.
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
  // available grid cell.  In addition, we set the `loading` and
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
    // constant determines how many pixels correspond to one inch.  A
    // value of 15 yields full‑size images that remain comfortably
    // within the responsive grid.
    const longest   = Math.max(widthIn, heightIn);
    const pxPerInch = 15;
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
  // of paintings.  Clicking on any painting image will clone that
  // image into the overlay and reveal it.  Clicking the overlay
  // itself closes it.  This enhancement adds an interactive element
  // without detracting from the minimalist design.
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);
  // When a painting is clicked, populate and open the lightbox.
  paintItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      // Clone the image to avoid manipulating the original element.
      const clone = img.cloneNode();
      // Limit the clone to the viewport; use contain to preserve
      // aspect ratio.
      clone.style.maxWidth  = '90%';
      clone.style.maxHeight = '90%';
      clone.style.objectFit = 'contain';
      lightbox.innerHTML = '';
      lightbox.appendChild(clone);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  // Close the lightbox when clicking outside the image.
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    lightbox.classList.remove('active');
    lightbox.innerHTML = '';
    document.body.style.overflow = '';
  });
});