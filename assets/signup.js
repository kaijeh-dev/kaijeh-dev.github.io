// Sign-up form. Submissions go to Formspree, which forwards them to Kaijeh's mailbox.
// If an endpoint is left empty, the button falls back to the visitor's own mail app.
var FORM_ENDPOINTS = { 'line-sheets': 'https://formspree.io/f/mrpqkvay', 'certificates': 'https://formspree.io/f/xbgoyeap' };
var MAIL_TO = { 'line-sheets': 'hello+linesheets@kaijeh.com', 'certificates': 'hello+certificates@kaijeh.com' };
(function () {
  var form = document.getElementById('signup');
  if (!form) return;
  var idea = form.getAttribute('data-idea');
  var msg = document.getElementById('msg');
  var src = (new URLSearchParams(location.search).get('src') || 'direct').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
  function say(t) { msg.textContent = t; msg.hidden = false; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.website.value) return; // honeypot
    var email = form.email.value.trim();
    var today = form.today.value.trim();
    var endpoint = FORM_ENDPOINTS[idea];
    if (!endpoint) {
      var body = 'Please let me know when it is ready.\n\nMy email: ' + email + (today ? '\n\nHow I do it today: ' + today : '') + '\n\n(source: ' + src + ')';
      location.href = 'mailto:' + MAIL_TO[idea] + '?subject=' + encodeURIComponent('Sign-up: ' + idea) + '&body=' + encodeURIComponent(body);
      say('Your mail app should open with a message to us. Press send there to finish.');
      return;
    }
    fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, today: today, idea: idea, source: src }) })
      .then(function (r) { if (!r.ok) throw new Error(); form.reset(); say('Thank you. We will email you once, when there is something to try.'); })
      .catch(function () { say('That did not go through. Please email ' + MAIL_TO[idea] + ' instead.'); });
  });
})();
