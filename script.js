/* ==========================================================================
   ESTELAR CLIMATIZAÇÃO INTELIGENTE — script.js
   JavaScript puro, sem dependências externas.
   ========================================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5518991690009';

  /* ---------------------------------------------------------------------
     Tema (claro/escuro) — respeita preferência salva ou do sistema
  --------------------------------------------------------------------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('estelar-theme'); } catch (e) { /* storage indisponível */ }
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  })();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('estelar-theme', next); } catch (e) { /* ignora */ }
    });
  }

  /* ---------------------------------------------------------------------
     Header: transparente -> sólido ao rolar
  --------------------------------------------------------------------- */
  var header = document.getElementById('header');
  var fabTop = document.getElementById('fabTop');

  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    if (fabTop) fabTop.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (fabTop) {
    fabTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     Menu mobile (hambúrguer)
  --------------------------------------------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var navMobile = document.getElementById('navMobile');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      navMobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------------------------------------------------------------
     Partículas leves no hero (canvas, sensação de "ar")
  --------------------------------------------------------------------- */
  (function initParticles() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h, dpr;

    function resize() {
      var hero = canvas.closest('.hero');
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticles() {
      var count = Math.min(60, Math.round((w * h) / 22000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.6,
          vy: -(Math.random() * 0.35 + 0.08),
          vx: (Math.random() - 0.5) * 0.18,
          o: Math.random() * 0.5 + 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    makeParticles();
    draw();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { resize(); makeParticles(); }, 200);
    });
  })();

  /* ---------------------------------------------------------------------
     Modal de orçamento
  --------------------------------------------------------------------- */
  var modalOverlay = document.getElementById('modalOverlay');
  var modalClose = document.getElementById('modalClose');
  var form = document.getElementById('orcamentoForm');
  var lastFocused = null;

  function openModal(prefillServico) {
    lastFocused = document.activeElement;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (prefillServico) {
      var servicoField = document.getElementById('f-servico');
      if (servicoField) servicoField.value = prefillServico;
    }
    var firstField = document.getElementById('f-nome');
    if (firstField) setTimeout(function () { firstField.focus(); }, 320);
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-orcamento]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileNav();
      openModal();
    });
  });

  document.querySelectorAll('[data-service]').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card.getAttribute('data-service'));
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  /* ---------------------------------------------------------------------
     Validação + envio do formulário -> WhatsApp
  --------------------------------------------------------------------- */
  function setError(fieldId, message) {
    var el = document.querySelector('[data-error-for="' + fieldId + '"]');
    if (el) el.textContent = message || '';
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  function validateForm(data) {
    var valid = true;
    ['f-nome', 'f-cidade', 'f-telefone', 'f-servico'].forEach(function (id) { setError(id, ''); });

    if (!data.nome || data.nome.trim().length < 2) {
      setError('f-nome', 'Informe seu nome completo.');
      valid = false;
    }
    if (!data.cidade) {
      setError('f-cidade', 'Selecione sua cidade.');
      valid = false;
    }
    var telDigits = (data.telefone || '').replace(/\D/g, '');
    if (telDigits.length < 10) {
      setError('f-telefone', 'Informe um telefone válido com DDD.');
      valid = false;
    }
    if (!data.servico) {
      setError('f-servico', 'Selecione o serviço desejado.');
      valid = false;
    }
    return valid;
  }

  function buildWhatsAppMessage(data) {
    var lines = [
      '*Solicitação de Orçamento — Estelar Climatização*',
      '',
      '*Nome:* ' + data.nome,
      '*Cidade:* ' + data.cidade,
      '*Telefone:* ' + data.telefone,
      '*Serviço:* ' + data.servico
    ];
    if (data.marca) lines.push('*Marca do equipamento:* ' + data.marca);
    if (data.btus) lines.push('*BTUs:* ' + data.btus);
    if (data.quantidade) lines.push('*Quantidade de aparelhos:* ' + data.quantidade);
    if (data.mensagem) lines.push('*Mensagem adicional:* ' + data.mensagem);
    return lines.join('\n');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      if (!validateForm(data)) return;

      var message = buildWhatsAppMessage(data);
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      showToast('Abrindo o WhatsApp com seu orçamento...');
      window.open(url, '_blank', 'noopener');
      form.reset();
      closeModal();
    });
  }

  /* ---------------------------------------------------------------------
     VENDAS — modal de marcas -> WhatsApp
  --------------------------------------------------------------------- */
  var modalVendasOverlay = document.getElementById('modalVendasOverlay');
  var modalVendasClose = document.getElementById('modalVendasClose');
  var vendasForm = document.getElementById('vendasForm');
  var lastFocusedVendas = null;

  function openVendasModal(prefillMarca) {
    lastFocusedVendas = document.activeElement;
    modalVendasOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (prefillMarca) {
      var marcaField = document.getElementById('v-marca');
      if (marcaField) marcaField.value = prefillMarca;
    }
    var firstField = document.getElementById('v-nome');
    if (firstField) setTimeout(function () { firstField.focus(); }, 320);
  }

  function closeVendasModal() {
    modalVendasOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedVendas) lastFocusedVendas.focus();
  }

  document.querySelectorAll('[data-marca]').forEach(function (card) {
    card.addEventListener('click', function () {
      openVendasModal(card.getAttribute('data-marca'));
    });
  });

  document.querySelectorAll('[data-open-vendas]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      closeMobileNav();
      openVendasModal();
    });
  });

  if (modalVendasClose) modalVendasClose.addEventListener('click', closeVendasModal);
  if (modalVendasOverlay) {
    modalVendasOverlay.addEventListener('click', function (e) {
      if (e.target === modalVendasOverlay) closeVendasModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalVendasOverlay.classList.contains('open')) closeVendasModal();
  });

  function validateVendasForm(data) {
    var valid = true;
    ['v-nome', 'v-cidade', 'v-telefone', 'v-produto'].forEach(function (id) { setError(id, ''); });

    if (!data.nome || data.nome.trim().length < 2) {
      setError('v-nome', 'Informe seu nome completo.');
      valid = false;
    }
    if (!data.cidade) {
      setError('v-cidade', 'Selecione sua cidade.');
      valid = false;
    }
    var telDigits = (data.telefone || '').replace(/\D/g, '');
    if (telDigits.length < 10) {
      setError('v-telefone', 'Informe um telefone válido com DDD.');
      valid = false;
    }
    if (!data.produto) {
      setError('v-produto', 'Selecione o produto de interesse.');
      valid = false;
    }
    return valid;
  }

  function buildVendasMessage(data) {
    var lines = [
      '*Interesse em compra — Estelar Climatização*',
      '',
      '*Nome:* ' + data.nome,
      '*Cidade:* ' + data.cidade,
      '*Telefone:* ' + data.telefone,
      '*Produto:* ' + data.produto
    ];
    if (data.marca) lines.push('*Marca de interesse:* ' + data.marca);
    if (data.btus) lines.push('*BTUs:* ' + data.btus);
    if (data.mensagem) lines.push('*Mensagem adicional:* ' + data.mensagem);
    return lines.join('\n');
  }

  if (vendasForm) {
    vendasForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(vendasForm);
      var data = {};
      formData.forEach(function (value, key) { data[key] = value; });

      if (!validateVendasForm(data)) return;

      var message = buildVendasMessage(data);
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      showToast('Abrindo o WhatsApp com seu pedido...');
      window.open(url, '_blank', 'noopener');
      vendasForm.reset();
      closeVendasModal();
    });
  }

  /* ---------------------------------------------------------------------
     Slider de depoimentos
  --------------------------------------------------------------------- */
  (function initTestimonials() {
    var track = document.getElementById('testiSlides');
    var dotsWrap = document.getElementById('testiDots');
    if (!track || !dotsWrap) return;

    var slides = track.children;
    var count = slides.length;
    var index = 0;
    var timer;

    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ver depoimento ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () { goTo(idx); });
      })(i);
      dotsWrap.appendChild(dot);
    }

    function goTo(i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, di) {
        d.classList.toggle('active', di === index);
      });
    }

    function next() { goTo(index + 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, 6000);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); }

    track.closest('.testi-track').addEventListener('mouseenter', stopAutoplay);
    track.closest('.testi-track').addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  })();

  /* ---------------------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------------------------------------------------------------------
     Ano dinâmico no rodapé
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Registro do Service Worker (PWA)
  --------------------------------------------------------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        /* Falha silenciosa: o site continua funcionando normalmente sem PWA */
      });
    });
  }

})();
