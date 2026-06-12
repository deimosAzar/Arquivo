<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7e23e198-e935-448c-a30f-32f763ffeeb7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in [.env.local](.env.local) to your Gemini and Supabase credentials
3. Create a Supabase table named `specimens` with at least the following columns:
   - `id` TEXT PRIMARY KEY
   - `codigo_gaveta` TEXT
   - `gaveta_tecnica` TEXT
   - `nome` TEXT
   - `lineage` TEXT
   - `imagem_url` TEXT
   - `imagem_autor` TEXT
   - `descricao_funcional` TEXT
   - `logica_ramificacao` TEXT
   - `composicao_material` TEXT
   - `metadados_tecnicos` JSONB
   - `relatorio_ignorancia_titulo` TEXT
   - `relatorio_ignorancia_notas` TEXT
   - `alertas` JSONB
   - `conflitos` JSONB
   - `dinamica` JSONB
   - `coordenadas_fisicas` TEXT
   - `res_scan` TEXT
   - `ref_documento` TEXT
   - `curadoria` TEXT
   - `ultima_modificacao` TEXT
4. Run the app:
   `npm run dev`
