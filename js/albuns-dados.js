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
//                    Enquadramento: acrescente ' centro', ' baixo' ou ' topo' para escolher a parte da
//                    foto que aparece na grade (o normal prioriza a parte de cima, onde ficam os rostos).
//                    Ex.: '04 largo centro'
//                    ' grande' ocupa 2 colunas e 2 linhas; ' inteira' mostra a foto toda, sem cortar
//                    (bom para artes com texto). Ex.: '06 grande inteira'
//                    Atalho: se colocar só um número (ex.: fotos: 25), o site usa 01 até 25 em ordem.
//       colunas   -> opcional. Quantas colunas a grade usa no computador (o normal é 4).
//                    Ex.: 5 fotos em pé com ' alto' ficam perfeitas com colunas: 5.
//       oculto    -> opcional. Com oculto: true o álbum NÃO aparece na lista do site; só abre
//                    pelo link direto (bom para festas com crianças: envie o link só à família).
//       videos    -> opcional. Códigos de vídeos do YouTube. Em https://www.youtube.com/watch?v=AbC123xYz
//                    o código é AbC123xYz.
//
// O álbum mais acima aparece primeiro no site.
// Cada álbum tem um link próprio para enviar ao cliente: seusite/#album/NOME-DA-PASTA

window.ALBUNS = [
  {
    pasta: 'raissa-e-jhon',
    titulo: 'Raissa e Jhon',
    categoria: 'casamento',
    local: '',
    data: '',
    descricao: 'Casamento ao ar livre com vista para as montanhas: chuva de confete, brinde com os padrinhos e muito carinho.',
    capa: '06',
    fotos: ['01 largo', '02', '03', '04 largo', '05', '06', '07 largo', '08 centro', '09']
  },

  {
    pasta: 'casamento-da-cida',
    titulo: 'Casamento da Cida',
    categoria: 'casamento',
    local: '',
    data: '',
    descricao: 'Cerimônia na igreja: a entrada das alianças, a bênção no altar e o beijo dos noivos.',
    capa: '10',
    fotos: ['02 largo', '03', '05', '01 largo', '04 largo', '06 centro', '09', '08 largo', '07 largo', '10 largo']
  },

  {
    pasta: 'fundacao-casa',
    titulo: 'Fotos dos alunos da Fundação Casa',
    categoria: 'evento',
    local: '',
    data: '',
    descricao: 'Fotografia de produto com os alunos da Fundação Casa: hambúrguer em estúdio e artes para redes sociais.',
    capa: '04',
    fotos: ['06 grande inteira', '02 alto', '03 alto', '01 largo centro', '05 alto', '07 alto inteira', '04 largo centro']
  },

  {
    pasta: 'cafe-michelin',
    titulo: 'Café Michelin',
    categoria: 'evento',
    local: '',
    data: '',
    descricao: 'Café colonial e colheita de morangos: mesa farta, doces caseiros e passeio ao ar livre.',
    capa: '08',
    fotos: ['01 alto', '10 largo', '07 alto centro', '08 largo centro', '02 largo centro', '03 largo centro', '04 largo baixo', '05 largo centro', '06 largo centro', '09 largo']
  },

  {
    pasta: 'aniversario-michaella-10-anos',
    titulo: 'Aniversário 10 anos da Michaella',
    categoria: 'evento',
    oculto: true, // aguardando autorização das famílias para aparecer na lista
    local: '',
    data: '',
    descricao: 'Festa com tema de Harry Potter: bolo de Hogwarts, família reunida, piquenique e pista de dança.',
    capa: '14',
    fotos: ['14 largo', '20 largo', '01', '12', '13', '11', '02 largo', '09', '10 alto', '18 largo', '19 alto',
            '17 largo', '03', '04', '05', '06', '07 largo', '08', '15', '16']
  },

  {
    pasta: 'bernadete-e-valquiria',
    titulo: 'Bernadete e Valquíria',
    categoria: 'casamento',
    local: '',
    data: '',
    descricao: 'Casamento civil com rosas cor-de-rosa, muitos sorrisos e um passeio pelo jardim.',
    capa: '07',
    fotos: ['07 largo', '02 largo', '05 alto', '04 largo', '03', '06 largo centro', '01']
  },

  {
    pasta: 'felipe-e-ellen',
    titulo: 'Felipe e Ellen',
    categoria: 'casamento',
    local: '',
    data: '',
    descricao: 'Do preparo do noivo à festa: cerimônia ao ar livre, alianças, véu ao vento e muita alegria.',
    capa: '10',
    fotos: ['01 alto', '07 largo', '02 alto', '09 largo', '03 alto', '10 largo', '04 alto', '11 largo',
            '05 alto', '12 largo', '06 alto', '13 largo', '08 alto', '14 largo', '16 alto', '19 largo',
            '15 alto', '18 largo', '17 alto', '20 largo']
  },

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
    pasta: 'roberto-e-rosana',
    titulo: 'Roberto e Rosana',
    categoria: 'casamento',
    local: '',
    data: '',
    descricao: 'Cerimônia na igreja: a entrada da noiva, os votos e a troca de alianças.',
    capa: '02',
    fotos: ['04 largo', '02 largo', '06 alto', '01 alto', '05 alto', '03 alto']
  },

  {
    pasta: 'ensaio-marcos-eduardo',
    titulo: 'Ensaio Marcos Eduardo',
    categoria: 'ensaio',
    local: '',
    data: '',
    descricao: 'Retratos em ambiente aconchegante, com leveza, cor e muitos sorrisos.',
    capa: '04',
    colunas: 5,
    fotos: ['06 largo', '01 alto', '02 alto', '03 alto', '07 largo', '04 alto', '05 alto', '08 alto', '09 alto', '10 alto',
            '11 alto', '12 alto', '13 alto', '15 alto', '14 alto']
  },

  {
    pasta: 'ensaio-eduardo-falico',
    titulo: 'Ensaio Eduardo Falico',
    categoria: 'ensaio',
    local: '',
    data: '',
    descricao: 'Ensaio corporativo: retratos profissionais com estilo e personalidade.',
    capa: '05',
    colunas: 5,
    fotos: ['05 alto', '01 alto', '02 alto', '04 alto', '03 alto']
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
