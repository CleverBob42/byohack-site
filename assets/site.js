(function () {
  var q = new URLSearchParams(location.search);
  var form = document.querySelector('form.contact');
  if (q.get('sent') === '1') {
    document.getElementById('sent').hidden = false;
    if (form) form.hidden = true;
  } else if (q.get('error')) {
    var err = document.getElementById('error');
    err.textContent = q.get('error') === 'invalid'
      ? 'Please enter your name, a valid email address and a message.'
      : 'Sorry, your message could not be sent. Please try again in a few minutes.';
    err.hidden = false;
  }
  if (form) {
    form.addEventListener('submit', function () {
      var b = form.querySelector('button');
      b.disabled = true;
      b.textContent = 'Sending…';
    });
  }

  var badge = document.querySelector('[data-store]');
  if (badge) {
    window.byohackStore = function (data) {
      var app = data && data.results && data.results[0];
      if (!app || !app.trackViewUrl) return;
      document.querySelectorAll('[data-store]').forEach(function (a) {
        a.href = app.trackViewUrl;
        a.querySelector('[data-store-label]').textContent = 'Download on the';
      });
      document.querySelectorAll('[data-store-text]').forEach(function (p) {
        p.textContent = 'BYOHack is available now on the App Store for iPhone.';
      });
    };
    var s = document.createElement('script');
    s.src = 'https://itunes.apple.com/lookup?id=' + badge.getAttribute('data-store') + '&country=au&callback=byohackStore';
    document.head.appendChild(s);
  }
})();
