// Hero email plaque: copy the address to the clipboard on click and confirm
// it, while the mailto: href still hands off to the OS mail client.
// The ✓ / status only appear on a *successful* copy, never on failure.
(function () {
  var plaque = document.querySelector('.hero-plaque');
  if (!plaque) return;

  var arrow = plaque.querySelector('.hero-plaque-arrow');
  var status = document.querySelector('[data-copy-status]');
  var email = plaque.getAttribute('data-email') ||
    (plaque.getAttribute('href') || '').replace(/^mailto:/, '');
  var copiedLabel = plaque.getAttribute('data-copied') || 'Copied';
  var arrowTimer, statusTimer;

  function showCopied() {
    if (arrow) {
      arrow.textContent = '✓';
      clearTimeout(arrowTimer);
      arrowTimer = setTimeout(function () { arrow.textContent = '→'; }, 2000);
    }
    if (status) {
      status.textContent = copiedLabel;
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { status.textContent = ''; }, 2000);
    }
  }

  // Legacy fallback for browsers / insecure contexts without the async API.
  function legacyCopy() {
    try {
      var ta = document.createElement('textarea');
      ta.value = email;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  plaque.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied, function () {
        if (legacyCopy()) showCopied();
      });
    } else if (legacyCopy()) {
      showCopied();
    }
    // No preventDefault: the mailto: navigation still fires.
  });
})();
