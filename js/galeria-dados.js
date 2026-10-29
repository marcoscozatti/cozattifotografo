// ===== ITENS DO PORTFÓLIO =====
// Como adicionar:
//  FOTO  -> salve a foto em img/galeria/ e uma versão pequena (uns 700px) em img/galeria/mini/.
//           Coloque os caminhos em "src" (foto grande) e "mini" (versão pequena, usada na grade).
//           Se não tiver a versão pequena, pode apagar a linha "mini" — o site usa a grande.
//  VÍDEO -> copie o código do vídeo do YouTube. Ex.: em https://www.youtube.com/watch?v=AbC123xYz
//           o código é AbC123xYz  -> coloque em "youtube".
//
//  categoria: 'casamento' ou 'drone'
//  destaque (opcional):
//     'alto'  -> ocupa 2 linhas (bom para fotos em pé)
//     'largo' -> ocupa 2 colunas (bom para fotos deitadas)
//
// Use sempre nomes em minúsculas e sem espaços (ex.: casamento-14.jpg).
// Enquanto a foto não existir ou o vídeo estiver sem código, aparece um quadro "Em breve".

function foto(n, titulo, destaque) {
  return {
    tipo: 'foto',
    categoria: 'casamento',
    src: 'img/galeria/casamento-' + n + '.jpg',
    mini: 'img/galeria/mini/casamento-' + n + '.jpg',
    titulo: titulo,
    destaque: destaque
  };
}

window.GALERIA = [
  // ---- Casamentos (a ordem aqui é a ordem na tela) ----
  foto('07', 'Sorrisos', 'largo'),
  foto('03', 'Pôr do sol', 'alto'),
  foto('02', 'O beijo'),
  foto('06', 'Alianças'),
  foto('08', 'Carinho'),
  foto('04', 'Dupla exposição', 'largo'),
  foto('05', 'Selfie dos noivos'),
  foto('09', 'Abraço'),
  foto('10', 'Coração'),
  foto('12', 'Mostrando as alianças', 'largo'),
  foto('13', 'De mãos dadas'),
  foto('01', 'Coração nas mãos'),
  foto('11', 'Detalhes'),

  // ---- Drone ----
  { tipo: 'video', categoria: 'drone', youtube: '', titulo: 'Filmagem aérea com drone', destaque: 'largo' },
  { tipo: 'video', categoria: 'drone', youtube: '', titulo: 'Casamento visto do alto' },
  { tipo: 'foto',  categoria: 'drone', src: 'img/galeria/drone-01.jpg', titulo: 'Foto aérea' },
  { tipo: 'video', categoria: 'drone', youtube: '', titulo: 'Paisagens de Jundiaí' }
];
