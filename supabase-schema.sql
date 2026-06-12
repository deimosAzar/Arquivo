-- Supabase schema for Arquivo specimen persistence
-- Execute this SQL in your Supabase project SQL editor.

create table if not exists specimens (
  id text primary key,
  codigo_gaveta text,
  gaveta_tecnica text,
  nome text,
  lineage text,
  imagem_url text,
  imagem_autor text,
  descricao_funcional text,
  logica_ramificacao text,
  composicao_material text,
  metadados_tecnicos jsonb,
  relatorio_ignorancia_titulo text,
  relatorio_ignorancia_notas text,
  alertas jsonb,
  conflitos jsonb,
  dinamica jsonb,
  coordenadas_fisicas text,
  res_scan text,
  ref_documento text,
  curadoria text,
  ultima_modificacao text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists specimens_lineage_idx on specimens (lineage);
create index if not exists specimens_nome_idx on specimens (nome);
