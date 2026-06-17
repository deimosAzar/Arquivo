import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { initialSpecimens } from "./src/data";

// Ensure environment variables are loaded
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = "specimens";

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  : null;

// Shared Gemini API setup with telemetry user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with 10mb limit for possible rich requests
  app.use(express.json({ limit: "10mb" }));

  // API endpoints FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/specimens", async (req, res) => {
    if (!supabase) {
      return res.json(initialSpecimens);
    }

    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select("*");

      if (error) {
        console.error("Erro ao buscar espécimes do Supabase:", error.message);
        return res.json(initialSpecimens);
      }

      return res.json(Array.isArray(data) ? data : initialSpecimens);
    } catch (error) {
      console.error("Erro inesperado ao buscar espécimes:", error);
      return res.json(initialSpecimens);
    }
  });

  app.post("/api/specimens", async (req, res) => {
    if (!supabase) {
      return res.status(500).json({
        error: "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não foram configurados.",
      });
    }

    const specimen = req.body;
    if (!specimen || !specimen.id) {
      return res.status(400).json({ error: "Espécime inválido ou ID ausente." });
    }

    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .upsert([specimen], { onConflict: "id" });

      if (error) {
        console.error("Erro ao salvar/atualizar espécime no Supabase:", error.message);
        return res.status(500).json({ error: error.message });
      }

      const savedRows = data ?? [];
      const savedSpecimen = savedRows.length > 0 ? savedRows[0] : specimen;
      return res.json(savedSpecimen);
    } catch (err) {
      console.error("Erro inesperado ao salvar o espécime:", err);
      return res.status(500).json({ error: "Erro inesperado ao salvar o espécime." });
    }
  });

  // Specimen AI generator proxy route
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { promptSpecimen, imageUrl, imageAuthor } = req.body;

      if (!promptSpecimen) {
        return res.status(400).json({ error: "O prompt do espécime é obrigatório." });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "A chave GEMINI_API_KEY não foi configurada nos segredos do app.",
        });
      }

      const systemPrompt = `Você é um curador e analista sênior do laboratório de morfologia digital e arquivos biológicos "ACERVO_DE_FORMAS_NATURAIS".
Sua tarefa é analisar a descrição de um espécime biológico microscópico fornecido pelo usuário (como radiolários, diatomáceas, heliozoários ou novos micro-organismos) e gerar um registro técnico completo em formato JSON perfeitamente estruturado.
O tom deve ser técnico, extremamente rigoroso, mantendo uma estética de Brutalismo Científico, Minimalismo de Arquivo e "Transparência Radical" (incluindo relatórios de ignorância técnica, dados ausentes e conflitos de classificação taxonômica entre instituições científicas de prestígio).
Todo o texto deve ser escrito em Português do Brasil (PT-BR).

Regras de campos específicos:
1. "id": Abreviação de 3 letras em caps e número gerado (ex: "RAD_204", "DIA_772").
2. "codigo_gaveta": Código do arquivo técnico (ex: "ESPECIME_v.204").
3. "gaveta_tecnica": Sempre "GAVETA_TECNICA".
4. "nome": Nome formal do binômio em latim em formato científico rigoroso (ex: "Dictyophimus gracilipes", "Centropyxis aculeata").
5. "lineage": Linha taxonômica formal em caps separada por pipe (ex: "FILO: RETARIA | CLASSE: RADiolaria | ORDEM: NASSELLARIA").
6. "descricao_funcional": Um parágrafo detalhado de 2 a 3 frases explicando a eficiência estrutural, porosidade mecânica e otimização geométrica do espécime para resistir à pressão hidrostática ou biológica marinha profunda.
7. "logica_ramificacao": Frase descrevendo o padrão estrito de ramificação geométrica ou fractal da carapaça de forma fria.
8. "composicao_material": Detalhe mineralúrgico do frustulito do esqueleto (ex: "Sílica amorfa hidratada com ligantes de zircônio", "Óxido de silício modificado com carbonato").
9. "metadados_tecnicos": Objeto com "escala" (ex: "0.25mm [MICRO-ESCALA]"), "data_coleta" (ou similar UTC), "proveniencia" (museu ou expedição em maiúscula e código, ex: "ARQUIVO_MUSEU_REG_#90412") e "coordenadas_vetoriais" (ex: "X:0.392 | Y:0.294 | Z:0.041").
10. "relatorio_ignorancia_titulo": Sempre "RELATÓRIO_DE_IGNORÂNCIA".
11. "relatorio_ignorancia_notas": Frase fria dizendo que lacunas são preservadas para transparência científica.
12. "alertas": Uma lista de exatamente 2 objetos contendo "titulo" (ex: "Fadiga Barométrica Inexplorada"), "tipo" (ex "DADOS_AUSENTES" ou "ORIGEM_INCERTA") e "descricao" detalhando lacunas científicas chocantes.
13. "conflitos": Uma lista de exatamente 2 objetos detalhando pontos de divergência em classificação entre instituições científicas de elite (como "INSTITUIÇÃO_SMITHSONIAN", "REDE_GBIF", "MUSEU_DE_HISTORIA_NATURAL_LONDRES", etc.).
14. "dinamica": Um objeto simulado de dinâmica estrutural microscópica física realista:
    - "rede_tensao": ex "Carga Ideal: 0.28N/mm²"
    - "rede_tensao_valor": número decimal realista correspondente à tensão, de 0.05 a 1.2
    - "coef_arrasto": ex "Cd: 0.052 (Hidrodinâmico)"
    - "coef_arrasto_valor": número decimal correspondente de 0.01 a 0.15
    - "limite_elasticidade": ex "Módulo de Cisalhamento: 84 GPa"
    - "limite_elasticidade_valor": número inteiro correspondente de 50 a 200
    - "inertia_termica": ex "Delta-T: 0.003s/K"
    - "inertia_termica_valor": número decimal de 0.001 a 0.015
15. "coordenadas_fisicas": ex: "LAT_5.221 LON_140.884"
16. "res_scan": ex: "5.4 MICRONS"
17. "ref_documento": ex: "REF_DOCUMENTO: #RAD_GEN_2026_PRISTINE"
18. "curadoria": ex: "Laboratório de Morfologia Digital"
19. "ultima_modificacao": ex "03_JUN_2026"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analise este espécime micro-morfofísico: ${promptSpecimen}`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              codigo_gaveta: { type: Type.STRING },
              gaveta_tecnica: { type: Type.STRING },
              nome: { type: Type.STRING },
              lineage: { type: Type.STRING },
              descricao_funcional: { type: Type.STRING },
              logica_ramificacao: { type: Type.STRING },
              composicao_material: { type: Type.STRING },
              metadados_tecnicos: {
                type: Type.OBJECT,
                properties: {
                  escala: { type: Type.STRING },
                  data_coleta: { type: Type.STRING },
                  proveniencia: { type: Type.STRING },
                  coordenadas_vetoriais: { type: Type.STRING },
                },
                required: ["escala", "data_coleta", "proveniencia", "coordenadas_vetoriais"],
              },
              relatorio_ignorancia_titulo: { type: Type.STRING },
              relatorio_ignorancia_notas: { type: Type.STRING },
              alertas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    titulo: { type: Type.STRING },
                    tipo: { type: Type.STRING },
                    descricao: { type: Type.STRING },
                  },
                  required: ["titulo", "tipo", "descricao"],
                },
              },
              conflitos: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nome: { type: Type.STRING },
                    instituicao: { type: Type.STRING },
                    ano: { type: Type.STRING },
                    descricao: { type: Type.STRING },
                    chave: { type: Type.STRING },
                  },
                  required: ["nome", "instituicao", "ano", "descricao", "chave"],
                },
              },
              dinamica: {
                type: Type.OBJECT,
                properties: {
                  rede_tensao: { type: Type.STRING },
                  rede_tensao_valor: { type: Type.NUMBER },
                  coef_arrasto: { type: Type.STRING },
                  coef_arrasto_valor: { type: Type.NUMBER },
                  limite_elasticidade: { type: Type.STRING },
                  limite_elasticidade_valor: { type: Type.NUMBER },
                  inertia_termica: { type: Type.STRING },
                  inertia_termica_valor: { type: Type.NUMBER },
                },
                required: [
                  "rede_tensao",
                  "rede_tensao_valor",
                  "coef_arrasto",
                  "coef_arrasto_valor",
                  "limite_elasticidade",
                  "limite_elasticidade_valor",
                  "inertia_termica",
                  "inertia_termica_valor",
                ],
              },
              coordenadas_fisicas: { type: Type.STRING },
              res_scan: { type: Type.STRING },
              ref_documento: { type: Type.STRING },
              curadoria: { type: Type.STRING },
              ultima_modificacao: { type: Type.STRING },
            },
            required: [
              "id",
              "codigo_gaveta",
              "gaveta_tecnica",
              "nome",
              "lineage",
              "descricao_funcional",
              "logica_ramificacao",
              "composicao_material",
              "metadados_tecnicos",
              "relatorio_ignorancia_titulo",
              "relatorio_ignorancia_notas",
              "alertas",
              "conflitos",
              "dinamica",
              "coordenadas_fisicas",
              "res_scan",
              "ref_documento",
              "curadoria",
              "ultima_modificacao",
            ],
          },
        },
      });

      const textOutput = response.text?.trim() || "{}";
      let parsedData: any;
      try {
        parsedData = JSON.parse(textOutput);
      } catch (parseErr) {
        console.error("Resposta do Gemini inválida (não é JSON):", textOutput, parseErr);
        return res.status(502).json({ error: "Resposta do provedor de IA não está em JSON válido." });
      }

      // Basic structural validation: ensure required top-level fields exist
      const requiredFields = [
        "id",
        "codigo_gaveta",
        "gaveta_tecnica",
        "nome",
        "lineage",
        "metadados_tecnicos",
      ];

      for (const fld of requiredFields) {
        if (!parsedData || typeof parsedData[fld] === "undefined") {
          console.error("Resposta do Gemini faltando campo obrigatório:", fld, parsedData);
          return res.status(422).json({ error: `Resposta da IA inválida: campo ausente ${fld}` });
        }
      }

      const finalImageUrl =
        typeof imageUrl === "string" && imageUrl.trim()
          ? imageUrl.trim()
          : "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=800";
      const finalImageAuthor =
        typeof imageAuthor === "string" && imageAuthor.trim()
          ? imageAuthor.trim()
          : parsedData.imagem_autor || "Curadoria Gemini";

      parsedData.imagem_url = finalImageUrl;
      parsedData.imagem_autor = finalImageAuthor;
      parsedData.image_prompt = parsedData.image_prompt || promptSpecimen;

      if (supabase) {
        try {
          const { error: upsertError } = await supabase
            .from(SUPABASE_TABLE)
            .upsert([{ ...parsedData }], { onConflict: "id" });

          if (upsertError) {
            console.error("Erro ao persistir espécime sintetizado no Supabase:", upsertError.message);
          }
        } catch (upsertErr) {
          console.error("Erro inesperado ao persistir espécime sintetizado no Supabase:", upsertErr);
        }
      }

      res.json(parsedData);
    } catch (err: any) {
      console.error("Erro na síntese do espécime:", err);
      res.status(500).json({ error: err?.message || "Erro desconhecido na síntese por IA." });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to 0.0.0.0 and port 3000 as required by nginx routing proxy
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
