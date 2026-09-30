// The Contact form, for every page on skyos.ink: any link marked
// data-contact opens it. Built here rather than written into each page, so
// the home page, Terms and Privacy share one copy.
//
// It posts to api.skyos.ink/contact, which saves the message and emails it on
// with the sender's address as reply-to, so answering is just Reply. A native
// <dialog> gives the backdrop, Escape and the focus trap for free; without
// <dialog> support the links stay plain mailto.
(function () {
  var ENDPOINT = 'https://api.skyos.ink/contact';
  var links = document.querySelectorAll('[data-contact]');
  if (!links.length || typeof HTMLDialogElement !== 'function') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'contact';
  dialog.setAttribute('aria-labelledby', 'contactTitle');
  dialog.innerHTML =
    '<button class="contact-x" type="button" data-close aria-label="Close">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<form class="contact-form" novalidate>' +
      '<h2 class="contact-title" id="contactTitle">Contact</h2>' +
      '<p class="contact-lead">Questions, feedback, or something broken — tell me and I\'ll get back to you.</p>' +
      '<label class="contact-label" for="contactMessage">Message</label>' +
      '<textarea class="contact-field contact-area" id="contactMessage" name="message" rows="5" maxlength="4000"></textarea>' +
      '<label class="contact-label" for="contactEmail">Your email</label>' +
      '<input class="contact-field" id="contactEmail" name="email" type="email" autocomplete="email" maxlength="200" placeholder="So I can reply">' +
      // Bots fill every field they find; people never see this one.
      '<input class="contact-trap" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<p class="contact-status" role="status" aria-live="polite"></p>' +
      '<div class="contact-actions"><button class="btn" type="submit" disabled>Send</button></div>' +
    '</form>' +
    '<div class="contact-done" hidden>' +
      '<h2 class="contact-title">Sent</h2>' +
      '<p class="contact-lead">Thanks. I\'ll reply to <span class="contact-to"></span>.</p>' +
      '<div class="contact-actions"><button class="btn" type="button" data-close>Close</button></div>' +
    '</div>';
  document.body.appendChild(dialog);

  var form = dialog.querySelector('.contact-form');
  var done = dialog.querySelector('.contact-done');
  var status = dialog.querySelector('.contact-status');
  var send = form.querySelector('[type=submit]');

  // The address someone used last time, kept in their own browser so a second
  // message doesn't mean typing it again. This site has no sign-in of its own.
  var STORE = 'skyos.contact.email';
  function remembered() { try { return localStorage.getItem(STORE) || ''; } catch (e) { return ''; } }
  function remember(value) { try { localStorage.setItem(STORE, value); } catch (e) { /* private mode */ } }

  // Send stays grey until there is something to send: a message and an email.
  // Whether the email is well formed is checked on Send, with words saying
  // what is wrong, rather than by a button that just won't light up.
  function update() { send.disabled = !(form.message.value.trim() && form.email.value.trim()); }
  function fail(message) { status.textContent = message; status.classList.add('is-error'); }
  function clearStatus() { status.textContent = ''; status.classList.remove('is-error'); }

  function open(e) {
    e.preventDefault();
    form.hidden = false;
    done.hidden = true;
    clearStatus();
    if (!form.email.value) form.email.value = remembered();
    update();
    dialog.showModal();
    form.message.focus();
  }
  function close() { dialog.close(); }

  Array.prototype.forEach.call(links, function (a) { a.addEventListener('click', open); });
  Array.prototype.forEach.call(dialog.querySelectorAll('[data-close]'), function (b) { b.addEventListener('click', close); });
  // A click on the backdrop lands on the dialog element itself.
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });
  // An error is about what was there when Send was pressed; once the fields
  // change it is out of date, so it goes.
  form.addEventListener('input', function () {
    update();
    if (status.classList.contains('is-error')) clearStatus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = form.message.value.trim();
    var email = form.email.value.trim();
    if (!text) { fail('Write a message first.'); form.message.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { fail('Add your email so I can reply.'); form.email.focus(); return; }
    send.disabled = true;
    send.classList.add('is-sending');
    send.textContent = 'Sending…';
    clearStatus();
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, email: email, website: form.website.value })
    })
      .then(function (r) {
        if (r.status === 429) throw new Error('rate');
        if (!r.ok) throw new Error(String(r.status));
      })
      .then(function () {
        remember(email);
        dialog.querySelector('.contact-to').textContent = email;
        form.reset();
        form.hidden = true;
        done.hidden = false;
        done.querySelector('[data-close]').focus();
      })
      .catch(function (err) {
        fail(err && err.message === 'rate'
          ? 'That’s a lot of messages in an hour. Try again later, or email hello@skyos.ink.'
          : 'That didn’t send. Try again, or email hello@skyos.ink.');
      })
      .then(function () {
        send.classList.remove('is-sending');
        send.textContent = 'Send';
        update();
        // Disabling the button while sending drops focus to the page; after a
        // failed send, put it back where the next try starts.
        if (!form.hidden && dialog.open) send.focus();
      });
  });
})();
