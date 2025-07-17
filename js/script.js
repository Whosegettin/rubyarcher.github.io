document.addEventListener('DOMContentLoaded', () => {
  /* ── burger toggle ───────────────────────────── */
  const hamBtn     = document.getElementById('hamBtn');
  const sidePanel  = document.getElementById('sidePanel');

  hamBtn.addEventListener('click', () => {
    hamBtn.classList.toggle('active');
    sidePanel.classList.toggle('active');
  });
});
