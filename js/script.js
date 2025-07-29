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

  // Adjust aspect ratios of paintings based on dimensions specified in
  // the caption.  This uses the CSS aspect-ratio property which is
  // supported by modern browsers.  If a caption contains a size like
  // "11" × 25"" the numbers are extracted and used to set the ratio.
  paintItems.forEach(item => {
    const sizeSpan = item.querySelector('.size');
    const img      = item.querySelector('img');
    if (!sizeSpan || !img) return;
    const sizeText = sizeSpan.textContent;
    // Capture numbers including decimals; the regex returns an array
    const numbers = sizeText.match(/(\d+(?:\.\d+)?)/g);
    if (!numbers || numbers.length < 2) return;
    const width  = parseFloat(numbers[0]);
    const height = parseFloat(numbers[1]);
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      // Set the aspect ratio on the image so its box reflects the
      // painting's proportions.  Width of 100% is defined in CSS.
      img.style.aspectRatio = `${width} / ${height}`;
    }
  });
});
