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
})();
