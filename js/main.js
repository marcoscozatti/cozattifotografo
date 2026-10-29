(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var root = document.documentElement;

  // ---------- Tema claro / escuro ----------
  function temaAtual() {
    var salvo = root.getAttribute('data-theme');
    if (salvo) return salvo;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.getElementById('themeToggle').addEventListener('click', function () {
    var novo = temaAtual() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
  });

  // ---------- Menu mobile ----------
  var nav = document.getElementById('nav');
  var menuToggle = document.getElementById('menuToggle');

  menuToggle.addEventListener('click', function () {
    var aberto = nav.classList.toggle('nav--open');
    menuToggle.classList.toggle('is-open', aberto);
    menuToggle.setAttribute('aria-expanded', aberto);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav--open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Cabeçalho ao rolar + link ativo ----------
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }, { passive: true });

  var links = document.querySelectorAll('.nav__link');
  var secoes = document.querySelectorAll('main section[id]');
  var obsSecao = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secoes.forEach(function (s) { obsSecao.observe(s); });

  // ---------- Animação ao aparecer ----------
  var obsReveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obsReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { obsReveal.observe(el); });

  // ---------- Slide da tela inicial ----------
  var slider = document.getElementById('slider');
  var slides = slider.querySelectorAll('.slide');
  var dots = document.querySelectorAll('#slideDots button');
  var atual = 0;
  var timer = null;
  var INTERVALO = 6000; // 6 segundos por imagem
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var heroCta = document.getElementById('heroCta');

  function irPara(i) {
    atual = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === atual); });
    dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === atual); });
    var s = slides[atual];
    heroCta.textContent = s.dataset.ctaTexto || 'Solicitar orçamento';
    heroCta.setAttribute('href', s.dataset.ctaHref || '#contato');
  }

  // Botão abaixo do slide: se o slide tem um serviço, já marca no formulário
  heroCta.addEventListener('click', function () {
    var servico = slides[atual].dataset.servico;
    if (!servico) return;
    var radio = document.querySelector('#formContato input[name="servico"][value="' + servico + '"]');
    if (radio) radio.checked = true;
  });
  function iniciar() {
    if (semMovimento) return;
    parar();
    timer = setInterval(function () { irPara(atual + 1); }, INTERVALO);
  }
  function parar() { if (timer) clearInterval(timer); timer = null; }

  document.getElementById('slidePrev').addEventListener('click', function () { irPara(atual - 1); iniciar(); });
  document.getElementById('slideNext').addEventListener('click', function () { irPara(atual + 1); iniciar(); });
  dots.forEach(function (d, idx) { d.addEventListener('click', function () { irPara(idx); iniciar(); }); });

  // Arrastar com o dedo (celular)
  var toqueX = null;
  var hero = document.getElementById('inicio');
  hero.addEventListener('touchstart', function (e) { toqueX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) { irPara(atual + (dx < 0 ? 1 : -1)); iniciar(); }
    toqueX = null;
  });

  // Pausa quando a aba não está visível
  document.addEventListener('visibilitychange', function () { document.hidden ? parar() : iniciar(); });
  iniciar();

  // ---------- Links sociais ----------
  var waBase = 'https://wa.me/' + (cfg.whatsapp || '');
  var waMsg = encodeURIComponent('Olá! Vim pelo site e gostaria de mais informações.');
  document.getElementById('linkWhatsapp').href = waBase + '?text=' + waMsg;
  document.getElementById('whatsappFloat').href = waBase + '?text=' + waMsg;
  document.getElementById('linkInstagram').href = cfg.instagram || '#';
  document.getElementById('linkYoutube').href = cfg.youtube || '#';

  // ---------- Serviços -> formulário ----------
  var form = document.getElementById('formContato');

  document.querySelectorAll('[data-servico]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var servico = btn.getAttribute('data-servico');
      var radio = form.querySelector('input[name="servico"][value="' + servico + '"]');
      if (radio) radio.checked = true;
      document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { form.querySelector('input[name="nome"]').focus({ preventScroll: true }); }, 600);
    });
  });

  // ---------- Envio do formulário ----------
  // Por enquanto envia pelo WhatsApp. Depois podemos também salvar no Supabase.
  var status = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var nome = (d.get('nome') || '').trim();
    var telefone = (d.get('telefone') || '').trim();
    var servico = d.get('servico');
    var mensagem = (d.get('mensagem') || '').trim();

    if (!nome || !telefone || !servico || !mensagem) {
      status.textContent = 'Preencha os campos obrigatórios (*) e escolha um serviço.';
      status.className = 'form__status is-error';
      return;
    }

    var dataPrev = d.get('data');
    if (dataPrev) {
      var p = dataPrev.split('-');
      dataPrev = p[2] + '/' + p[1] + '/' + p[0];
    }

    var linhas = [
      '*Nova solicitação pelo site*',
      '',
      '*Serviço:* ' + servico,
      '*Nome:* ' + nome,
      '*Telefone:* ' + telefone
    ];
    if (d.get('email')) linhas.push('*E-mail:* ' + d.get('email'));
    if (dataPrev) linhas.push('*Data prevista:* ' + dataPrev);
    if (d.get('local')) linhas.push('*Local:* ' + d.get('local'));
    linhas.push('', '*Mensagem:*', mensagem);

    window.open(waBase + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank');

    status.textContent = 'Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem!';
    status.className = 'form__status is-ok';
    form.reset();
  });

  // ---------- Ano no rodapé ----------
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
