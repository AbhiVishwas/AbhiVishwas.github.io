(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Call timer ---------- */
  var callText = document.getElementById('calltext');
  var call = document.getElementById('call');
  var objBtn = document.getElementById('objbtn');
  var timer = null;

  function callDone() {
    clearInterval(timer);
    call.classList.add('done');
    callText.textContent = '0:30. Still here?';
    if (!reduce) objBtn.classList.add('nudge');
  }

  if (reduce) {
    callDone();
  } else {
    var s = 0;
    timer = setInterval(function () {
      s++;
      if (s >= 30) { callDone(); return; }
      callText.textContent = 'On the line 0:' + (s < 10 ? '0' + s : s);
    }, 1000);
  }

  /* ---------- Objection handler ---------- */
  var panel = document.getElementById('obj');
  var answerBox = document.getElementById('objanswer');
  var youLine = document.getElementById('objyou');
  var outText = document.getElementById('objtext');
  var cta = document.getElementById('objcta');
  var EMAIL = 'abhivishwas7@gmail.com';

  var answers = {
    resume: {
      text: "Happy to. Before I do, what's the one thing this role needs most in the first 90 days? I'll send it with the parts that match up top, so you're not digging.",
      cta: 'Request my resume',
      href: 'mailto:' + EMAIL + '?subject=Resume%20request'
    },
    reps: {
      text: "Fair. Most teams feel that way right up until pipeline gets thin. When that happens, I'd like to be your first call. Mind if I check back next quarter?",
      cta: 'Keep me on file',
      href: 'mailto:' + EMAIL + '?subject=Let%27s%20stay%20in%20touch'
    },
    numbers: {
      text: "At Salesforce, about 300 meetings, $14M in qualified pipeline and $2.41M closed. At Canary, 107% of quota. Want the story behind any of those?",
      cta: 'Ask me about it',
      href: 'mailto:' + EMAIL + '?subject=Tell%20me%20more'
    },
    why: {
      text: "Because the first conversation is a puzzle. Figuring out what someone actually needs before anyone mentions software is my favorite part of the job.",
      cta: 'Talk shop with me',
      href: 'mailto:' + EMAIL + '?subject=Talking%20shop'
    },
    no: {
      text: "Totally fair, and thanks for being straight with me. Is it timing or fit? Either way, I'll leave you alone after this one.",
      cta: 'Actually, let’s talk',
      href: 'mailto:' + EMAIL
    }
  };

  objBtn.addEventListener('click', function () {
    var open = panel.hasAttribute('hidden');
    if (open) {
      panel.removeAttribute('hidden');
      objBtn.setAttribute('aria-expanded', 'true');
      objBtn.textContent = 'Close objections';
      objBtn.classList.remove('nudge');
      if (timer) { callDone(); objBtn.classList.remove('nudge'); }
      var first = panel.querySelector('.obj-chips button');
      if (first) first.focus();
    } else {
      panel.setAttribute('hidden', '');
      objBtn.setAttribute('aria-expanded', 'false');
      objBtn.textContent = 'Throw me an objection';
    }
  });

  var typing = null;
  function typeOut(str, done) {
    clearInterval(typing);
    outText.textContent = '';
    answerBox.classList.add('typing');
    if (reduce) { outText.textContent = str; answerBox.classList.remove('typing'); done(); return; }
    var i = 0;
    typing = setInterval(function () {
      i += 2;
      outText.textContent = str.slice(0, i);
      if (i >= str.length) { clearInterval(typing); answerBox.classList.remove('typing'); done(); }
    }, 22);
  }

  panel.querySelectorAll('.obj-chips button').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = answers[b.getAttribute('data-o')];
      panel.querySelectorAll('.obj-chips button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      answerBox.removeAttribute('hidden');
      youLine.textContent = '“' + b.textContent + '”';
      cta.setAttribute('hidden', '');
      typeOut(a.text, function () {
        cta.textContent = a.cta;
        cta.href = a.href;
        cta.removeAttribute('hidden');
      });
    });
  });

  /* ---------- Photo strip printer ---------- */
  var strips = Array.prototype.slice.call(document.querySelectorAll('.strip'));
  var printBtn = document.getElementById('printbtn');
  var cur = 0;
  if (printBtn && strips.length) {
    printBtn.addEventListener('click', function () {
      var prev = strips[cur];
      cur = (cur + 1) % strips.length;
      var next = strips[cur];
      prev.classList.remove('is-on', 'printing');
      next.classList.remove('printing');
      void next.offsetWidth; // restart the animation
      next.classList.add('is-on');
      if (!reduce) next.classList.add('printing');
    });
  }
})();
