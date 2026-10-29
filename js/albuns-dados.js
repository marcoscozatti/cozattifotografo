// ===== ÁLBUNS DO PORTFÓLIO =====
// Cada casamento, ensaio ou trabalho com drone é um ÁLBUM (uma "pasta").
//
// COMO CRIAR UM ÁLBUM NOVO
//  1. Crie uma pasta em img/albuns/ com um nome curto, em minúsculas, sem espaços e sem acentos.
//     Ex.: img/albuns/ensaio-joao-barbero/
//  2. Coloque as fotos lá numeradas: 01.jpg, 02.jpg, 03.jpg...  (fotos grandes, uns 1800px)
//  3. Coloque as versões pequenas (uns 700px) em img/albuns/ensaio-joao-barbero/mini/ com os mesmos nomes.
//     Sem a pasta mini, o site usa as fotos grandes (funciona, mas fica mais lento).
//  4. Copie um bloco { ... } abaixo e ajuste:
//       pasta     -> o nome da pasta que você criou
//       titulo    -> o nome que aparece no site
//       categoria -> 'casamento', 'ensaio', 'evento' ou 'drone'
//       local / data / descricao -> opcionais
//       capa      -> número da foto usada na capa do álbum
//       fotos     -> a ordem das fotos. Escreva o número; acrescente ' largo' (foto deitada que
//                    ocupa 2 colunas) ou ' alto' (foto em pé que ocupa 2 linhas) se quiser destacar.
//                    Atalho: se colocar só um número (ex.: fotos: 25), o site usa 01 até 25 em ordem.
//       videos    -> opcional. Códigos de vídeos do YouTube. Em https://www.youtube.com/watch?v=AbC123xYz
//                    o código é AbC123xYz.
//
// O álbum mais acima aparece primeiro no site.
// Cada álbum tem um link próprio para enviar ao cliente: seusite/#album/NOME-DA-PASTA

window.ALBUNS = [
  {
    pasta: 'rafaela-e-yuri',
    titulo: 'Rafaela e Yuri',
    categoria: 'casamento',
    local: 'Jundiaí - SP',
    data: '',
    descricao: 'Ensaio do casal ao ar livre, entre sorrisos, alianças e o pôr do sol.',
    capa: '07',
    fotos: ['07 largo', '03 alto', '02', '06', '08', '04 largo', '05', '09', '10', '12 largo', '13', '01', '11']
  },

  {
    pasta: 'joao-barbearia',
    titulo: 'João Barbearia',
    categoria: 'ensaio',
    local: '',
    data: '',
    descricao: 'Ensaio na barbearia: o barbeiro em ação, os detalhes do corte e retratos.',
    capa: '08',
    fotos: ['08 largo', '01 alto', '02 alto', '09 largo', '07 alto', '03 alto', '05 alto', '06 alto', '12 alto', '04 alto', '10 alto', '11 alto']
  },

  // ---- Modelo para um álbum novo (tire as barras // do começo das linhas quando as fotos estiverem na pasta) ----
  // {
  //   pasta: 'nome-do-album',
  //   titulo: 'Nome do álbum',
  //   categoria: 'ensaio',
  //   local: '',
  //   data: '',
  //   descricao: '',
  //   capa: '01',
  //   fotos: 20
  // },

  {
    pasta: 'drone',
    titulo: 'Filmagens aéreas',
    categoria: 'drone',
    local: 'Jundiaí e região',
    descricao: 'Imagens aéreas com drone para eventos, imóveis e paisagens.',
    fotos: [],
    videos: [
      // { youtube: 'CODIGO', titulo: 'Casamento visto do alto' },
    ]
  }
];
