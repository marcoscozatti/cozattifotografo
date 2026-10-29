(function () {
  'use strict';

  // Os álbuns são editados em js/albuns-dados.js
  var cfg = window.SITE_CONFIG || {};
  var albuns = (window.ALBUNS || []).map(normalizar);

  var lista = document.getElementById('albunsLista');
  var gradeAlbuns = document.getElementById('albuns');
  var avisoVazio = document.getElementById('albunsVazio');
  var vista = document.getElementById('albumAberto');
  var grade = document.getElementById('galeria');
  var lightbox = document.getElementById('lightbox');
  var palco = document.getElementById('lbPalco');
  var secao = document.getElementById('portfolio');

  var albumAtual = null;
  var listaAberta = [];   // itens navegáveis no lightbox (álbum atual)
  var posAberta = 0;
  var ultimoFoco = null;

  document.getElementById('galeriaInstagram').href = cfg.instagram || '#';
  document.getElementById('galeriaYoutube').href = cfg.youtube || '#';

  var ICONE_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var ROTULO = { casamento: 'Casamento', ensaio: 'Ensaio', drone: 'Drone' };

  function escapar(t) {
    var d = document.createElement('div');
    d.textContent = t == null ? '' : String(t);
    return d.innerHTML;
  }

  function dois(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

  // Converte o que foi escrito em albuns-dados.js numa lista de itens prontos para a tela
  function normalizar(a) {
    var base = 'img/albuns/' + a.pasta + '/';
    var fotos = a.fotos || [];
    if (typeof fotos === 'number') {
      var qtd = fotos; fotos = [];
      for (var i = 1; i <= qtd; i++) fotos.push(dois(i));
    }
    var itens = fotos.map(function (f) {
      var partes = String(f).trim().split(/\s+/);
      var nome = partes[0];
      if (!/\.[a-z0-9]+$/i.test(nome)) nome += '.jpg';
      return { tipo: 'foto', src: base + nome, mini: base + 'mini/' + nome, destaque: partes[1] || '' };
    });
    (a.videos || []).forEach(function (v) {
      if (v && v.youtube) itens.push({ tipo: 'video', youtube: v.youtube, titulo: v.titulo || '', destaque: v.destaque || '' });
    });

    var capa = null;
    if (a.capa) {
      var c = String(a.capa); if (!/\.[a-z0-9]+$/i.test(c)) c += '.jpg';
      capa = { src: base + c, mini: base + 'mini/' + c };
    } else if (itens[0]) {
      capa = itens[0].tipo === 'foto' ? itens[0]
        : { src: 'https://i.ytimg.com/vi/' + encodeURIComponent(itens[0].youtube) + '/hqdefault.jpg' };
    }

    var nFotos = itens.filter(function (x) { return x.tipo === 'foto'; }).length;
    var nVideos = itens.length - nFotos;
    return {
      pasta: a.pasta, titulo: a.titulo || a.pasta, categoria: a.categoria || '',
      local: a.local || '', data: a.data || '', descricao: a.descricao || '',
      capa: capa, itens: itens, nFotos: nFotos, nVideos: nVideos
    };
  }

  function contagem(a) {
    var p = [];
    if (a.nFotos) p.push(a.nFotos + (a.nFotos === 1 ? ' foto' : ' fotos'));
    if (a.nVideos) p.push(a.nVideos + (a.nVideos === 1 ? ' vídeo' : ' vídeos'));
    return p.join(' • ');
  }

  // Carrega a versão pequena; se faltar, tenta a grande; se faltar também, chama "falhou"
  function imagem(item, alt, falhou) {
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = alt || '';
    img.src = item.mini || item.src;
    img.onerror = function () {
      if (item.mini && img.src.indexOf(item.mini) !== -1) { img.src = item.src; return; }
      falhou();
    };
    return img;
  }

  // ---------- Lista de álbuns ----------
  albuns.forEach(function (a) {
    var vazio = a.itens.length === 0;
    var el = document.createElement(vazio ? 'div' : 'a');
    el.className = 'album' + (vazio ? ' is-empty' : '');
    el.dataset.categoria = a.categoria;
    if (!vazio) {
      el.href = '#album/' + a.pasta;
      el.setAttribute('aria-label', 'Abrir álbum ' + a.titulo + ' (' + contagem(a) + ')');
    }

    var capa = document.createElement('div');
    capa.className = 'album__cover';
    function semCapa() { capa.innerHTML = '<span class="album__soon">' + (vazio ? 'Em breve' : 'Sem capa') + '</span>'; }
    if (a.capa) capa.appendChild(imagem(a.capa, '', semCapa)); else semCapa();
    if (a.nVideos && !a.nFotos) capa.insertAdjacentHTML('beforeend', '<span class="gallery__play">' + ICONE_PLAY + '</span>');
    el.appendChild(capa);

    el.insertAdjacentHTML('beforeend',
      '<div class="album__body">' +
        '<span class="album__tag">' + escapar(ROTULO[a.categoria] || a.categoria) + '</span>' +
        '<span class="album__title">' + escapar(a.titulo) + '</span>' +
        '<span class="album__meta">' + escapar(vazio ? 'Em breve' : [contagem(a), a.local].filter(Boolean).join(' • ')) + '</span>' +
      '</div>');
    gradeAlbuns.appendChild(el);
  });

  // ---------- Filtros ----------
  var botoesFiltro = document.querySelectorAll('#galeriaFiltros .filter');
  function filtrar(filtro) {
    var visiveis = 0;
    botoesFiltro.forEach(function (x) {
      var ativo = x.dataset.filtro === filtro;
      x.classList.toggle('is-active', ativo);
      x.setAttribute('aria-selected', ativo);
    });
    gradeAlbuns.querySelectorAll('.album').forEach(function (el) {
      var mostra = filtro === 'todos' || el.dataset.categoria === filtro;
      el.hidden = !mostra;
      if (mostra) visiveis++;
    });
    avisoVazio.hidden = visiveis > 0;
  }
  botoesFiltro.forEach(function (b) {
    b.addEventListener('click', function () { filtrar(b.dataset.filtro); });
  });

  // ---------- Álbum aberto ----------
  function abrirAlbum(a, rolar) {
    albumAtual = a;
    grade.innerHTML = '';
    document.getElementById('albumTag').textContent = ROTULO[a.categoria] || a.categoria;
    document.getElementById('albumTitulo').textContent = a.titulo;
    document.getElementById('albumMeta').textContent = [contagem(a), a.local, a.data].filter(Boolean).join(' • ');
    var desc = document.getElementById('albumDesc');
    desc.textContent = a.descricao;
    desc.hidden = !a.descricao;

    a.itens.forEach(function (item, idx) {
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'gallery__item' +
        (item.destaque === 'largo' ? ' gallery__item--wide' : item.destaque === 'alto' ? ' gallery__item--big' : '');
      el.dataset.idx = idx;
      var rotulo = item.tipo === 'video' ? (item.titulo || 'Vídeo') : a.titulo + ', foto ' + (idx + 1);
      el.setAttribute('aria-label', (item.tipo === 'video' ? 'Assistir vídeo: ' : 'Ampliar ') + rotulo);

      if (item.tipo === 'video') {
        el.innerHTML =
          '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + encodeURIComponent(item.youtube) + '/hqdefault.jpg">' +
          '<span class="gallery__play">' + ICONE_PLAY + '</span>' +
          (item.titulo ? '<span class="gallery__caption"><span class="gallery__title">' + escapar(item.titulo) + '</span></span>' : '');
      } else {
        el.appendChild(imagem(item, rotulo, function () { el.remove(); })); // foto que não existe some da grade
      }
      el.addEventListener('click', function () { abrir(idx); });
      grade.appendChild(el);
    });

    lista.hidden = true;
    vista.hidden = false;
    document.title = a.titulo + ' | Photos.Cozatti';
    if (rolar) {
      secao.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('albumTitulo').focus({ preventScroll: true });
    }
  }

  var tituloOriginal = document.title;
  function fecharAlbum() {
    if (!albumAtual) return;
    var pasta = albumAtual.pasta;
    albumAtual = null;
    vista.hidden = true;
    lista.hidden = false;
    grade.innerHTML = '';
    document.title = tituloOriginal;
    var card = gradeAlbuns.querySelector('a[href="#album/' + pasta + '"]');
    secao.scrollIntoView({ behavior: 'smooth' });
    if (card) card.focus({ preventScroll: true });
  }

  document.getElementById('albumVoltar').addEventListener('click', function () {
    if (location.hash.indexOf('#album/') === 0) {
      history.pushState(null, '', '#portfolio');
    }
    fecharAlbum();
  });

  // Cada álbum tem um endereço próprio: #album/nome-da-pasta
  function rotear(primeiraVez) {
    var m = location.hash.match(/^#album\/(.+)$/);
    if (m) {
      var pasta = decodeURIComponent(m[1]);
      var a = albuns.filter(function (x) { return x.pasta === pasta; })[0];
      if (a && a.itens.length) {
        if (albumAtual !== a) abrirAlbum(a, true);
        return;
      }
    }
    if (albumAtual && (!m || location.hash === '#portfolio')) fecharAlbum();
    if (primeiraVez && m) history.replaceState(null, '', '#portfolio');
  }
  window.addEventListener('hashchange', function () { rotear(false); });
  rotear(true);

  // ---------- Lightbox ----------
  function abrir(idx) {
    ultimoFoco = document.activeElement;
    // só os itens que ainda estão na grade (fotos que não existem foram removidas)
    listaAberta = Array.prototype.map.call(grade.querySelectorAll('.gallery__item'), function (el) {
      return Number(el.dataset.idx);
    });
    posAberta = Math.max(0, listaAberta.indexOf(idx));
    mostrar();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.getElementById('lbFechar').focus();
  }

  function mostrar() {
    var item = albumAtual.itens[listaAberta[posAberta]];
    var unico = listaAberta.length < 2;
    document.getElementById('lbAnterior').hidden = unico;
    document.getElementById('lbProximo').hidden = unico;
    var legenda = escapar(item.tipo === 'video' && item.titulo ? item.titulo : albumAtual.titulo) +
      (unico ? '' : ' <span class="lightbox__count">' + (posAberta + 1) + ' / ' + listaAberta.length + '</span>');

    if (item.tipo === 'video') {
      palco.innerHTML =
        '<div class="lightbox__video"><iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(item.youtube) + '?autoplay=1&rel=0" title="' + escapar(item.titulo || albumAtual.titulo) +
        '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>' +
        '<figcaption>' + legenda + '</figcaption>';
    } else {
      palco.innerHTML =
        '<img src="' + item.src + '" alt="' + escapar(albumAtual.titulo + ', foto ' + (posAberta + 1)) + '">' +
        '<figcaption>' + legenda + '</figcaption>';
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
