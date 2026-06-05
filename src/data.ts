import { Specimen } from "./types";

export const initialSpecimens: Specimen[] = [
  {
    id: "HEX_042",
    codigo_gaveta: "ESPECIME_v.042",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Hexancastra sp.",
    lineage: "FILO: RETARIA | CLASSE: POLYCYSTINA | ORDEM: SPUMELLARIA",
    imagem_url: "/src/assets/images/hexancastra_sp_1780660869796.png",
    image_prompt: "Uma fotografia científica de alta resolução de um 'Radiolário' (Hexancastra sp.), mostrando um esqueleto mineral intrincado e simétrico com padrões de ramificação geométrica.",
    descricao_funcional: "A arquitetura esquelética da Hexancastra sp. representa o ápice da eficiência estrutural em micro-organismos marinhos. Sua geometria utiliza um núcleo central icosaédrico do qual emergem ramos radiais, criando uma rede cristalina que resiste à pressão hidrostática enquanto maximiza a área de superfície para absorção de nutrientes.",
    logica_ramificacao: "Bifurcação iterativa em ângulos de 120° para otimizar a distribuição de tensão através da matriz mineralizada.",
    composicao_material: "Sílica amorfa (Opalina) com traços de depósitos de estrôncio para endurecimento estrutural localizado.",
    metadados_tecnicos: {
      escala: "0.42mm [MICRO-ESCALA]",
      data_coleta: "14.11.2023_08:24_UTC",
      proveniencia: "ARQUIVO_MUSEU_REG_#48912",
      coordenadas_vetoriais: "X:0.221 | Y:0.884 | Z:0.042 (NULO_FUNCIONAL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Lacunas de dados são preservadas para garantir transparência radical. Critério do pesquisador é necessário.",
    alertas: [
      {
        titulo: "Custo Ecológico Desconhecido",
        tipo: "DADOS_AUSENTES",
        descricao: "O impacto da dissolução mineral nos ecossistemas do mar profundo durante eventos de mortalidade em massa permanece não quantificado."
      },
      {
        titulo: "Déficit de Teste de Estresse",
        tipo: "ORIGEM_INCERTA",
        descricao: "Falta de dados de testes de estresse físico para pontos de bifurcação estrutural em pressões >400 atm."
      }
    ],
    conflitos: [
      {
        nome: "Grupo de Taxonomia Alfa",
        instituicao: "INSTITUIÇÃO_SMITHSONIAN",
        ano: "2019",
        descricao: "Classificação baseada na densidade de poros esqueléticos e na geometria da espinha apical. Sugere um vínculo evolutivo mais próximo com a subclasse Phaeodaria.",
        chave: "CHAVE_DE_CONFLITO: ANÁLISE_DENSIDADE_POROS"
      },
      {
        nome: "Grupo de Taxonomia Beta",
        instituicao: "REDE_GBIF",
        ano: "2024",
        descricao: "Classificação baseada em filogenia molecular e sequenciamento de rRNA. Coloca o espécime estritamente dentro da ordem Spumellaria sem ambiguidade.",
        chave: "CHAVE_DE_CONFLITO: VERACIDADE_SEQUENCIAMENTO_RNA"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 0.12N/mm²",
      rede_tensao_valor: 0.12,
      coef_arrasto: "Cd: 0.041 (Hidrodinâmico)",
      coef_arrasto_valor: 0.041,
      limite_elasticidade: "Módulo de Cisalhamento: 72 GPa",
      limite_elasticidade_valor: 72,
      inertia_termica: "Delta-T: 0.002s/K",
      inertia_termica_valor: 0.002
    },
    coordenadas_fisicas: "LAT_-2.332 LON_144.912",
    res_scan: "8.2 MICRONS",
    ref_documento: "REF_DOCUMENTO: #RAD_HEX_042_PRISTINE_2024",
    curadoria: "Laboratório de Morfologia Digital",
    ultima_modificacao: "12_OUT_2024"
  },
  {
    id: "TRI_091",
    codigo_gaveta: "ESPECIME_v.091",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Trigonium arcticum",
    lineage: "FILO: OCHROPHYTA | CLASSE: BACILLARIOPHYCEAE | ORDEM: TRICERATIALES",
    imagem_url: "/src/assets/images/trigonium_arcticum_1780660884822.png",
    image_prompt: "Close up microscopic high-contrast photo of a decorative triangular diatomaceous wall structure.",
    descricao_funcional: "Diatomácea triangular de águas polares frias. A carapaça siliciosa exibe simetria tri-radial perfeita com perfurações em favo de mel (aréolas) de alta eficiência filtrante, minimizando o uso de material biogênico sob pressões criosféricas severas.",
    logica_ramificacao: "Arranjo hexagonal regular com espaçamento sub-micrométrico constante para dissipação de tensões de gelo marinho.",
    composicao_material: "Frustulito de sílica polimerizada hidratada com traços de íons ferro e titânio para blindagem UV biológica.",
    metadados_tecnicos: {
      escala: "0.15mm [MICRO-ESCALA]",
      data_coleta: "03.02.2024_11:40_UTC",
      proveniencia: "COLEÇÃO_ANTÁRTICA_REG_#99201",
      coordenadas_vetoriais: "X:0.712 | Y:0.045 | Z:0.180 (RAD_POLAR)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "O espécime exibe fraturas parciais causadas pela cristalização de gelo pós-amostragem técnica.",
    alertas: [
      {
        titulo: "Frustulização Induzida por Frio",
        tipo: "DADOS_AUSENTES",
        descricao: "O limiar térmico exato no qual as aréolas periféricas colapsam por fadiga térmica não foi simulado fisicamente em laboratório úmido."
      },
      {
        titulo: "Incerteza Isotópica",
        tipo: "ORIGEM_INCERTA",
        descricao: "Relação de variação de Oxigênio-18 indica sedimentação rápida, mas a taxa anual de deposição siliciosa é estimada com margem de erro +/- 15%."
      }
    ],
    conflitos: [
      {
        nome: "Classificação Morfológica Clássica",
        instituicao: "MUSEU_DE_HISTORIA_NATURAL_LONDRES",
        ano: "2015",
        descricao: "Enquadrado estritamente na família Triceratiaceae devido ao espessamento angular periférico e arquitetura dos pseudo-ocelos basais.",
        chave: "CHAVE_DE_CONFLITO: MORFOLOGIA_PSEUDO_OCELO"
      },
      {
        nome: "Inferência Filogenômica",
        instituicao: "INSTITUTO_MAMAL_MARINHO_TOKYO",
        ano: "2023",
        descricao: "Análise de três genes plastidiais posiciona o grupo como táxon irmão de formas bipolares pseudo-céntricas, desafiando a partição morfológica tri-radial tradicional.",
        chave: "CHAVE_DE_CONFLITO: FILOGENIA_CLOROPLASTIAL"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 0.35N/mm²",
      rede_tensao_valor: 0.35,
      coef_arrasto: "Cd: 0.082 (Arrasto Criogênico)",
      coef_arrasto_valor: 0.082,
      limite_elasticidade: "Módulo de Cisalhamento: 110 GPa",
      limite_elasticidade_valor: 110,
      inertia_termica: "Delta-T: 0.009s/K",
      inertia_termica_valor: 0.009
    },
    coordenadas_fisicas: "LAT_-77.412 LON_164.221",
    res_scan: "2.4 MICRONS",
    ref_documento: "REF_DOCUMENTO: #DIAT_TRI_091_PRISTINE_2024",
    curadoria: "Divisão de Paleoceanografia Polar",
    ultima_modificacao: "08_NOV_2024"
  },
  {
    id: "LIT_118",
    codigo_gaveta: "ESPECIME_v.118",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Lithomespilus coronatus",
    lineage: "FILO: RETARIA | CLASSE: RADiolaria | ORDEM: NASSELLARIA",
    imagem_url: "/src/assets/images/lithomespilus_corona_1780660900203.png",
    image_prompt: "Scientific illustration of a glass-like spherical marine micro-skeleton, deep shadows background, high precision detail.",
    descricao_funcional: "Radiolário esférico dotado de uma espinha apical em forma de coroa de sílica pura. Sua arquitetura oclusiva serve tanto como lastro flutuante na coluna d'água quanto como proteção de estresse contra predadores ciliados planctônicos.",
    logica_ramificacao: "Estrutura elipsóide concêntrica com braços de treliça interconectados projetando-se para o exterior em um arranjo radial estrelado.",
    composicao_material: "Opala-A hialina ultra-pura com ligações cruzadas densas de cálcio estrutural para rigidez mecânica extraordinária.",
    metadados_tecnicos: {
      escala: "0.29mm [MICRO-ESCALA]",
      data_coleta: "24.08.2023_22:15_UTC",
      proveniencia: "COLEÇÃO_FOSSA_DAS_MARIANAS_#118",
      coordenadas_vetoriais: "X:0.012 | Y:0.999 | Z:0.003 (GRAV_ABISSAL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Coleta ultra-profunda realizada através de ROV. Possíveis microfissuras de descompressão não catalogadas.",
    alertas: [
      {
        titulo: "Micro-fissuração por Descompressão",
        tipo: "DADOS_AUSENTES",
        descricao: "Diferença barométrica de 800 atm no recolhimento pode ter induzido fraturas invisíveis na corona apical microscópica."
      },
      {
        titulo: "Incerteza Taxonômica Abissal",
        tipo: "ORIGEM_INCERTA",
        descricao: "Falta de outros espécimes vivos observáveis na mesma profundidade impede determinação se a corona é dimorfismo sexual ou variação fenotípica estável."
      }
    ],
    conflitos: [
      {
        nome: "Grupo Haeckel Clássico",
        instituicao: "UNIVERSIDADE_DE_JENA",
        ano: "1887",
        descricao: "Atribuído originalmente ao gênero Lithomespilus com base em simetria elipsoidal e ausência de câmaras segmentadas adicionais na corona apical.",
        chave: "CHAVE_DE_CONFLITO: SIMETRIA_HAECKEL_1887"
      },
      {
        nome: "Revisão Nassellaria Moderna",
        instituicao: "MUSEU_CIENCIAS_NAGOYA",
        ano: "2021",
        descricao: "Posiciona este clado dentro de uma família inteiramente nova baseada em análises tridimensionais de microtomografia computadorizada de raios X subterrâneos.",
        chave: "CHAVE_DE_CONFLITO: DETECÇÃO_MICROC_3D"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 0.84N/mm²",
      rede_tensao_valor: 0.84,
      coef_arrasto: "Cd: 0.013 (Ultra-Hidrodinâmico)",
      coef_arrasto_valor: 0.013,
      limite_elasticidade: "Módulo de Cisalhamento: 168 GPa",
      limite_elasticidade_valor: 168,
      inertia_termica: "Delta-T: 0.001s/K",
      inertia_termica_valor: 0.001
    },
    coordenadas_fisicas: "LAT_11.349 LON_142.198",
    res_scan: "1.1 MICRONS",
    ref_documento: "REF_DOCUMENTO: #RAD_LIT_118_PRISTINE_2023",
    curadoria: "Divisão de Amostragem Abissal e Mar Profundo",
    ultima_modificacao: "28_OUT_2024"
  },
  {
    id: "NAU_001",
    codigo_gaveta: "ESPECIME_v.150",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Nautilus pompilius",
    lineage: "FILO: MOLLUSCA | CLASSE: CEPHALOPODA | ORDEM: NAUTILIDA",
    imagem_url: "/src/assets/images/nautilus_pompilius_1780661612582.png",
    image_prompt: "A precise technical scientific schematic illustration of Nautilus pompilius shell cut in half, showing the cross-section of perfect logarithmic spiral chambers made of pearlescent nacre. Crisp, detailed high-contrast illustration on a deep dark slate-grey background.",
    descricao_funcional: "O Nautilus pompilius exibe uma carapaça espiralada logarítmica perfeita (proporção áurea), dividida internamente por septos em câmaras estanques que servem para regular a flutuabilidade através de trocas gasosas controladas osmoticamente por seu sifúnculo.",
    logica_ramificacao: "Particionamento logarítmico em espiral contínua de Fibonacci, onde cada nova câmara é aproximadamente 1.3 vezes o volume da anterior.",
    composicao_material: "Carbonato de cálcio sob a forma de Aragonita microcristalina e conchiolina estrutural flexível, criando camadas nacradas de altíssima tenacidade e reflexor.",
    metadados_tecnicos: {
      escala: "150mm [MESO-ESCALA / MACROSCÓPICO]",
      data_coleta: "12.05.2024_15:10_UTC",
      proveniencia: "COLEÇÃO_EQUATORIAL_REG_#150",
      coordenadas_vetoriais: "X:0.550 | Y:0.410 | Z:1.500 (ESCALA_NORMAL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Septações internas mostram perfeita integridade matemática, sem desvios significativos no fator de crescimento cíclico.",
    alertas: [
      {
        titulo: "Vulnerabilidade Térmica da Concha",
        tipo: "DADOS_AUSENTES",
        descricao: "A porosidade e solubilidade da aragonita aumentam drasticamente em águas mais quentes devido à acidificação sob altos teores de CO2."
      }
    ],
    conflitos: [
      {
        nome: "Estágio Ontogenético Clássico",
        instituicao: "MUSEU_DE_HISTORIA_NATURAL_PARIS",
        ano: "2018",
        descricao: "A taxa de adição de câmaras é considerada uma variável puramente temporal por alguns paleobiólogos, contrapondo-se à hipótese ecológica estrita.",
        chave: "CHAVE_DE_CONFLITO: ONTOGÊNESE_X_ECOLOGIA"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 45.0N/mm²",
      rede_tensao_valor: 45.0,
      coef_arrasto: "Cd: 0.28 (Hidrodinâmica Macro)",
      coef_arrasto_valor: 0.28,
      limite_elasticidade: "Módulo de Cisalhamento: 4.5 GPa",
      limite_elasticidade_valor: 4.5,
      inertia_termica: "Delta-T: 1.20s/K",
      inertia_termica_valor: 1.20
    },
    coordenadas_fisicas: "LAT_-5.234 LON_146.120",
    res_scan: "0.1 MILÍMETROS",
    ref_documento: "REF_DOCUMENTO: #MAC_NAU_001_PRISTINE_2024",
    curadoria: "Divisão de Biodiversidade Pelágica e Bentoônica",
    ultima_modificacao: "15_MAI_2024"
  },
  {
    id: "EUP_002",
    codigo_gaveta: "ESPECIME_v.250",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Euplectella aspergillum",
    lineage: "FILO: PORIFERA | CLASSE: HEXACTINELLIDA | ORDEM: LYSSACINOSA",
    imagem_url: "/src/assets/images/euplectella_sponge_1780661626700.png",
    image_prompt: "A highly detailed scientific illustration of Euplectella aspergillum (Venus flower basket glass sponge). Shows the intricate white mesh cylinder of woven silica spicules in a rectangular-diagonal cage-like pattern. Sits on a dark background.",
    descricao_funcional: "Cesta-de-flores-de-Vênus. Esta esponja de vidro possui uma estrutura cilíndrica de treliça quadrada reforçada por diagonais alternadas. A engenharia dessa malha de sílica resiste incrivelmente a estresses hidrodinâmicos de dobramento e cisalhamento nas profundezas abissais.",
    logica_ramificacao: "Grade ortogonal hierárquica dotada de bandas diagonais de suporte acopladas por espículas pontificadas de silício.",
    composicao_material: "Sílica biogênica ultra-pura amorfa com macrofibras concêntricas e lamelas de colágeno esponjoso reforçado por calcita vestigial.",
    metadados_tecnicos: {
      escala: "250mm [MESO-ESCALA / MACROSCÓPICO]",
      data_coleta: "28.09.2023_09:12_UTC",
      proveniencia: "COLEÇÃO_FOSSA_DAS_MARIANAS_#118",
      coordenadas_vetoriais: "X:0.012 | Y:0.999 | Z:0.003 (GRAV_ABISSAL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Incompletude nos registros de interação de flujos internos de fluido através da parede porosa da treliça sob velocidades de corrente > 1.2m/s.",
    alertas: [
      {
        titulo: "Saturação Mineral Crítica",
        tipo: "ORIGEM_INCERTA",
        descricao: "A taxa de incorporação de sílica solúvel livre (ácido ortossilícico) sob temperaturas próximas de 1°C é altamente indeterminada no habitat bentônico largo."
      }
    ],
    conflitos: [
      {
        nome: "Análise de Estresse Mecânico",
        instituicao: "MIT_ENGINEERING_LAB",
        ano: "2021",
        descricao: "Pesquisas de elementos finitos mostram que a arquitetura ortogonal-diagonal supera ligas de alumínio e titânio em resistência de colapso por flambagem.",
        chave: "CHAVE_DE_CONFLITO: ELEMENTOS_FINITOS_MIT"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 180.0N/mm²",
      rede_tensao_valor: 180.0,
      coef_arrasto: "Cd: 0.15 (Treliça Porosa)",
      coef_arrasto_valor: 0.15,
      limite_elasticidade: "Módulo de Cisalhamento: 15.2 GPa",
      limite_elasticidade_valor: 15.2,
      inertia_termica: "Delta-T: 2.50s/K",
      inertia_termica_valor: 2.50
    },
    coordenadas_fisicas: "LAT_11.349 LON_142.198",
    res_scan: "0.2 MILÍMETROS",
    ref_documento: "REF_DOCUMENTO: #MAC_EUP_002_PRISTINE_2023",
    curadoria: "Divisão de Amostragem Abissal e Mar Profundo",
    ultima_modificacao: "10_NOV_2024"
  },
  {
    id: "FOL_003",
    codigo_gaveta: "ESPECIME_v.112",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Acer palmatum (Padrão Vascular)",
    lineage: "DOMÍNIO: EUKARYA | REINO: PLANTAE | ORDEM: SAPINDALES",
    imagem_url: "/src/assets/images/folha_nervura_1780662080694.png",
    image_prompt: "A detailed botanical scientific scan of leaf venation pattern (foliage vascular bundle). High contrast micro-photography detail showcasing intricate fractal-like branching veins in a light gold and bone-white hue on a deep dark olive-black background.",
    descricao_funcional: "O padrão foliar apresenta uma rede hierárquica otimizada de nervuras (xilema e floema). Os canais principais bifurcam-se progressivamente em micro-capilares secundários e terciários para garantir que o suprimento hídrico e a distribuição de fotoassimilados minimizem a resistência hidráulica, atendendo à Lei de Murray.",
    logica_ramificacao: "Estrutura fractal com ramificações bifurcadas anguladas e laços de anastomose altamente conectados para caminhos de distribuição redundantes.",
    composicao_material: "Estrutura celulósica celular reforçada com lignina hidrofóbica nos d沢山 ductos vasculares condutores.",
    metadados_tecnicos: {
      escala: "120mm [ESCALA MACRO BOTÂNICA]",
      data_coleta: "14.10.2024_09:00_UTC",
      proveniencia: "ACERVO_BOTANICO_REG_#8801",
      coordenadas_vetoriais: "X:0.340 | Y:0.620 | Z:0.100 (REDE_FRACTAL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Comportamento adaptativo da densidade vascular sob estresse hídrico agudo requer modelagem cambial adicional.",
    alertas: [
      {
        titulo: "Instabilidade por Desidratação",
        tipo: "DADOS_AUSENTES",
        descricao: "Colapso mecânico dos micro-canais vasculares sob tenção de sucção extrema superior a 2.5 MPa negativo."
      }
    ],
    conflitos: [
      {
        nome: "Teoria da Escala Fractal",
        instituicao: "MUSEU_DE_BOTANICA_KEW",
        ano: "2022",
        descricao: "Questiona-se se a eficiência de transporte segue uma proporcionalidade universal ou varia com a espessura da cutícula foliar.",
        chave: "CHAVE_DE_CONFLITO: FISIOLOGIA_MURRAY"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 8.5N/mm²",
      rede_tensao_valor: 8.5,
      coef_arrasto: "Cd: 1.10 (Resistência Flexível)",
      coef_arrasto_valor: 1.10,
      limite_elasticidade: "Módulo de Cisalhamento: 0.85 GPa",
      limite_elasticidade_valor: 0.85,
      inertia_termica: "Delta-T: 3.80s/K",
      inertia_termica_valor: 3.80
    },
    coordenadas_fisicas: "LAT_35.676 LON_139.650",
    res_scan: "5.0 MICRONS",
    ref_documento: "REF_DOCUMENTO: #VEG_FOL_003_PRISTINE_2024",
    curadoria: "Divisão de Morfologia Vegetal e Fotobiologia",
    ultima_modificacao: "18_OUT_2024"
  },
  {
    id: "BAS_004",
    codigo_gaveta: "ESPECIME_v.800",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Basalto Vulcânico Colunar",
    lineage: "LITOSFERA | ROCHA MAGMÁTICA | SISTEMA HEXAGONAL",
    imagem_url: "/src/assets/images/basalto_colunar_1780662067024.png",
    image_prompt: "A precise scientific illustration of columnar basalt formations. Features perfect giant hexagonal basalt rock prisms and geological fissures in a natural organ-pipe structure. High contrast, dark volcanic slate-grey backdrop, schematic textbook style.",
    descricao_funcional: "Formação geológica resultante do resfriamento lento de derrames de lava basáltica espessa. À medida que a lava contrai termicamente, estabelece-se um campo de tensões bidimensional que se dissipa pela formação de fissuras radiais simétricas, gerando prismas poligonais de simetria perfeita.",
    logica_ramificacao: "Fissuração geométrica e junções triplas em ângulos de 120° sob contração térmica uniforme de fluido viscoso.",
    composicao_material: "Silicato ferro-magnesiano contendo microcristais de plagioclásio, piroxênio e cristais vestigiais de olivina.",
    metadados_tecnicos: {
      escala: "1800mm [ESCALA GEOLÓGICA]",
      data_coleta: "02.08.2023_14:20_UTC",
      proveniencia: "EXPEDIÇÃO_VOLCANO_REG_#096",
      coordenadas_vetoriais: "X:0.920 | Y:0.110 | Z:1.980 (TENSÃO_TÉRMICA)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Variações na velocidade exata da frente de resfriamento influenciam a largura do prisma, exigindo modelos termocinéticos empíricos.",
    alertas: [
      {
        titulo: "Fadiga Térmica Superficial",
        tipo: "DADOS_AUSENTES",
        descricao: "Micro-fissuras indetectáveis por ultra-som propagam-se sob diferenciais sazonais de temperatura cíclica extrema."
      }
    ],
    conflitos: [
      {
        nome: "Modelo de Fratura Hidropneumática",
        instituicao: "MUSEU_DE_CIENCIAS_REYKJAVIK",
        ano: "2020",
        descricao: "Propõe que a infiltração de água meteórica fria através das fissuras iniciais acelera substancialmente a regularidade geométrica tridimensional.",
        chave: "CHAVE_DE_CONFLITO: FISSU_TERM_X_HIDRO"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 320.0N/mm²",
      rede_tensao_valor: 320.0,
      coef_arrasto: "Cd: 0.95 (Rugosidade de Rocha)",
      coef_arrasto_valor: 0.95,
      limite_elasticidade: "Módulo de Cisalhamento: 35.0 GPa",
      limite_elasticidade_valor: 35.0,
      inertia_termica: "Delta-T: 140.0s/K",
      inertia_termica_valor: 140.0
    },
    coordenadas_fisicas: "LAT_64.146 LON_-21.942",
    res_scan: "1.2 MILÍMETROS",
    ref_documento: "REF_DOCUMENTO: #GEO_BAS_004_PRISTINE_2023",
    curadoria: "Divisão de Dinâmica Lito-Tectônica e Vulcanologia",
    ultima_modificacao: "05_SET_2023"
  },
  {
    id: "GEO_005",
    codigo_gaveta: "ESPECIME_v.350",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Geodo de Ametista",
    lineage: "MINERAL | CLASSE: SILICATOS | GRUPO DO QUARTZO",
    imagem_url: "/src/assets/images/geodo_ametista_1780662093673.png",
    image_prompt: "A precise mineralogical illustration of a cut-open amethyst geode. Shows concentric ring growth layers and deep purple crystalline quartz points radiating inwards. Scientific taxonomy diagram style on a deep charcoal blackboard background.",
    descricao_funcional: "Cavidade geológica esferoidal preenchida por precipitação hidrotermal de sílica. O crescimento cristalino ocorre em direção ao centro da cavidade, exibindo anéis concêntricos externos de calcedônia e um interior preenchido por cristais de ametista maculados por ferro trivalente irradiado.",
    logica_ramificacao: "Nucleação cristalina radial e crescimento ortotrópico a partir do córtex de silicato amorfo delimitador.",
    composicao_material: "Dióxido de silício cristalino (Quartzo) com inclusões pontuais de ferro de carga alterada radioativamente.",
    metadados_tecnicos: {
      escala: "350mm [ESCALA MINERAL DE GABINETE]",
      data_coleta: "20.11.2023_17:35_UTC",
      proveniencia: "COLEÇÃO_MINERAL_REG_#0412",
      coordenadas_vetoriais: "X:0.110 | Y:0.430 | Z:1.200 (ESTR_CONCENTRICA)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "O histórico exato de pressurização termal dos fluídos de preenchimento em escala de milhões de anos permanece sob investigação.",
    alertas: [
      {
        titulo: "Sensibilidade Fotoquímica",
        tipo: "DADOS_AUSENTES",
        descricao: "A exposição prolongada à radiação ultravioleta causa a descoloração dos centros de cor de ametista, revertendo o mineral a quartzo cinzento."
      }
    ],
    conflitos: [
      {
        nome: "Gênese Hidrotermal Cíclica",
        instituicao: "GEMS_AND_MINERALS_SOCIETY",
        ano: "2018",
        descricao: "Divergência sobre o número exato de pulsos hidrotermais que geram as camadas externas listradas de calcedônia antes do início da cristalização terminal.",
        chave: "CHAVE_DE_CONFLITO: PULSO_HIDROCONCENTRICO"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 450.0N/mm²",
      rede_tensao_valor: 450.0,
      coef_arrasto: "Cd: 0.65 (Morfologia Irregular)",
      coef_arrasto_valor: 0.65,
      limite_elasticidade: "Módulo de Cisalhamento: 44.0 GPa",
      limite_elasticidade_valor: 44.0,
      inertia_termica: "Delta-T: 78.0s/K",
      inertia_termica_valor: 78.0
    },
    coordenadas_fisicas: "LAT_-29.135 LON_-53.250",
    res_scan: "0.2 MILÍMETROS",
    ref_documento: "REF_DOCUMENTO: #MIN_GEO_005_PRISTINE_2023",
    curadoria: "Divisão de Cristalogenia e Mineralogia Sistemática",
    ultima_modificacao: "22_NOV_2023"
  },
  {
    id: "VAS_006",
    codigo_gaveta: "ESPECIME_v.200",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Rede Vascular / Sistema Circulatório",
    lineage: "DOMÍNIO: EUKARYA | REINO: ANIMALIA | FILO: CHORDATA",
    imagem_url: "/src/assets/images/sistema_vascular_1780662106794.png",
    image_prompt: "A classic medical anatomical illustration of human circulatory blood vessels. Shows a detailed network of branching arteries and veins, a vibrant crimson and indigo arterial tree with organic fractal bifurcations on a dark scientific slate background.",
    descricao_funcional: "Representação anatômica do sistema capilar e arterial pulmonar humano. A ramificação segue um padrão fractal autossimilar para otimizar o transporte ativo do oxigênio e a troca gasosa alveolar através do tecido pulmonar, minimizando o trabalho energético de bombeamento do miocárdio.",
    logica_ramificacao: "Divisão fractal dicotômica assimétrica para manutenção da pressão e fluxo laminar contínuo em seções capilares progressivas.",
    composicao_material: "Tecido celular endotelial elastomérico envolto por matriz de colágeno elástico e musculatura lisa de alta contratilidade.",
    metadados_tecnicos: {
      escala: "200mm [ESCALA ANATÔMICA HUMANA]",
      data_coleta: "08.01.2024_15:45_UTC",
      proveniencia: "COLEÇÃO_ANATOMICA_MUSEU_#512",
      coordenadas_vetoriais: "X:0.510 | Y:0.890 | Z:1.150 (FRACTAL_FLEXIVEL)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Efeitos micro-reológicos de cisalhamento do fluido sanguíneo não-newtoniano em junções com diâmetro inferior a 10 micrômetros continuam por simular.",
    alertas: [
      {
        titulo: "Resiliência a Sobrecarga Barométrica",
        tipo: "DADOS_AUSENTES",
        descricao: "Ruptura elástica de ramificações secundárias em condições de pressão hidrostática instantânea superior a 220 mmHg."
      }
    ],
    conflitos: [
      {
        nome: "Modelagem Biofísica Murray",
        instituicao: "MUSEU_ANATOMICO_PADUA",
        ano: "2023",
        descricao: "Debate-se se as micro-bifurcações arteríolas-capilares reajustam dinamicamente seus ângulos em tempo real de acordo com variações barorreceptoras locais.",
        chave: "CHAVE_DE_CONFLITO: MURRAY_VASCULAR_ATIVO"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 15.0N/mm²",
      rede_tensao_valor: 15.0,
      coef_arrasto: "Cd: 0.18 (Vaso Elástico Pulmonar)",
      coef_arrasto_valor: 0.18,
      limite_elasticidade: "Módulo de Cisalhamento: 0.12 GPa",
      limite_elasticidade_valor: 0.12,
      inertia_termica: "Delta-T: 4.20s/K",
      inertia_termica_valor: 4.20
    },
    coordenadas_fisicas: "LAT_45.406 LON_11.874",
    res_scan: "15.0 MICRONS",
    ref_documento: "REF_DOCUMENTO: #ANA_VAS_006_PRISTINE_2024",
    curadoria: "Divisão de Morfologia Comparativa e Fisiologia Animal",
    ultima_modificacao: "10_JAN_2024"
  },
  {
    id: "RIO_007",
    codigo_gaveta: "ESPECIME_v.991",
    gaveta_tecnica: "GAVETA_TECNICA",
    nome: "Delta do Rio Ganges (Padrão Dendrítico)",
    lineage: "HIDROSFERA | GEOMORFOLOGIA | SISTEMA DE FLUXO MEANDRANTE",
    imagem_url: "/src/assets/images/rede_dendritica_rio_1780662119775.png",
    image_prompt: "A stunning satellite cartography schematic of a dendritic river delta. Visualizes the fractal branching river network and sediment channels splitting into the sea. High contrast, beautiful deep blue water paths over gold sands and dark background.",
    descricao_funcional: "Bacia de recepção do delta do Ganges. Canais sedimentares dividem-se em um padrão clássico de bifurcação dendrítica à medida que a correnteza desacelera ao encontrar a massa oceânica, depositando argilas e gerando bifurcações estáveis de descarga distributiva.",
    logica_ramificacao: "Divisão distributiva dendrítica governada por gradientes de declividade gravimétrica mínima e auto-organização termodinâmica de caminhos hidráulicos.",
    composicao_material: "Sedimentos siliciclásticos finos, areias aluvionares e fluxos hídricos contínuos de alta carga de suspensão coloidal.",
    metadados_tecnicos: {
      escala: "140km [ESCALA MACRO GEOGRÁFICA]",
      data_coleta: "19.03.2024_06:15_UTC",
      proveniencia: "IMAGENS_SATE_REG_#99014",
      coordenadas_vetoriais: "X:0.010 | Y:0.015 | Z:3.500 (ESCALA_GEOGRAFICA)"
    },
    relatorio_ignorancia_titulo: "RELATÓRIO_DE_IGNORÂNCIA",
    relatorio_ignorancia_notas: "Comportamento da autossimilaridade sob condições anômalas monçônicas drásticas exige calibração estuarina contínua.",
    alertas: [
      {
        titulo: "Erosão Termal Aluvial de Meandros",
        tipo: "DADOS_AUSENTES",
        descricao: "Colapsos imediatos de barreiras de canais distributivos sob eventos severos de sobrecarga e elevação do nível marítimo global."
      }
    ],
    conflitos: [
      {
        nome: "Origem Dinâmica Aluvial",
        instituicao: "MUSEU_CARTOGRAFICO_DELHI",
        ano: "2021",
        descricao: "Questiona-se se os ciclos de migração lateral do canal do delta principal respondem com presteza ou com histerese geológica de longa escala temporal.",
        chave: "CHAVE_DE_CONFLITO: DELTA_MIG_HIST_GEO"
      }
    ],
    dinamica: {
      rede_tensao: "Carga Ideal: 1.5N/mm²",
      rede_tensao_valor: 1.5,
      coef_arrasto: "Cd: 0.12 (Canal Aberto Delta)",
      coef_arrasto_valor: 0.12,
      limite_elasticidade: "Módulo de Cisalhamento: 0.005 GPa",
      limite_elasticidade_valor: 0.005,
      inertia_termica: "Delta-T: 2800.0s/K",
      inertia_termica_valor: 2800.0
    },
    coordenadas_fisicas: "LAT_22.312 LON_89.845",
    res_scan: "30.0 METROS",
    ref_documento: "REF_DOCUMENTO: #GEO_RIO_007_PRISTINE_2024",
    curadoria: "Divisão de Cartografia e Geomorfologia Fluvial",
    ultima_modificacao: "20_MAR_2024"
  }
];

