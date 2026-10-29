(function () {
  'use strict';

  var itens = window.GALERIA || [];
  var cfg = window.SITE_CONFIG || {};
  var grade = document.getElementById('galeria');
  var lightbox = document.getElementById('lightbox');
  var palco = document.getElementById('lbPalco');
  var filtroAtual = 'todos';
  var listaAberta = [];   // itens navegáveis no lightbox (filtro atual)
  var posAberta = 0;
  var ultimoFoco = null;

  document.getElementById('galeriaInstagram').href = cfg.instagram || '#';
  document.getElementById('galeriaYoutube').href = cfg.youtube || '#';

  var ICONE_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var ROTULO = { casamento: 'Casamento', drone: 'Drone' };

  function escapar(t) {
    var d = document.createElement('div');
    d.textContent = t || '';
    return d.innerHTML;
  }

  // ---------- Monta a grade ----------
  itens.forEach(function (item, idx) {
    var el = document.createElement('button');
    el.type = 'button';
    var classeDestaque = item.destaque === 'largo' ? ' gallery__item--wide'
      : item.destaque ? ' gallery__item--big' : '';
    el.className = 'gallery__item' + classeDestaque;
    el.dataset.categoria = item.categoria;
    el.dataset.idx = idx;
    el.setAttribute('aria-label', (item.tipo === 'video' ? 'Assistir vídeo: ' : 'Ver foto: ') + item.titulo);

    var legenda =
      '<span class="gallery__caption">' +
        '<span class="gallery__tag">' + (ROTULO[item.categoria] || '') + (item.tipo === 'video' ? ' • Vídeo' : '') + '</span>' +
        '<span class="gallery__title">' + escapar(item.titulo) + '</span>' +
      '</span>';

    if (item.tipo === 'video') {
      if (item.youtube) {
        el.innerHTML =
          '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + encodeURIComponent(item.youtube) + '/hqdefault.jpg">' +
          '<span class="gallery__play">' + ICONE_PLAY + '</span>' + legenda;
      } else {
        vazio(el, 'Vídeo em breve', legenda);
      }
    } else {
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = item.titulo || '';
      img.src = item.mini || item.src; // na grade usa a versão pequena
      img.onerror = function () {
        if (item.mini && img.src.indexOf(item.mini) !== -1) { img.src = item.src; return; } // tenta a grande
        vazio(el, 'Foto em breve', legenda);
      };
      el.appendChild(img);
      el.insertAdjacentHTML('beforeend', legenda);
    }

    el.addEventListener('click', function () {
      if (el.classList.contains('is-empty')) return;
      abrir(idx);
    });
    grade.appendChild(el);
  });

  function vazio(el, texto, legenda) {
    el.classList.add('is-empty');
    el.setAttribute('aria-disabled', 'true');
    el.innerHTML = '<span class="gallery__empty">' + texto + '</span>' + legenda;
  }

  // ---------- Filtros ----------
  var botoesFiltro = document.querySelectorAll('#galeriaFiltros .filter');
  botoesFiltro.forEach(function (b) {
    b.addEventListener('click', function () {
      filtroAtual = b.dataset.filtro;
      botoesFiltro.forEach(function (x) {
        var ativo = x === b;
        x.classList.toggle('is-active', ativo);
        x.setAttribute('aria-selected', ativo);
      });
      grade.querySelectorAll('.gallery__item').forEach(function (el) {
        var mostra = filtroAtual === 'todos' || el.dataset.categoria === filtroAtual;
        el.hidden = !mostra;
      });
    });
  });

  // ---------- Lightbox ----------
  function navegaveis() {
    return Array.prototype.filter.call(grade.querySelectorAll('.gallery__item'), function (el) {
      return !el.hidden && !el.classList.contains('is-empty');
    }).map(function (el) { return Number(el.dataset.idx); });
  }

  function abrir(idx) {
    ultimoFoco = document.activeElement;
    listaAberta = navegaveis();
    posAberta = Math.max(0, listaAberta.indexOf(idx));
    mostrar();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.getElementById('lbFechar').focus();
  }

  function mostrar() {
    var item = itens[listaAberta[posAberta]];
    var unico = listaAberta.length < 2;
    document.getElementById('lbAnterior').hidden = unico;
    document.getElementById('lbProximo').hidden = unico;

    if (item.tipo === 'video') {
      palco.innerHTML =
        '<div class="lightbox__video"><iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(item.youtube) + '?autoplay=1&rel=0" title="' + escapar(item.titulo) +
        '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
        '<figcaption>' + escapar(item.titulo) + '</figcaption>';
    } else {
      palco.innerHTML =
        '<img src="' + item.src + '" alt="' + escapar(item.titulo) + '">' +
        '<figcaption>' + escapar(item.titulo) + '</figcaption>';
    }
  }

  function fechar() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (lightbox.classList.contains('is-open')) return; // foi reaberto
      lightbox.hidden = true;
      palco.innerHTML = ''; // para o vídeo
    }, 250);
    if (ultimoFoco) ultimoFoco.focus();
  }

  function passo(n) {
    posAberta = (posAberta + n + listaAberta.length) % listaAberta.length;
    mostrar();
  }

  document.getElementById('lbFechar').addEventListener('click', fechar);
  document.getElementById('lbAnterior').addEventListener('click', function () { passo(-1); });
  document.getElementById('lbProximo').addEventListener('click', function () { passo(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) fechar(); });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft' && listaAberta.length > 1) passo(-1);
    if (e.key === 'ArrowRight' && listaAberta.length > 1) passo(1);
  });

  // Arrastar com o dedo no lightbox
  var x0 = null;
  lightbox.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (x0 === null || listaAberta.length < 2) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) passo(dx < 0 ? 1 : -1);
    x0 = null;
  });
})();
