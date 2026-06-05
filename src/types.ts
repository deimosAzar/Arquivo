export interface SpecimenMetadata {
  escala: string;
  data_coleta: string;
  proveniencia: string;
  coordenadas_vetoriais: string;
}

export interface IgnoranceReport {
  titulo: string;
  tipo: string; // e.g. DADOS_AUSENTES, ORIGEM_INCERTA
  descricao: string;
}

export interface TaxonomyConflict {
  nome: string;
  instituicao: string;
  ano: string;
  descricao: string;
  chave: string;
  badge_color?: string;
}

export interface StructuralDynamics {
  rede_tensao: string;
  rede_tensao_valor: number; // e.g. 0.12
  coef_arrasto: string;
  coef_arrasto_valor: number; // e.g. 0.041
  limite_elasticidade: string;
  limite_elasticidade_valor: number; // e.g. 72
  inertia_termica: string;
  inertia_termica_valor: number; // e.g. 0.002
}

export interface Specimen {
  id: string; // e.g. HEX_042
  codigo_gaveta: string; // e.g. ESPECIME_v.042
  gaveta_tecnica: string; // e.g. GAVETA_TECNICA
  nome: string; // e.g. Hexancastra sp.
  lineage: string; // e.g. FILO: RETARIA | CLASSE: POLYCYSTINA | ORDEM: SPUMELLARIA
  imagem_url: string;
  imagem_autor?: string;
  image_prompt?: string;
  descricao_funcional: string;
  logica_ramificacao: string;
  composicao_material: string;
  metadados_tecnicos: SpecimenMetadata;
  relatorio_ignorancia_titulo: string;
  relatorio_ignorancia_notas: string;
  alertas: IgnoranceReport[];
  conflitos: TaxonomyConflict[];
  dinamica: StructuralDynamics;
  coordenadas_fisicas: string; // e.g. "LAT_-2.332 LON_144.912"
  res_scan: string; // e.g. "8.2 MICRONS"
  ref_documento: string; // e.g. "REF_DOCUMENTO: #RAD_HEX_042_PRISTINE_2024"
  curadoria: string; // e.g. "Laboratório de Morfologia Digital"
  ultima_modificacao: string; // e.g. "12_OUT_2024"
}
