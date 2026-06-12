import React, { useState, useMemo, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Database,
  Network,
  Clock,
  MapPin,
  Search,
  User,
  AlertTriangle,
  Settings,
  HelpCircle,
  Activity,
  Sparkles,
  Terminal,
  X,
  Copy,
  Download,
  Sliders,
  Info,
  Cpu,
  Plus,
  RefreshCw,
  FileText
} from "lucide-react";
import { initialSpecimens } from "./data";
import { Specimen } from "./types";

export default function App() {
  // Application tab states: 'colecoes' | 'taxonomia' | 'cronologia' | 'proveniencia' | 'microscopia' | 'busca'
  const [activeTab, setActiveTab] = useState<"colecoes" | "taxonomia" | "cronologia" | "proveniencia" | "microscopia" | "busca">("colecoes");

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<Specimen[]>([]);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [activeSpecimenId, setActiveSpecimenId] = useState("HEX_042");
  const [specimens, setSpecimens] = useState<Specimen[]>(initialSpecimens);

  // Left Sidebar file explorer grouping mode: 'taxonomia' | 'cronologia' | 'proveniencia'
  const [sidebarGroupMode, setSidebarGroupMode] = useState<"taxonomia" | "cronologia" | "proveniencia">("taxonomia");

  // Map selection for geographical tab
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");

  // Filtered specimens based on global navigation header search
  const filteredSpecimens = useMemo(() => {
    return specimens.filter((spec) => {
      const matchQuery = searchQuery.toLowerCase();
      return (
        spec.nome.toLowerCase().includes(matchQuery) ||
        spec.id.toLowerCase().includes(matchQuery) ||
        spec.lineage.toLowerCase().includes(matchQuery) ||
        spec.composicao_material.toLowerCase().includes(matchQuery)
      );
    });
  }, [specimens, searchQuery]);

  // Update dropdown results whenever search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = filteredSpecimens.slice(0, 8); // Limit to 8 results
      setSearchResults(results);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  }, [filteredSpecimens, searchQuery]);

  // Group specimens based on selected mode for "Sieve do Arquivo" folder explorer
  const sidebarGroupedSpecimens = useMemo(() => {
    const groups: { title: string; specimens: Specimen[] }[] = [];

    if (sidebarGroupMode === "taxonomia") {
      const map: Record<string, Specimen[]> = {};
      filteredSpecimens.forEach((spec) => {
        const parts = spec.lineage ? spec.lineage.split("|") : [];
        const phylum = parts[0]?.replace("FILO:", "").trim() || "RETARIA";
        const classe = parts[1]?.replace("CLASSE:", "").trim() || "POLYCYSTINA";
        const key = `${phylum} » ${classe}`;
        if (!map[key]) map[key] = [];
        map[key].push(spec);
      });
      Object.entries(map).forEach(([key, list]) => {
        groups.push({ title: key, specimens: list });
      });
    } else if (sidebarGroupMode === "cronologia") {
      const map: Record<string, Specimen[]> = {};
      filteredSpecimens.forEach((spec) => {
        const dateStr = spec.metadados_tecnicos?.data_coleta || "";
        const match = dateStr.match(/\d{4}/);
        const year = match ? `Expedições de ${match[0]}` : "Sintéticos, Re-Curados ou Re-Sintetizados";
        if (!map[year]) map[year] = [];
        map[year].push(spec);
      });
      Object.entries(map).forEach(([key, list]) => {
        groups.push({ title: key, specimens: list });
      });
    } else if (sidebarGroupMode === "proveniencia") {
      const map: Record<string, Specimen[]> = {};
      filteredSpecimens.forEach((spec) => {
        const prov = spec.metadados_tecnicos?.proveniencia || "Geral";
        let cleanProv = prov.replace("COLEÇÃO_", "").replace("ARQUIVO_", "").replace("REG_#", "#");
        if (cleanProv.includes("FOSSA_DAS_MARIANAS")) cleanProv = "Fossa das Marianas";
        if (cleanProv.includes("ANTÁRTICA")) cleanProv = "Criologia Polar Antártica";
        if (cleanProv.includes("MUSEU")) cleanProv = "Recursos de Museus / Manus";
        
        if (!map[cleanProv]) map[cleanProv] = [];
        map[cleanProv].push(spec);
      });
      Object.entries(map).forEach(([key, list]) => {
        groups.push({ title: key, specimens: list });
      });
    }

    return groups;
  }, [filteredSpecimens, sidebarGroupMode]);

  // Dynamic simulation parameters for physical laboratory (Microscopia tab)
  const [simulationPressure, setSimulationPressure] = useState(380); // in atm
  const [simulationTemp, setSimulationTemp] = useState(4.2); // in °C
  const [simulationSalinity, setSimulationSalinity] = useState(34.8); // in PSU

  // Modals and UI actions
  const [exportModalSpecimen, setExportModalSpecimen] = useState<Specimen | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [synthesizerOpen, setSynthesizerOpen] = useState(false);

  // AI curator input & logger states
  const [customSpecimenPrompt, setCustomSpecimenPrompt] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [userImageAuthor, setUserImageAuthor] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Selected specimen detailed record
  const activeSpecimen = useMemo(() => {
    const found = specimens.find((s) => s.id === activeSpecimenId);
    return found || specimens[0] || initialSpecimens[0];
  }, [specimens, activeSpecimenId]);

  useEffect(() => {
    const fetchSpecimens = async () => {
      try {
        const response = await fetch("/api/specimens");
        if (!response.ok) {
          console.warn("Falha ao carregar espécimes do servidor Supabase.");
          return;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setSpecimens(data);
          setActiveSpecimenId(data[0]?.id || activeSpecimenId);
        }
      } catch (error) {
        console.error("Erro ao buscar espécimes:", error);
      }
    };

    fetchSpecimens();
  }, []);

  // Group specimens by geographical locations dynamically
  const specimensByLocation = useMemo(() => {
    const locationsMap: Record<string, {
      id: string;
      nome: string;
      coordenadas: string;
      profundidade: string;
      temperatura: string;
      pressao: string;
      bioma: string;
      specimens: Specimen[];
      x: number; // Percent on map grid
      y: number; // Percent on map grid
    }> = {
      marianas: {
        id: "marianas",
        nome: "Fossa das Marianas (Pacífico Ocidental)",
        coordenadas: "LAT_11.349 LON_142.198",
        profundidade: "10.928 metros (Zona Hadal)",
        temperatura: "1.5 °C - 2.0 °C",
        pressao: "1090 atm",
        bioma: "Ecologia quimiotrófica de extrema profundidade na fossa mais profunda da Terra. Amostras obtidas com braço robótico de ROV profundo em sedimentos silicosos ultrafinos.",
        specimens: [],
        x: 89.4,
        y: 43.8
      },
      antartica: {
        id: "antartica",
        nome: "Zona Criogênica Polar (Mar de Ross, Antártica)",
        coordenadas: "LAT_-77.412 LON_164.221",
        profundidade: "150 - 480 metros (Criosfera)",
        temperatura: "-1.8 °C - 1.0 °C",
        pressao: "15 - 48 atm",
        bioma: "Ecossistema polar criosférico exposto ao congelamento marinho cíclico, ventos de barreira catabáticos e radiação UV oblíqua extrema no verão austral.",
        specimens: [],
        x: 95.5,
        y: 92.7
      },
      equatorial: {
        id: "equatorial",
        nome: "Trincheira de Manus / Pacífico Sul Equatorial",
        coordenadas: "LAT_-2.332 LON_144.912",
        profundidade: "2.460 metros (Zona Batial)",
        temperatura: "3.5 °C - 5.0 °C",
        pressao: "246 atm",
        bioma: "Zona equatorial profunda. Influência direta de plumas hidrotermais de alta acidez e deposição de microestrutura mineralizada de sílica opalina pura.",
        specimens: [],
        x: 90.2,
        y: 51.1
      },
      outros: {
        id: "outros",
        nome: "Expedições Virtuais & Curadorias Customizadas",
        coordenadas: "LAT_0.000 LON_0.000 (Híbrida)",
        profundidade: "Geração Variável",
        temperatura: "3.1 °C - 18.4 °C",
        pressao: "Variável (Conforme IA)",
        bioma: "Registros morfológicos curados de forma sintética com o motor de curadoria por inteligência artificial Gemini-3.5-flash baseados em prompts e coordenadas geradas.",
        specimens: [],
        x: 48.0,
        y: 55.0
      }
    };

    specimens.forEach((spec) => {
      const provUpper = spec.metadados_tecnicos.proveniencia.toUpperCase();
      const coord = spec.coordenadas_fisicas.toUpperCase();
      
      if (provUpper.includes("MARIANAS") || coord.includes("LAT_11") || spec.id === "LIT_118") {
        locationsMap.marianas.specimens.push(spec);
      } else if (provUpper.includes("ANTÁRTICA") || provUpper.includes("POLAR") || coord.includes("LAT_-77") || spec.id === "TRI_091") {
        locationsMap.antartica.specimens.push(spec);
      } else if (provUpper.includes("MUSEU") || coord.includes("LAT_-2") || spec.id === "HEX_042") {
        locationsMap.equatorial.specimens.push(spec);
      } else {
        // Try parsing coordinates dynamically if possible to group on other local, or put into outros
        locationsMap.outros.specimens.push(spec);
      }
    });

    // Only return categories that have specimens
    return Object.values(locationsMap).filter(loc => loc.specimens.length > 0);
  }, [specimens]);

  // Sync simulation sliders when active specimen changes
  useEffect(() => {
    if (activeSpecimen) {
      // Hexancastra sp. deep sea high pressure defaults
      if (activeSpecimen.id === "HEX_042") {
        setSimulationPressure(380);
        setSimulationTemp(4.2);
        setSimulationSalinity(34.8);
      } else if (activeSpecimen.id === "TRI_091") {
        // Polar freezing sea pressure defaults
        setSimulationPressure(12);
        setSimulationTemp(-1.8);
        setSimulationSalinity(32.1);
      } else if (activeSpecimen.id === "LIT_118") {
        // Deep abyssal trench pressure defaults
        setSimulationPressure(840);
        setSimulationTemp(1.5);
        setSimulationSalinity(35.2);
      } else {
        // Synthesised customized specimen default physics
        setSimulationPressure(Math.round(activeSpecimen.dinamica.rede_tensao_valor * 1000));
        setSimulationTemp(activeSpecimen.dinamica.inertia_termica_valor > 0.005 ? 18.4 : 3.1);
        setSimulationSalinity(34.2);
      }
    }
  }, [activeSpecimenId]);

  // Append scrolling logs automatically during AI synthesis
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [synthesisLogs]);

  // Handle scientific CSV/JSON copy/download trigger
  const copyExportDataToClipboard = (spec: Specimen) => {
    const dataStr = JSON.stringify(spec, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert(`DADOS_${spec.id}_COPIADOS! Dados exportados para a área de transferência com sucesso.`);
  };

  const downloadExportDataFile = (spec: Specimen) => {
    const dataStr = JSON.stringify(spec, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LOG_ACERVO_${spec.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run server-side Gemini powered specimen synthesis
  const handleAISynthesis = async (e: FormEvent) => {
    e.preventDefault();
    if (!customSpecimenPrompt.trim() || isSynthesizing) return;

    setIsSynthesizing(true);
    setSynthesisLogs([
      "INICIANDO CURADORIA DE ESTRUTURA NATURAL DE SÍLICA...",
      "[CONECTANDO] Servidor de Resiliência Biomecânica...",
      "[ESTADO] Chave de API ativada: process.env.GEMINI_API_KEY",
      `[PROMPT] "${customSpecimenPrompt}"`,
      "[PROCESSANDO] Enviando parâmetros morfológicos para o Gemini-3.5-flash..."
    ]);

    // Interval to generate tech logs
    const logInterval = setInterval(() => {
      const logs = [
        "[PROVADO] Calculando coeficientes de condutividade barométrica...",
        "[CÁLCULO] Sintetizando matriz estructural e escala do espécime...",
        "[CONFLITO] Mapeando divergências taxonômicas entre Smithsonian e GBIF...",
        "[DDS] Registrando ignorância técnica de profundidade abissal...",
        "[CURADORIA] Formatando dados estruturais e resiliência mecânica..."
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSynthesisLogs((prev) => [...prev, randomLog]);
    }, 1500);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptSpecimen: customSpecimenPrompt }),
      });

      const data = await response.json();

      clearInterval(logInterval);

      if (response.ok && data.id) {
        setSynthesisLogs((prev) => [
          ...prev,
          "[OK] ESPÉCIME MORFOLÓGICO CURADO COM SUCESSO!",
          `[NOME] ${data.nome} [ID] ${data.id}`,
          `[ESCALA] ${data.metadados_tecnicos.escala}`,
          "[GRAVANDO] Salvando na gaveta técnica digital local...",
          "[MIGRADO] Gaveta integrada! Redirecionando views."
        ]);

        // Synthesized specimen is appended to state list
        const newSpecimen: Specimen = {
          ...data,
          // Custom external image link if specified, otherwise fallback image
          imagem_url: userImageUrl.trim() || "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=800",
          imagem_autor: userImageAuthor.trim() || "Autoria Indeterminada"
        };

        // Save to Supabase and use the record returned by the server
        let savedSpecimen: Specimen = newSpecimen;

        try {
          const saveResponse = await fetch("/api/specimens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSpecimen),
          });

          if (saveResponse.ok) {
            const savedData = await saveResponse.json();
            savedSpecimen = savedData as Specimen;
            setSynthesisLogs((prev) => [
              ...prev,
              "[SUPABASE] Espécime persistido no banco de dados remoto com sucesso!"
            ]);
          } else {
            console.warn("Falha ao salvar no Supabase, mas espécime foi mantido localmente.");
            setSynthesisLogs((prev) => [
              ...prev,
              "[AVISO] Supabase offline - espécime salvo apenas localmente"
            ]);
          }
        } catch (supabaseErr) {
          console.error("Erro ao salvar no Supabase:", supabaseErr);
          setSynthesisLogs((prev) => [
            ...prev,
            "[AVISO] Falha na sincronização com Supabase - dados salvos localmente"
          ]);
        }

        setTimeout(() => {
          setSpecimens((prev) => [savedSpecimen, ...prev]);
          setActiveSpecimenId(savedSpecimen.id);
          setIsSynthesizing(false);
          setSynthesizerOpen(false);
          setCustomSpecimenPrompt("");
          setUserImageUrl("");
          setUserImageAuthor("");
          setActiveTab("colecoes");
        }, 1500);

      } else {
        throw new Error(data.error || "Operação rejeitada pelo barômetro do servidor.");
      }
    } catch (err: any) {
      clearInterval(logInterval);
      setSynthesisLogs((prev) => [
        ...prev,
        `[ERRO DE SÍNTESE] Falha na operação: ${err.message || "Erro desconhecido."}`,
        "[ALERTA] Redundância crítica - verifique os segredos ou tente novamente."
      ]);
      setIsSynthesizing(false);
    }
  };

  // Dynamic values calculated based on physical sandbox slider ranges
  const simulatedTension = useMemo(() => {
    // Tension increases when pressure is higher than typical scale
    const baseValue = activeSpecimen.dinamica.rede_tensao_valor;
    const loadFactor = simulationPressure / 400;
    const calculated = baseValue * loadFactor;
    return calculated.toFixed(3);
  }, [activeSpecimen, simulationPressure]);

  const simulatedDrag = useMemo(() => {
    // Drag reduces slightly as water salinity scales viscosity, or is relative to temperature
    const baseValue = activeSpecimen.dinamica.coef_arrasto_valor;
    const salinityFactor = simulationSalinity / 35;
    const calculated = baseValue * salinityFactor;
    return calculated.toFixed(4);
  }, [activeSpecimen, simulationSalinity]);

  const simulatedElasticity = useMemo(() => {
    // Elastic modulus is affected by thermal conditions (silica gets more brittle when extremely cold)
    const baseValue = activeSpecimen.dinamica.limite_elasticidade_valor;
    const tempFactor = 1 + (simulationTemp - 4) * 0.002;
    const calculated = baseValue * tempFactor;
    return Math.round(calculated);
  }, [activeSpecimen, simulationTemp]);

  const simulatedThermalDelta = useMemo(() => {
    const baseValue = activeSpecimen.dinamica.inertia_termica_valor;
    const tempDiff = Math.abs(simulationTemp - 4);
    const calculated = baseValue * (1 + tempDiff * 0.05);
    return calculated.toFixed(5);
  }, [activeSpecimen, simulationTemp]);

  // Helper flags for warning values (Brutalist style warnings)
  const isPressureCritical = simulationPressure > 500;
  const isTempCritical = simulationTemp < 0 || simulationTemp > 28;

  return (
    <div className="min-h-screen flex flex-col bg-background-antique text-primary font-mono select-none antialiased">
      {/* TopNavBar */}
      <header className="border-b border-primary bg-background-antique fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 h-16 transition-colors duration-200">
        <div className="flex items-baseline gap-2 cursor-pointer select-none" onClick={() => { setActiveTab("colecoes"); }}>
          <div className="font-serif italic text-2xl font-semibold tracking-tighter text-primary hover:opacity-85 transition-opacity">
            Archive
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 ml-2 hidden sm:inline">| Acervo Natural</span>
        </div>

        {/* Global Tab Navigation */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          <button
            onClick={() => setActiveTab("colecoes")}
            className={`font-mono text-[10px] xl:text-[11px] tracking-[0.2em] font-bold py-5 cursor-pointer uppercase transition-all duration-150 relative ${
              activeTab === "colecoes" ? "text-primary border-b border-primary" : "text-secondary-grey hover:text-primary"
            }`}
          >
            Coleções
          </button>
          <button
            onClick={() => setActiveTab("taxonomia")}
            className={`font-mono text-[10px] xl:text-[11px] tracking-[0.2em] font-bold py-5 cursor-pointer uppercase transition-all duration-150 relative ${
              activeTab === "taxonomia" ? "text-primary border-b border-primary" : "text-secondary-grey hover:text-primary"
            }`}
          >
            Taxonomia
          </button>
          <button
            onClick={() => setActiveTab("cronologia")}
            className={`font-mono text-[10px] xl:text-[11px] tracking-[0.2em] font-bold py-5 cursor-pointer uppercase transition-all duration-150 relative ${
              activeTab === "cronologia" ? "text-primary border-b border-primary" : "text-secondary-grey hover:text-primary"
            }`}
          >
            Cronologia
          </button>
          <button
            onClick={() => setActiveTab("proveniencia")}
            className={`font-mono text-[10px] xl:text-[11px] tracking-[0.2em] font-bold py-5 cursor-pointer uppercase transition-all duration-150 relative ${
              activeTab === "proveniencia" ? "text-primary border-b border-primary" : "text-secondary-grey hover:text-primary"
            }`}
          >
            Proveniência
          </button>
          <button
            onClick={() => setActiveTab("microscopia")}
            className={`font-mono text-[10px] xl:text-[11px] tracking-[0.2em] font-bold py-5 cursor-pointer uppercase transition-all duration-150 relative ${
              activeTab === "microscopia" ? "text-primary border-b border-primary" : "text-secondary-grey hover:text-primary"
            }`}
          >
            Simulação Física
          </button>
        </nav>

        {/* Action Widgets */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center border border-primary bg-white px-2 py-1 max-w-[200px] md:max-w-xs transition-all">
            <Search className="w-4 h-4 text-secondary-grey mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  setLastSearchQuery(searchQuery);
                  setActiveTab("busca");
                  setShowSearchDropdown(false);
                }
              }}
              className="bg-transparent text-xs text-primary focus:outline-none w-full font-mono placeholder:text-gray-400"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchDropdown(false);
                }} 
                className="absolute right-2 text-secondary-grey hover:text-primary"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {/* Search Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary shadow-lg z-60 max-h-64 overflow-y-auto"
              >
                {searchResults.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setActiveSpecimenId(spec.id);
                      setActiveTab("colecoes");
                      setShowSearchDropdown(false);
                      setSearchQuery("");
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-mono hover:bg-primary/10 border-b border-primary/10 last:border-b-0 text-primary transition-colors"
                  >
                    <div className="font-bold truncate">{spec.nome}</div>
                    <div className="text-[10px] text-secondary-grey truncate">{spec.id} · {spec.lineage.split("|")[0]}</div>
                  </button>
                ))}
                <div
                  onClick={() => {
                    setLastSearchQuery(searchQuery);
                    setActiveTab("busca");
                    setShowSearchDropdown(false);
                  }}
                  className="px-3 py-2 text-center text-xs font-bold uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10 cursor-pointer border-t border-primary/10 transition-colors"
                >
                  Ver todos os {filteredSpecimens.length} resultados →
                </div>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center justify-center border border-primary p-2 bg-[#FAF9F6] hover:bg-primary hover:text-white transition-all cursor-pointer h-9 w-9"
            title="Ficha do Pesquisador"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSynthesizerOpen(true)}
            className="hidden md:flex items-center gap-1.5 border border-primary px-4 py-1.5 bg-primary text-white text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-white hover:text-primary transition-all cursor-pointer h-9 shrink-0 animate-pulse"
          >
            <Plus className="w-3.5 h-3.5" />
            Sintetizar
          </button>
        </div>
      </header>

      {/* SideNavBar & Main Content Wrapper */}
      <div className="flex flex-1 mt-16 min-h-[calc(100vh-64px)] relative">
        
        {/* Left Side Drawer (Technical Drawer / Navigation Filter) */}
        <aside className="bg-surface-alt fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-primary/15 z-50 flex flex-col justify-between hidden md:flex">
          
          <div className="flex flex-col flex-1 divide-y divide-primary/15">
            {/* Folder Identification Block */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-warning-amber/10 flex items-center justify-center border border-warning-amber/20">
                  <Cpu className="w-5 h-5 text-warning-amber" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono tracking-widest text-primary uppercase select-all">
                    {activeSpecimen.codigo_gaveta}
                  </div>
                  <div className="text-[9px] text-secondary-grey font-mono uppercase tracking-[0.15em]">
                    {activeSpecimen.gaveta_tecnica}
                  </div>
                </div>
              </div>
            </div>

            {/* Explanatory subtitle / Mode switcher */}
            <div className="py-3 px-4 bg-primary/[0.02] border-b border-primary/10">
              <span className="text-[8px] font-bold text-secondary-grey uppercase tracking-[0.2em] block mb-2 font-mono">
                Agrupar Arquivo Por:
              </span>
              <div className="grid grid-cols-3 border border-primary/20 bg-white">
                <button
                  onClick={() => setSidebarGroupMode("taxonomia")}
                  title="Agrupar por Classificação Científica"
                  className={`py-1.5 text-[9px] font-bold tracking-wider uppercase font-mono border-r border-primary/10 cursor-pointer transition-all ${
                    sidebarGroupMode === "taxonomia" ? "bg-primary text-white" : "text-secondary-grey hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  TAXON
                </button>
                <button
                  onClick={() => setSidebarGroupMode("cronologia")}
                  title="Agrupar por Ano de Coleta"
                  className={`py-1.5 text-[9px] font-bold tracking-wider uppercase font-mono border-r border-primary/10 cursor-pointer transition-all ${
                    sidebarGroupMode === "cronologia" ? "bg-primary text-white" : "text-secondary-grey hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  CRONO
                </button>
                <button
                  onClick={() => setSidebarGroupMode("proveniencia")}
                  title="Agrupar por Proveniência de Origem"
                  className={`py-1.5 text-[9px] font-bold tracking-wider uppercase font-mono cursor-pointer transition-all ${
                    sidebarGroupMode === "proveniencia" ? "bg-primary text-white" : "text-secondary-grey hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  PROV
                </button>
              </div>
            </div>

            {/* Folder Directory Explorer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)] custom-scrollbar">
              <span className="text-[8px] font-bold text-secondary-grey font-mono tracking-widest uppercase block mb-1">
                // DIRETÓRIO DE ARQUIVO ({filteredSpecimens.length} Formas)
              </span>

              {sidebarGroupedSpecimens.length === 0 ? (
                <div className="text-[10px] text-secondary-grey/60 italic p-2 border border-dashed border-primary/10">
                  Nenhuma forma correspondente aos critérios de busca.
                </div>
              ) : (
                sidebarGroupedSpecimens.map((group) => (
                  <div key={group.title} className="space-y-1 bg-primary/[0.01] p-1.5 border border-primary/5 rounded-xs select-none">
                    {/* Folder Title Heading */}
                    <div className="text-[9px] font-bold text-primary/80 uppercase font-mono tracking-wider flex items-center gap-1.5 py-1 border-b border-primary/5 mb-1.5">
                      <span className="text-warning-amber">📂</span>
                      <span className="truncate max-w-[170px]" title={group.title}>{group.title}</span>
                      <span className="opacity-50 text-[8px]">({group.specimens.length})</span>
                    </div>

                    {/* Specimens inside this Folder group */}
                    <div className="space-y-1 pl-2">
                      {group.specimens.map((spec) => {
                        const isSelected = activeSpecimenId === spec.id;
                        return (
                          <button
                            key={spec.id}
                            onClick={() => {
                              setActiveSpecimenId(spec.id);
                              // Auto navigate to collections/details if viewing a different tab
                              if (activeTab !== "colecoes" && activeTab !== "microscopia" && activeTab !== "taxonomia" && activeTab !== "cronologia" && activeTab !== "proveniencia") {
                                setActiveTab("colecoes");
                              }
                            }}
                            className={`w-full py-1.5 px-2 text-left text-[10px] select-all flex justify-between items-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary text-white font-bold rounded-xs shadow-xs"
                                : "text-secondary-grey hover:bg-primary/5 hover:text-primary bg-white/20"
                            }`}
                          >
                            <span className="truncate italic font-serif max-w-[130px] pr-1">{spec.nome}</span>
                            <span className={`text-[8px] font-mono shrink-0 px-1 border rounded-xs ${
                              isSelected ? "bg-white/20 border-white/20 text-white" : "bg-[#E5E1D8]/60 border-primary/10 text-primary/60"
                            }`}>
                              {spec.id}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Trigger Panels at structural base */}
          <div className="flex flex-col border-t border-primary/15 bg-background-antique">
            <div className="p-4">
              <button
                onClick={() => setExportModalSpecimen(activeSpecimen)}
                className="w-full py-2 bg-white text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer text-center"
              >
                Exportar_Dados &rarr;
              </button>
            </div>

            <footer className="p-4 border-t border-primary/15 flex flex-col gap-2.5 text-secondary-grey text-xs">
              <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors" onClick={() => setProfileModalOpen(true)}>
                <Settings className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Configurações</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors" onClick={() => setProfileModalOpen(true)}>
                <HelpCircle className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Suporte Técnico</span>
              </div>
            </footer>
          </div>
        </aside>

        {/* MAIN DISPLAY CANVAS */}
        <main className="flex-1 md:ml-64 p-0 min-h-full flex flex-col bg-background-antique pb-16">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: COLLECTIONS VIEW (Default Match to Screenshot layout and styling) */}
            {activeTab === "colecoes" && (
              <motion.div
                key="catalog-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                {/* Hero Section */}
                <section className="relative w-full h-[55vh] md:h-[60vh] bg-primary overflow-hidden flex items-center justify-center border-b border-primary">
                  <img
                    alt={activeSpecimen.nome}
                    className="h-full w-full object-cover opacity-80 mix-blend-luminosity"
                    referrerPolicy="no-referrer"
                    src={activeSpecimen.imagem_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end p-6 md:p-12">
                    <div className="text-white text-[10px] font-bold tracking-widest mb-1 select-all">
                      ID_ESPECIME_{activeSpecimen.id}
                    </div>
                    <h1 className="text-white font-serif text-4xl md:text-5xl italic font-semibold tracking-tight">
                      {activeSpecimen.nome}
                    </h1>
                    <div className="text-gray-300 text-[11px] font-medium uppercase tracking-widest mt-2 bg-black/40 py-1 px-2 border border-white/20 self-start">
                      {activeSpecimen.lineage}
                    </div>
                  </div>

                  {/* Photo Authorship & Storage Tag to respect Zero Storage Cost constraint */}
                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 text-[#F9F7F2] text-[9px] font-mono border border-warning-amber/40 flex flex-col sm:flex-row gap-2 backdrop-blur-xs select-all">
                    <span className="text-warning-amber font-semibold uppercase tracking-wider">● HOSPEDAGEM EXTERNA DETECTADA</span>
                    <span className="hidden sm:inline text-[#F9F7F2]/30">|</span>
                    <span className="uppercase tracking-wider">CRÉDITO DE AUTORIA: {activeSpecimen.imagem_autor || activeSpecimen.imagem_url.startsWith("http") ? (activeSpecimen.imagem_autor || "Fonte Externa Pública") : "Acervo de Formas Naturais"}</span>
                  </div>

                  {/* Micro Indicators for interactive feel */}
                  <div className="absolute top-4 right-4 bg-black/80 px-2 py-1 text-white text-[9px] font-mono border border-primary/20 flex items-center gap-1.5 backdrop-blur-xs select-all">
                    <span>COORDS: {activeSpecimen.coordenadas_fisicas}</span>
                  </div>
                </section>

                {/* Specimen Metadata Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-primary divide-y lg:divide-y-0 lg:divide-x divide-primary bg-background-antique">
                  
                  {/* Functional Description & Detailed Technical Tables */}
                  <div className="lg:col-span-8 p-6 md:p-10 flex flex-col justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-medium mb-4 pb-2 border-b border-primary/10 tracking-tight">
                        Descrição Funcional
                      </h2>
                      <p className="font-serif text-[17px] italic text-primary/85 leading-relaxed mb-6">
                        {activeSpecimen.descricao_funcional}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="p-4 border border-primary/15 bg-surface-alt/60">
                          <span className="text-[9px] font-bold text-secondary-grey block mb-1 uppercase tracking-[0.2em] font-mono">
                            LOGICA DE RAMIFICACAO
                          </span>
                          <p className="text-xs leading-relaxed font-sans text-primary/80">{activeSpecimen.logica_ramificacao}</p>
                        </div>
                        <div className="p-4 border border-primary/15 bg-surface-alt/60">
                          <span className="text-[9px] font-bold text-secondary-grey block mb-1 uppercase tracking-[0.2em] font-mono">
                            COMPOSICAO DE MATERIAL
                          </span>
                          <p className="text-xs leading-relaxed font-sans text-primary/80">{activeSpecimen.composicao_material}</p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Metadata Table with tab highlighted styles */}
                    <div className="mt-8 transition-all">
                      <h3 className="text-[9px] font-bold mb-3 text-secondary-grey/80 tracking-[0.2em] uppercase font-mono">
                        METADADOS_TECNICOS_REGISTRO
                      </h3>
                      <div className="w-full border-t border-primary/20 divide-y divide-primary/10 text-xs">
                        
                        <div className={`flex py-3 transition-all duration-300`}>
                          <div className="w-1/3 font-semibold text-secondary-grey tracking-wider uppercase font-mono text-[10px]">ESCALA</div>
                          <div className="w-2/3 select-all font-mono text-[11px] text-primary">{activeSpecimen.metadados_tecnicos.escala}</div>
                        </div>

                        <div className={`flex py-3 transition-all duration-300 ${sidebarGroupMode === "cronologia" ? "bg-warning-amber/5 px-3 border-l-2 border-warning-amber" : ""}`}>
                          <div className="w-1/3 font-semibold text-secondary-grey tracking-wider uppercase font-mono text-[10px]">DATA_DA_COLETA</div>
                          <div className="w-2/3 select-all font-mono text-[11px] text-primary">{activeSpecimen.metadados_tecnicos.data_coleta}</div>
                        </div>

                        <div className={`flex py-3 transition-all duration-300 ${sidebarGroupMode === "proveniencia" ? "bg-warning-amber/5 px-3 border-l-2 border-warning-amber" : ""}`}>
                          <div className="w-1/3 font-semibold text-secondary-grey tracking-wider uppercase font-mono text-[10px]">PROVENIÊNCIA</div>
                          <div className="w-2/3">
                            <a className="underline font-mono text-[11px] text-warning-amber hover:text-primary transition-colors select-all" href="#">
                              {activeSpecimen.metadados_tecnicos.proveniencia}
                            </a>
                          </div>
                        </div>

                        <div className={`flex py-3 transition-all duration-300 ${sidebarGroupMode === "taxonomia" ? "bg-warning-amber/5 px-3 border-l-2 border-warning-amber" : ""}`}>
                          <div className="w-1/3 font-semibold text-secondary-grey tracking-wider uppercase font-mono text-[10px]">COORDENADAS_VETORIAIS</div>
                          <div className="w-2/3 select-all font-mono text-[11px] text-primary">{activeSpecimen.metadados_tecnicos.coordenadas_vetoriais}</div>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Ignorance Sidebar Panel (Radical Transparency Doctrine) */}
                  <aside className="lg:col-span-4 bg-surface-alt p-6 md:p-8 flex flex-col gap-6 justify-between">
                    <div className="flex flex-col gap-4">
                      
                      <h3 className="text-[10px] font-bold text-secondary-grey flex items-center gap-2 uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4 text-warning-amber shrink-0" />
                        {activeSpecimen.relatorio_ignorancia_titulo}
                      </h3>

                      {activeSpecimen.alertas.map((alerta, i) => (
                        <div key={i} className="border border-warning-amber p-4 bg-white transition-all transform hover:-translate-y-[1px] hover:shadow-xs">
                          <div className="text-[10px] font-bold text-warning-amber mb-1 tracking-widest">
                            {alerta.tipo}
                          </div>
                          <div className="font-serif text-lg text-primary italic font-semibold leading-tight mb-2">
                            {alerta.titulo}
                          </div>
                          <p className="text-xs text-secondary-grey leading-relaxed font-sans">
                            {alerta.descricao}
                          </p>
                        </div>
                      ))}

                    </div>

                    <div className="p-4 border border-primary border-dashed bg-white">
                      <span className="text-[10px] font-bold text-secondary-grey tracking-widest block mb-2">
                        NOTA_DE_ARQUIVO
                      </span>
                      <p className="text-xs leading-relaxed text-secondary-grey">
                        {activeSpecimen.relatorio_ignorancia_notas}
                      </p>
                    </div>

                  </aside>
                </section>

                {/* Conflict Mirroring Section */}
                <section className="p-6 md:p-12 bg-white border-b border-primary/15">
                  <h2 className="font-serif text-lg font-bold mb-6 border-b border-warning-amber pb-1.5 inline-block uppercase tracking-tight text-primary">
                    ESPELHAMENTO DE CONFLITOS (CONTRADICOES TECNICAS)
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 bg-primary/15 gap-[1px] border border-primary/20">
                    {activeSpecimen.conflitos.map((conflito, index) => (
                      <div key={index} className="bg-background-antique/50 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                            <span className="text-[9px] font-bold bg-warning-amber/10 text-warning-amber px-2.5 py-1 border border-warning-amber/15 uppercase tracking-widest font-mono">
                              {conflito.instituicao}
                            </span>
                            <span className="text-[10px] text-secondary-grey/80 font-mono font-semibold">
                              VERIFICADO: {conflito.ano}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl font-normal italic mb-3 text-primary">
                            {conflito.nome}
                          </h3>
                          <p className="text-xs text-secondary-grey/90 leading-relaxed font-sans">
                            {conflito.descricao}
                          </p>
                        </div>
                        
                        <div className="mt-6 text-[10px] font-bold text-warning-amber tracking-widest font-mono uppercase">
                          // {conflito.chave}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Interactive Dynamic Metrics Bento Grid */}
                <section className="p-6 md:p-12 bg-background-antique">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                      <h2 className="font-serif text-3xl font-medium tracking-tight">
                        Dinâmica Estrutural
                      </h2>
                      <p className="text-xs text-secondary-grey mt-2">
                        Valores calculados em tempo real de acordo com as constantes físicas locais.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab("microscopia")}
                      className="text-[10px] font-bold text-primary border-b border-primary pb-1 hover:bg-gray-200 hover:px-2 transition-all cursor-pointer uppercase tracking-wider shrink-0"
                    >
                      Ver Simulação Física -&gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Rede de Tensão */}
                    <div className="border border-primary p-4 flex flex-col aspect-square justify-between group hover:bg-primary hover:text-white transition-all bg-white cursor-pointer duration-300">
                      <span className="text-[10px] font-bold text-secondary-grey group-hover:text-amber-200 tracking-wider">
                        SIM_01_TENSÃO
                      </span>
                      <div>
                        <div className="text-xl font-serif italic mb-1">Rede de Tensão</div>
                        <div className="text-xs font-mono text-secondary-grey group-hover:text-white/80">
                          Carga Ideal: {simulatedTension} N/mm²
                        </div>
                      </div>
                    </div>

                    {/* Coeficiente de Arrasto */}
                    <div className="border border-primary p-4 flex flex-col aspect-square justify-between group hover:bg-primary hover:text-white transition-all bg-white cursor-pointer duration-300">
                      <span className="text-[10px] font-bold text-secondary-grey group-hover:text-amber-200 tracking-wider">
                        SIM_02_ARRASTO
                      </span>
                      <div>
                        <div className="text-xl font-serif italic mb-1">Coeficiente de Arrasto</div>
                        <div className="text-xs font-mono text-secondary-grey group-hover:text-white/80">
                          Cd: {simulatedDrag} (Hidrodinâmico)
                        </div>
                      </div>
                    </div>

                    {/* Limite de Elasticidade */}
                    <div className="border border-primary p-4 flex flex-col aspect-square justify-between group hover:bg-primary hover:text-white transition-all bg-white cursor-pointer duration-300">
                      <span className="text-[10px] font-bold text-secondary-grey group-hover:text-amber-200 tracking-wider">
                        SIM_03_ELASTICIDADE
                      </span>
                      <div>
                        <div className="text-xl font-serif italic mb-1">Limite de Elasticidade</div>
                        <div className="text-xs font-mono text-secondary-grey group-hover:text-white/80">
                          Cisalhamento: {simulatedElasticity} GPa
                        </div>
                      </div>
                    </div>

                    {/* Inércia Térmica */}
                    <div className="border border-primary p-4 flex flex-col aspect-square justify-between group hover:bg-primary hover:text-white transition-all bg-white cursor-pointer duration-300">
                      <span className="text-[10px] font-bold text-secondary-grey group-hover:text-amber-200 tracking-wider">
                        SIM_04_INÉRCIA_TÉRMICA
                      </span>
                      <div>
                        <div className="text-xl font-serif italic mb-1">Inércia Térmica</div>
                        <div className="text-xs font-mono text-secondary-grey group-hover:text-white/80">
                          Delta-T: {simulatedThermalDelta} s/K
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* VIEW 2: TAXONOMIA (New Dedicated Page) */}
            {activeTab === "taxonomia" && (
              <motion.div
                key="taxonomy-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-6 md:p-12 flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-primary gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary-grey font-mono tracking-widest block uppercase">
                      Linhagem Científica do Acervo
                    </span>
                    <h1 className="font-serif text-3xl font-semibold mt-1">
                      Classificação Taxonômica das Formas
                    </h1>
                  </div>

                  <button
                    onClick={() => setSynthesizerOpen(true)}
                    className="flex items-center gap-1.5 border border-primary px-3.5 py-1.5 bg-primary text-white text-xs tracking-wider uppercase font-bold hover:bg-white hover:text-primary transition-all cursor-pointer h-9 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Sintetizar via IA
                  </button>
                </div>

                {/* Taxonomy Tree Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {sidebarGroupedSpecimens.map((group) => (
                    <div key={group.title} className="border border-primary/15 bg-white shadow-xs p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Group Header info */}
                        <div className="flex justify-between items-center border-b border-primary/10 pb-3 mb-5 font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-warning-amber text-sm">🌿</span>
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{group.title}</span>
                          </div>
                          <span className="bg-[#E5E1D8]/60 text-primary border border-primary/10 px-2 py-0.5 text-[10px] font-bold font-mono">
                            {group.specimens.length} {group.specimens.length === 1 ? "ESPÉCIME" : "ESPÉCIMES"}
                          </span>
                        </div>

                        {/* List of specimens grouped inside taxonomic category */}
                        <div className="space-y-4">
                          {group.specimens.map((spec) => (
                            <div 
                              key={spec.id} 
                              onClick={() => {
                                setActiveSpecimenId(spec.id);
                                setActiveTab("colecoes");
                              }}
                              className="group flex flex-col md:flex-row gap-4 p-4 border border-primary/10 hover:border-primary/25 bg-[#FAF9F6] hover:bg-white transition-all cursor-pointer shadow-2xs hover:shadow-sm"
                            >
                              {/* Left Mini Frame Image Thumbnail */}
                              <div className="w-20 h-20 bg-primary/5 border border-primary/10 overflow-hidden shrink-0">
                                <img
                                  src={spec.imagem_url}
                                  alt={spec.nome}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none select-none"
                                  referrerPolicy="no-referrer"
                                />
                              </div>

                              {/* Specimen taxonomic card descriptors */}
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start font-mono text-[8px] text-[#A69C83] mb-1">
                                    <span>CODE_{spec.id}</span>
                                    <span>{spec.metadados_tecnicos.escala}</span>
                                  </div>
                                  <h4 className="font-serif text-[15px] italic font-semibold text-primary truncate">
                                    {spec.nome}
                                  </h4>
                                  <p className="text-[10px] text-secondary-grey/90 line-clamp-1 font-sans mt-1">
                                    {spec.descricao_funcional}
                                  </p>
                                </div>
                                <div className="text-[9px] text-[#b45309] font-mono tracking-wider uppercase mt-2">
                                  Linhagem: {spec.lineage}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic Summary footer */}
                      <div className="mt-8 pt-4 border-t border-primary/10 font-mono text-[9px] text-secondary-grey/60 uppercase">
                        // SÍLICA POLIMERIZADA CRISTALINA REGISTRADA
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* VIEW 3: CRONOLOGIA (New Dedicated Page) */}
            {activeTab === "cronologia" && (
              <motion.div
                key="chronology-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-6 md:p-12 flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-primary gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary-grey font-mono tracking-widest block uppercase">
                      Linha do Tempo de Amostragem do Acervo
                    </span>
                    <h1 className="font-serif text-3xl font-semibold mt-1">
                      Registro Cronológico de Amostras
                    </h1>
                  </div>

                  <button
                    onClick={() => setSynthesizerOpen(true)}
                    className="flex items-center gap-1.5 border border-primary px-3.5 py-1.5 bg-primary text-white text-xs tracking-wider uppercase font-bold hover:bg-white hover:text-primary transition-all cursor-pointer h-9 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Sintetizar via IA
                  </button>
                </div>

                {/* Timeline axis wrapper */}
                <div className="relative border-l border-primary/20 pl-8 ml-4 space-y-12 py-4">
                  {specimens
                    .slice()
                    .sort((a, b) => {
                      const getYear = (s: Specimen) => {
                        const m = s.metadados_tecnicos.data_coleta?.match(/\d{4}/);
                        return m ? parseInt(m[0], 10) : 0;
                      };
                      return getYear(b) - getYear(a); // Descending (recent first)
                    })
                    .map((spec, index) => {
                      const dateStr = spec.metadados_tecnicos.data_coleta || "Sintético";
                      return (
                        <div key={spec.id} className="relative group select-text animate-fade-in">
                          {/* Timeline dot marker */}
                          <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-[#FAF9F6] border border-primary flex items-center justify-center font-mono text-[9px] font-bold text-primary shadow-xs transition-colors duration-150 group-hover:bg-warning-amber group-hover:text-primary z-10 select-none">
                            {index + 1}
                          </div>

                          {/* Dossier Card Box */}
                          <div className="border border-primary/10 bg-white p-6 md:p-8 hover:border-warning-amber/60 hover:shadow-md transition-all duration-300 relative select-all">
                            {/* Collection Date Badge */}
                            <div className="absolute top-4 right-4 bg-primary text-white text-[9px] font-mono font-semibold uppercase tracking-widest px-2.5 py-1 select-all">
                              📅 {dateStr.replace("_UTC", " UTC")}
                            </div>

                            <span className="text-[9px] font-mono block text-secondary-grey uppercase tracking-[0.25em] mb-1 select-all">
                              REGISTRO DE EXPEDIÇÃO HISTÓRICA // {spec.id}
                            </span>
                            <h3 className="font-serif italic text-2xl font-bold text-primary hover:text-warning-amber cursor-pointer transition-colors select-all" onClick={() => {
                              setActiveSpecimenId(spec.id);
                              setActiveTab("colecoes");
                            }}>
                              {spec.nome}
                            </h3>
                            <p className="text-secondary-grey/95 italic font-serif leading-relaxed text-sm mt-3 mb-6 max-w-4xl select-all">
                              &ldquo;{spec.descricao_funcional}&rdquo;
                            </p>

                            {/* Chronology Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-primary/5 pt-4 text-xs font-mono">
                              <div>
                                <span className="text-secondary-grey/80 block uppercase text-[8px] tracking-wider">Metadados Técnicos:</span>
                                <span className="text-primary font-bold">{spec.metadados_tecnicos.escala} // Opus</span>
                              </div>
                              <div>
                                <span className="text-secondary-grey/80 block uppercase text-[8px] tracking-wider">Local Coleta / Proveniência:</span>
                                <span className="text-warning-amber underline font-bold cursor-pointer hover:text-primary" onClick={() => {
                                  setActiveSpecimenId(spec.id);
                                  setActiveTab("proveniencia");
                                }}>{spec.metadados_tecnicos.proveniencia}</span>
                              </div>
                              <div>
                                <span className="text-secondary-grey/80 block uppercase text-[8px] tracking-wider">Pesquisador Responsável:</span>
                                <span className="text-primary font-bold italic">{spec.curadoria}</span>
                              </div>
                            </div>

                            {/* View complete button */}
                            <div className="mt-6 flex justify-end">
                              <button
                                onClick={() => {
                                  setActiveSpecimenId(spec.id);
                                  setActiveTab("colecoes");
                                }}
                                className="py-1.5 px-4 bg-primary/5 hover:bg-primary border border-primary/10 text-primary hover:text-white transition-colors duration-150 text-[10px] font-bold font-mono uppercase tracking-widest cursor-pointer"
                              >
                                Carregar na Gaveta de Curadoria &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* VIEW 4: PROVENIÊNCIA (New Dedicated Page) */}
            {activeTab === "proveniencia" && (
              <motion.div
                key="provenience-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-6 md:p-12 flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-primary gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary-grey font-mono tracking-widest block uppercase">
                      Arquivos Geodésicos de Amostragem Natural
                    </span>
                    <h1 className="font-serif text-3xl font-semibold mt-1">
                      Mapeamento Geográfico das Estações
                    </h1>
                  </div>

                  <button
                    onClick={() => setSynthesizerOpen(true)}
                    className="flex items-center gap-1.5 border border-primary px-3.5 py-1.5 bg-primary text-white text-xs tracking-wider uppercase font-bold hover:bg-white hover:text-primary transition-all cursor-pointer h-9 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Sintetizar via IA
                  </button>
                </div>

                {/* CARTOGRAPHY GRID COORDINATES MONITOR - Coordinates map */}
                <div className="relative w-full h-[280px] border border-primary/15 bg-primary/[0.02] overflow-hidden select-none font-mono text-[9px] text-[#A69C83] mb-8 shadow-inner flex flex-col justify-between p-2.5 animate-fade-in">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                  {/* Latitude Reference Lines */}
                  <div className="absolute inset-x-0 top-[20%] border-t border-primary/5 border-dashed pointer-events-none flex justify-between px-3">
                    <span>45°N</span>
                    <span className="opacity-45">SETOR_NORTE_PACÍFICO</span>
                  </div>
                  <div className="absolute inset-x-0 top-1/2 border-t border-primary/10 border-solid pointer-events-none flex justify-between px-3">
                    <span className="font-bold text-primary/30 text-[8px] tracking-wider">EQUADOR METADATA (0°)</span>
                    <span className="font-bold text-primary/30 text-[8px] tracking-wider">MARCO DE REFERÊNCIA HORIZON</span>
                  </div>
                  <div className="absolute inset-x-0 top-[80%] border-t border-primary/5 border-dashed pointer-events-none flex justify-between px-3">
                    <span>60°S</span>
                    <span className="opacity-45">CRIOSFERA_SUL_CULO</span>
                  </div>

                  {/* Longitude Reference Lines */}
                  <div className="absolute inset-y-0 left-1/4 border-l border-primary/5 border-dashed pointer-events-none flex items-end p-2.5">
                    <span>90°W</span>
                  </div>
                  <div className="absolute inset-y-0 left-1/2 border-l border-primary/10 border-dashed pointer-events-none flex items-end p-2.5 text-primary/20">
                    <span>0° (MERIDIANO DE GREENWICH)</span>
                  </div>
                  <div className="absolute inset-y-0 left-[85%] border-l border-primary/5 border-dashed pointer-events-none flex items-end p-2.5">
                    <span>120°E</span>
                  </div>

                  {/* Geological oceanic labels to mimic a proper bathymetric science HUD */}
                  <div className="absolute top-[28%] left-[12%] text-primary/10 uppercase text-[8px] font-bold tracking-[0.25em] pointer-events-none">
                    Oceano Atlântico Norte
                  </div>
                  <div className="absolute top-[68%] left-[22%] text-primary/10 uppercase text-[8px] font-bold tracking-[0.25em] pointer-events-none">
                    Atlântico Sul Equatorial
                  </div>
                  <div className="absolute top-[32%] left-[62%] text-primary/15 uppercase text-[8px] font-bold tracking-[0.25em] pointer-events-none">
                    Bacia do Oceano Índico
                  </div>
                  <div className="absolute top-[40%] left-[84%] text-primary/25 uppercase text-[8px] font-bold tracking-[0.2em] pointer-events-none">
                    Mar de Filipinas
                  </div>
                  <div className="absolute top-[88%] left-[83%] text-primary/25 uppercase text-[8px] font-bold tracking-[0.2em] pointer-events-none text-right">
                    Mar de Ross / Antártica
                  </div>

                  {/* Hotspots plotted from specimens list */}
                  {specimensByLocation.map((loc) => {
                    const isSelected = selectedLocationId === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocationId(prev => prev === loc.id ? "all" : loc.id)}
                        style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer transition-all focus:outline-none"
                        title={`Filtrar por: ${loc.nome}`}
                      >
                        <div className="relative flex items-center justify-center">
                          {/* Pulse beacon animation background */}
                          <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 ${
                            isSelected ? "animate-ping bg-warning-amber/40" : "group-hover:animate-ping bg-primary/10"
                          }`} />
                          {/* Central pin core */}
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-150 ${
                            isSelected
                              ? "bg-warning-amber border-primary scale-115 shadow-md"
                              : "bg-[#F9F7F2] border-primary/40 group-hover:bg-primary group-hover:scale-105"
                          }`} />
                          
                          {/* Location Micro Tag */}
                          <div className={`absolute top-5 left-1/2 -translate-x-1/2 bg-[#F9F7F2] border border-primary/15 px-2 py-0.5 text-[8px] font-bold whitespace-nowrap uppercase tracking-wider shadow-md transition-all pointer-events-none ${
                            isSelected 
                              ? "opacity-100 translate-y-0 text-primary scale-100 z-30 ring-1 ring-warning-amber/20" 
                              : "opacity-60 -translate-y-1 scale-95 group-hover:opacity-100 group-hover:translate-y-0 text-secondary-grey"
                          }`}>
                            <span className="font-serif italic font-medium">{loc.nome.split(" (")[0]}</span>
                            <span className="font-mono text-warning-amber ml-1">({loc.specimens.length})</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Legend at coordinate footer */}
                  <div className="flex justify-between items-center w-full mt-auto z-10 pointer-events-none">
                    <span className="text-[8px] text-secondary-grey/60 uppercase tracking-[0.15em]">// MAPA DETALHADO DE REGISTRO GEOGRÁFICO DE AMOSTRAGENS NATURAIS</span>
                    <span className="text-[8px] text-primary/40 font-mono tracking-widest uppercase">LAT_GRID LO_GRID v4.1</span>
                  </div>
                </div>

                {/* Filter reset notification if active */}
                {selectedLocationId !== "all" && (
                  <div className="flex justify-between items-center bg-warning-amber/5 border border-warning-amber/25 px-4 py-3 text-xs mb-8 animate-fade-in font-mono">
                    <div className="flex items-center gap-2 text-primary/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-amber animate-ping shrink-0" />
                      <span>
                        Exibindo apenas achados de: <strong className="text-primary italic">{(specimensByLocation.find(l => l.id === selectedLocationId)?.nome) || "Expedições Simuladas"}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedLocationId("all")}
                      className="text-[10px] font-bold uppercase tracking-widest underline text-primary hover:text-warning-amber cursor-pointer"
                    >
                      [ Ver Todos os Locais ]
                    </button>
                  </div>
                )}

                {/* Sampling Station Dossiers list */}
                <div className="space-y-10">
                  {specimensByLocation
                    .filter(loc => selectedLocationId === "all" || loc.id === selectedLocationId)
                    .map((loc) => (
                      <div 
                        key={loc.id} 
                        className={`border transition-all duration-300 p-6 md:p-8 bg-[#FAF9F6] shadow-sm relative ${
                          selectedLocationId === loc.id ? "border-warning-amber/60 ring-1 ring-warning-amber/20" : "border-primary/10"
                        }`}
                      >
                        {/* Dossier watermark */}
                        <div className="absolute top-2 right-4 text-[42px] font-black font-mono text-primary/[0.02] tracking-tighter select-none pointer-events-none">
                          LOC-{loc.id.substring(0, 3).toUpperCase()}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 pb-4 mb-4 select-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/5 border border-primary/10 flex items-center justify-center font-bold text-primary font-mono text-xs select-none shrink-0">
                              {loc.id.substring(0, 3).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-base font-sans font-bold text-primary uppercase tracking-wide">
                                {loc.nome}
                              </h3>
                              <div className="text-[10px] text-[#A69C83] font-mono tracking-wider mt-0.5">
                                COORDENADAS FIXAS: {loc.coordenadas}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-[9px] font-mono shrink-0">
                            <span className="bg-[#E5E1D8]/25 border border-primary/10 px-2 py-0.5 font-semibold text-primary/80">PROFUNDIDADE: {loc.profundidade}</span>
                            <span className="bg-[#E5E1D8]/25 border border-primary/10 px-2 py-0.5 font-semibold text-primary/80">TEMP: {loc.temperatura}</span>
                            <span className="bg-[#E5E1D8]/25 border border-primary/10 px-2 py-0.5 font-semibold text-[#c2410c]">PRESSÃO_FÍSICA: {loc.pressao}</span>
                          </div>
                        </div>

                        <p className="text-secondary-grey/90 text-xs leading-relaxed font-sans max-w-4xl mb-6 italic select-all">
                          &ldquo;{loc.bioma}&rdquo;
                        </p>

                        <h4 className="text-[10px] font-bold text-secondary-grey font-mono tracking-wider uppercase mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning-amber animate-pulse shrink-0" />
                          Achados Naturais Catalogados nesta Estação ({loc.specimens.length})
                        </h4>

                        {/* Subgrid of specimens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {loc.specimens.map((spec) => (
                            <div 
                              key={spec.id} 
                              className="border border-primary/10 hover:border-primary/25 bg-white transition-all p-4.5 flex flex-col justify-between group shadow-xs hover:shadow-md duration-200"
                            >
                              <div>
                                <div className="flex justify-between items-start mb-3 font-mono text-[9px]">
                                  <span className="font-bold text-secondary-grey tracking-wider select-all">// CODE_{spec.id}</span>
                                  <span className="px-1.5 py-0.5 bg-warning-amber/10 border border-warning-amber/20 text-warning-amber font-semibold select-all">
                                    {spec.metadados_tecnicos.escala}
                                  </span>
                                </div>

                                <div className="h-32 w-full bg-primary/5 border border-primary/10 overflow-hidden mb-3 relative">
                                  <img
                                    src={spec.imagem_url}
                                    alt={spec.nome}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none select-none"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                                </div>

                                <h5 className="font-serif text-[15px] italic font-semibold text-primary truncate select-all">
                                  {spec.nome}
                                </h5>
                                <p className="text-[10px] text-[#A69C83] font-mono tracking-wide truncate mb-3 uppercase select-all">
                                  {spec.lineage.replace("FILO: ", "").split(" | ")[0]} | {spec.lineage.split("CLASSE: ")[1] || spec.lineage.split(" | ")[1] || "BACILLARIOPHYCEAE"}
                                </p>

                                <div className="space-y-1.5 border-t border-primary/5 pt-3 mb-5 text-[10px] font-mono text-secondary-grey/90 leading-relaxed select-all">
                                  <div className="truncate">
                                    <strong className="text-primary/75 font-bold uppercase tracking-wider text-[8px]">RAMIFICAÇÃO:</strong> {spec.logica_ramificacao}
                                  </div>
                                  <div className="truncate">
                                    <strong className="text-primary/75 font-bold uppercase tracking-wider text-[8px]">COMPOSIÇÃO:</strong> {spec.composicao_material}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setActiveSpecimenId(spec.id);
                                  setActiveTab("colecoes");
                                }}
                                className="w-full py-2 bg-primary/5 hover:bg-primary border border-primary/10 text-primary hover:text-white text-[10px] font-bold uppercase tracking-widest font-mono transition-colors duration-150 text-center cursor-pointer"
                              >
                                Carregar no Simulador Físico &rarr;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* VIEW 3: MICROSCOPY & PHYSICAL FORCE SIMULATOR (Microscopia) */}
            {activeTab === "microscopia" && (
              <motion.div
                key="microscopia-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="p-6 md:p-12 flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-primary gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary-grey font-mono tracking-widest block uppercase">
                      Simulação Científica Virtual
                    </span>
                    <h1 className="font-serif text-3xl font-semibold mt-1">
                      Dinâmica de Estresse &amp; Morfo-Simulador
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-secondary-grey text-xs">Exibindo física de:</span>
                    <span className="font-serif italic font-semibold border border-primary bg-white px-2 py-1 text-xs select-all">
                      {activeSpecimen.nome}
                    </span>
                  </div>
                </div>

                {/* Physics Playground Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 border border-primary bg-white divide-y lg:divide-y-0 lg:divide-x divide-primary">
                  
                  {/* Visualizer viewport canvas drawer */}
                  <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between bg-zinc-950 text-white relative min-h-[450px]">
                    
                    <div className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-gray-500 uppercase flex flex-col">
                      <span>MÓDULO DE MODELAGEM FÍSICA v4.2</span>
                      <span>STATUS: {isPressureCritical || isTempCritical ? "CRÍTICO / ALERTA" : "ESTÁVEL"}</span>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/10 px-2 py-1 text-[9px] font-mono border border-white/20 select-all">
                      LAT_SCAN: {activeSpecimen.coordenadas_fisicas}
                    </div>

                    {/* Procedural Animated Vector Render representing the Specimen */}
                    <div className="flex-1 flex items-center justify-center my-6">
                      <div className="relative w-72 h-72 flex items-center justify-center">
                        
                        {/* Simulation physical overlays depending on sliders state */}
                        {isPressureCritical && (
                          <motion.div 
                            animate={{ opacity: [0.1, 0.4, 0.1] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 border border-red-500 bg-red-500/10 pointer-events-none"
                          />
                        )}

                        {simulationTemp > 30 && (
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.25, 0.1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-orange-500/15 pointer-events-none"
                          />
                        )}

                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          {/* Inner grid technical circle background */}
                          <circle cx="100" cy="100" r="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
                          <circle cx="100" cy="100" r="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 3" fill="none" />
                          
                          {/* Linear axes */}
                          <line x1="20" y1="100" x2="180" y2="100" stroke="#1e293b" strokeWidth="0.5" />
                          <line x1="100" y1="20" x2="100" y2="180" stroke="#1e293b" strokeWidth="0.5" />

                          {/* Dynamic Procedural geometry that changes shape on user parameters */}
                          <motion.g
                            animate={{
                              rotate: ["EUP_002", "FOL_003", "BAS_004", "GEO_005", "VAS_006", "RIO_007"].includes(activeSpecimen.id) ? 0 : [0, 360],
                              scale: isPressureCritical ? [0.96, 1.04, 0.96] : [0.99, 1.01, 0.99]
                            }}
                            transition={{
                              rotate: {
                                repeat: Infinity,
                                duration: Math.max(12 - simulationTemp * 0.15, 2), // Spreads or rotates faster at higher temperatures
                                ease: "linear"
                              },
                              scale: {
                                repeat: Infinity,
                                duration: isPressureCritical ? 0.3 : 4, // Vibrates intensely under high hydrostatic stress
                                ease: "easeInOut"
                              }
                            }}
                          >
                            {/* Adaptive Geometry rendering depending on Specimen ID */}
                            {activeSpecimen.id === "NAU_001" ? (
                              /* Nautilus pompilius - Golden Logarithmic Fibonacci Spiral */
                              <g>
                                {Array.from({ length: 28 }).map((_, i) => {
                                  // Logarithmic growth of radius
                                  const theta = (i * 18 * Math.PI) / 180;
                                  const r = 4 * Math.pow(1.14, i);
                                  const cx = 100 + r * Math.cos(theta);
                                  const cy = 100 + r * Math.sin(theta);
                                  
                                  const nextTheta = ((i + 1) * 18 * Math.PI) / 180;
                                  const nextR = 4 * Math.pow(1.14, i + 1);
                                  const nX = 100 + nextR * Math.cos(nextTheta);
                                  const nY = 100 + nextR * Math.sin(nextTheta);

                                  return (
                                    <g key={i}>
                                      <line
                                        x1="100"
                                        y1="100"
                                        x2={cx}
                                        y2={cy}
                                        stroke={isPressureCritical ? "#ef4444" : "#ffffff"}
                                        strokeWidth="0.5"
                                        strokeOpacity="0.15"
                                      />
                                      <path
                                        d={`M ${cx} ${cy} A ${r} ${r} 0 0 1 ${nX} ${nY}`}
                                        fill="none"
                                        stroke={isPressureCritical ? "#f87171" : "#f59e0b"}
                                        strokeWidth={0.5 + i * 0.08}
                                        strokeOpacity="0.85"
                                      />
                                      {i % 4 === 0 && (
                                        <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
                                      )}
                                    </g>
                                  );
                                })}
                              </g>
                            ) : activeSpecimen.id === "EUP_002" ? (
                              /* Euplectella aspergillum - Macro Glass Sponge Orthodiagonal Trellis Cage */
                              <g>
                                {/* Cylindrical horizontal rings */}
                                {[50, 70, 90, 110, 130, 150].map((cyVal) => (
                                  <ellipse
                                    key={cyVal}
                                    cx="100"
                                    cy={cyVal}
                                    rx="50"
                                    ry="12"
                                    fill="none"
                                    stroke={isPressureCritical ? "#ef4444" : "#ffffff"}
                                    strokeWidth="1.5"
                                    strokeOpacity="0.8"
                                  />
                                ))}
                                {/* Vertical struts matching cylindrical shape */}
                                {[-45, -30, -15, 0, 15, 30, 45].map((xOffset) => {
                                  // Compute dynamic x along the elipse boundaries
                                  const rx = 50;
                                  const angle = (xOffset * Math.PI) / 90;
                                  const xVal = 100 + rx * Math.sin(angle);
                                  return (
                                    <line
                                      key={xOffset}
                                      x1={xVal}
                                      y1="40"
                                      x2={xVal}
                                      y2="160"
                                      stroke={isPressureCritical ? "#f87171" : "#7dd3fc"}
                                      strokeWidth="1"
                                      strokeOpacity="0.75"
                                    />
                                  );
                                })}
                                {/* Diagonal bracing overlays across the matrix mesh */}
                                {[-40, -20, 0, 20, 40].map((dx) => 
                                  [-50, -30, -10, 10, 30, 50].map((dy) => (
                                    <g key={`${dx}-${dy}`}>
                                      <line
                                        x1={100 + dx}
                                        y1={100 + dy}
                                        x2={120 + dx}
                                        y2={120 + dy}
                                        stroke="#fbbf24"
                                        strokeWidth="0.5"
                                        strokeOpacity="0.4"
                                      />
                                      <line
                                        x1={120 + dx}
                                        y1={100 + dy}
                                        x2={100 + dx}
                                        y2={120 + dy}
                                        stroke="#fbbf24"
                                        strokeWidth="0.5"
                                        strokeOpacity="0.4"
                                      />
                                    </g>
                                  ))
                                )}
                              </g>
                            ) : activeSpecimen.id === "TRI_091" ? (
                              /* Trigonium arcticum - Triangular Honeycomb Diatom Wall */
                              <g>
                                <polygon
                                  points="100,25 175,155 25,155"
                                  fill="none"
                                  stroke={isPressureCritical ? "#ef4444" : "#f59e0b"}
                                  strokeWidth="2.5"
                                />
                                <polygon
                                  points="100,50 152,142 48,142"
                                  fill="none"
                                  stroke="#ffffff"
                                  strokeWidth="1"
                                  strokeDasharray="3 3"
                                />
                                {Array.from({ length: 8 }).map((_, rIdx) => {
                                  const stepY = 32 + rIdx * 15;
                                  const count = rIdx + 1;
                                  const startX = 100 - (rIdx * 10);
                                  return Array.from({ length: count }).map((_, cIdx) => {
                                    const px = startX + cIdx * 20;
                                    const py = stepY + 12;
                                    return (
                                      <g key={`${rIdx}-${cIdx}`}>
                                        <polygon
                                          points={`${px},${py - 5} ${px + 4},${py - 2} ${px + 4},${py + 2} ${px},${py + 5} ${px - 4},${py + 2} ${px - 4},${py - 2}`}
                                          fill="none"
                                          stroke="#4b5563"
                                          strokeWidth="0.5"
                                        />
                                        <circle cx={px} cy={py} r="1" fill="#38bdf8" />
                                      </g>
                                    );
                                  });
                                })}
                              </g>
                            ) : activeSpecimen.id === "LIT_118" ? (
                              /* Lithomespilus coronatus - Concentric Spheres & Apical Crown */
                              <g>
                                {/* Nassellaria Crown of Spikes */}
                                {[70, 85, 100, 115, 130].map((xOff) => {
                                  const h = xOff === 100 ? 32 : 16;
                                  return (
                                    <line
                                      key={xOff}
                                      x1={xOff}
                                      y1="70"
                                      x2={xOff === 100 ? 100 : xOff}
                                      y2={70 - h}
                                      stroke={isPressureCritical ? "#ef4444" : "#ffffff"}
                                      strokeWidth={xOff === 100 ? "2" : "1"}
                                    />
                                  );
                                })}
                                {/* Ellipses matrices */}
                                <ellipse cx="100" cy="115" rx="55" ry="45" fill="none" stroke={isPressureCritical ? "#ef4444" : "#ffffff"} strokeWidth="1.5" />
                                <ellipse cx="100" cy="115" rx="40" ry="32" fill="none" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3 3" />
                                <ellipse cx="100" cy="115" rx="25" ry="20" fill="none" stroke="#f59e0b" strokeWidth="1" />
                                {/* Spoke rays */}
                                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((ang) => {
                                  const radAngle = (ang * Math.PI) / 180;
                                  const ex = 100 + 55 * Math.cos(radAngle);
                                  const ey = 115 + 45 * Math.sin(radAngle);
                                  return (
                                    <g key={ang}>
                                      <line x1="100" y1="115" x2={ex} y2={ey} stroke="#475569" strokeWidth="0.5" />
                                      <circle cx={ex} cy={ey} r="2" fill="#ffffff" />
                                    </g>
                                  );
                                })}
                              </g>
                            ) : activeSpecimen.id === "FOL_003" ? (
                              /* Acer palmatum - Leaf Venation Network Pattern */
                              <g>
                                <line x1="100" y1="35" x2="100" y2="165" stroke={isPressureCritical ? "#ef4444" : "#a1a1aa"} strokeWidth="2.5" />
                                {Array.from({ length: 6 }).map((_, idx) => {
                                  const yPos = 50 + idx * 20;
                                  const stemLen = 40 + (simulationSalinity - 35) * 1.5;
                                  return (
                                    <g key={idx}>
                                      {/* Left main branch */}
                                      <line x1="100" y1={yPos} x2={100 - stemLen} y2={yPos - 15} stroke={isPressureCritical ? "#ef4444" : "#84cc16"} strokeWidth="1.5" />
                                      {/* Right main branch */}
                                      <line x1="100" y1={yPos} x2={100 + stemLen} y2={yPos - 15} stroke={isPressureCritical ? "#ef4444" : "#84cc16"} strokeWidth="1.5" />
                                      {/* Left sub-bifurcations (micro venations) */}
                                      <line x1={100 - stemLen * 0.5} y1={yPos - 7.5} x2={100 - stemLen * 0.5 - 10} y2={yPos - 18} stroke="#4ade80" strokeWidth="0.75" />
                                      <line x1={100 + stemLen * 0.5} y1={yPos - 7.5} x2={100 + stemLen * 0.5 + 10} y2={yPos - 18} stroke="#4ade80" strokeWidth="0.75" />
                                    </g>
                                  );
                                })}
                              </g>
                            ) : activeSpecimen.id === "BAS_004" ? (
                              /* Basalto Vulcânico Colunar - Hexagonal Giant Columnar Basalt */
                              <g>
                                {/* Column 1 Center (x: 100, y: 100) */}
                                <polygon points="100,60 135,80 135,140 100,160 65,140 65,80" fill="none" stroke={isPressureCritical ? "#ef4444" : "#3b82f6"} strokeWidth="2" />
                                <line x1="100" y1="60" x2="100" y2="160" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="2 3" />
                                {/* Column 2 Left (shifted) */}
                                <polygon points="65,85 100,105 100,165 65,185 30,165 30,105" fill="none" stroke={isPressureCritical ? "#ef4444" : "#60a5fa"} strokeWidth="1" strokeOpacity="0.7" />
                                {/* Column 3 Right (shifted) */}
                                <polygon points="135,85 170,105 170,165 135,185 100,165 100,105" fill="none" stroke={isPressureCritical ? "#ef4444" : "#60a5fa"} strokeWidth="1" strokeOpacity="0.7" />
                                {/* Volcanic joints nodes */}
                                <circle cx="100" cy="60" r="3" fill="#ffffff" />
                                <circle cx="135" cy="80" r="3" fill="#ffffff" />
                                <circle cx="65" cy="80" r="3" fill="#ffffff" />
                              </g>
                            ) : activeSpecimen.id === "GEO_005" ? (
                              /* Geodo de Ametista - Quartz Crystals Growth Cavity */
                              <g>
                                <ellipse cx="100" cy="100" rx="70" ry="55" fill="none" stroke="#475569" strokeWidth="3" />
                                <ellipse cx="100" cy="100" rx="60" ry="47" fill="none" stroke="#7c3aed" strokeWidth="1.5" />
                                <ellipse cx="100" cy="100" rx="50" ry="39" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 3" />
                                
                                {Array.from({ length: 16 }).map((_, idx) => {
                                  const angle = (idx * 22.5 * Math.PI) / 180;
                                  const rx1 = 50;
                                  const ry1 = 39;
                                  // variable crystal depth based on temperature slider
                                  const rx2 = 25 - (simulationTemp - 20) * 0.4;
                                  const ry2 = 18 - (simulationTemp - 20) * 0.3;
                                  
                                  const x1 = 100 + rx1 * Math.cos(angle);
                                  const y1 = 100 + ry1 * Math.sin(angle);
                                  const x2 = 100 + rx2 * Math.cos(angle);
                                  const y2 = 100 + ry2 * Math.sin(angle);
                                  
                                  const xFlank1 = 100 + (rx1 - 5) * Math.cos(angle - 0.1);
                                  const yFlank1 = 100 + (ry1 - 5) * Math.sin(angle - 0.1);
                                  const xFlank2 = 100 + (rx1 - 5) * Math.cos(angle + 0.1);
                                  const yFlank2 = 100 + (ry1 - 5) * Math.sin(angle + 0.1);

                                  return (
                                    <g key={idx}>
                                      <polygon
                                        points={`${x2},${y2} ${xFlank1},${yFlank1} ${xFlank2},${yFlank2}`}
                                        fill="none"
                                        stroke={isPressureCritical ? "#ef4444" : "#c084fc"}
                                        strokeWidth="1"
                                        strokeOpacity="0.85"
                                      />
                                      <circle cx={x2} cy={y2} r="1.5" fill="#e9d5ff" />
                                    </g>
                                  );
                                })}
                              </g>
                            ) : activeSpecimen.id === "VAS_006" ? (
                              /* Rede Vascular / Sistema Circulatório - Organic Heart Arterial/Venous Tree */
                              <g>
                                <line x1="95" y1="35" x2="95" y2="165" stroke="#dc2626" strokeWidth="2.5" />
                                <line x1="105" y1="35" x2="105" y2="165" stroke="#2563eb" strokeWidth="2" />
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const yArtery = 45 + i * 25;
                                  const spread = 35 + (simulationSalinity - 35) * 1.2;
                                  return (
                                    <g key={i}>
                                      {/* Left arterial branch */}
                                      <path d={`M 95 ${yArtery} Q 60 ${yArtery - 10} ${95 - spread} ${yArtery - 25}`} fill="none" stroke="#f87171" strokeWidth="1.2" />
                                      {/* Left capillary */}
                                      <line x1={95 - spread} y1={yArtery - 25} x2={95 - spread - 12} y2={yArtery - 32} stroke="#fca5a5" strokeWidth="0.6" />
                                      <line x1={95 - spread} y1={yArtery - 25} x2={95 - spread - 6} y2={yArtery - 18} stroke="#fca5a5" strokeWidth="0.6" />

                                      {/* Right venous branch */}
                                      <path d={`M 105 ${yArtery + 10} Q 140 ${yArtery + 20} ${105 + spread} ${yArtery + 5}`} fill="none" stroke="#60a5fa" strokeWidth="1.0" />
                                      {/* Right capillary */}
                                      <line x1={105 + spread} y1={yArtery + 5} x2={105 + spread + 10} y2={yArtery - 2} stroke="#93c5fd" strokeWidth="0.5" />
                                      <line x1={105 + spread} y1={yArtery + 5} x2={105 + spread + 8} y2={yArtery + 15} stroke="#93c5fd" strokeWidth="0.5" />
                                    </g>
                                  );
                                })}
                              </g>
                            ) : activeSpecimen.id === "RIO_007" ? (
                              /* Delta do Rio Ganges - Dendritic Drainage Channel River Paths */
                              <g>
                                <path d="M 100,25 Q 98,40 102,60" fill="none" stroke="#0284c7" strokeWidth="4" />
                                <path d="M 102,60 Q 75,85 55,110" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                                <path d="M 102,60 Q 125,85 145,110" fill="none" stroke="#0284c7" strokeWidth="2.5" />
                                
                                <path d="M 55,110 Q 35,130 25,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                                <path d="M 55,110 Q 65,130 75,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                                
                                <path d="M 145,110 Q 125,130 115,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                                <path d="M 145,110 Q 165,130 175,160" fill="none" stroke="#38bdf8" strokeWidth="1.5" />

                                <path d="M 20,160 Q 100,180 180,160" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />

                                <circle cx="25" cy="160" r="1.5" fill="#eab308" />
                                <circle cx="75" cy="160" r="1.5" fill="#eab308" />
                                <circle cx="115" cy="160" r="1.5" fill="#eab308" />
                                <circle cx="175" cy="160" r="1.5" fill="#eab308" />
                              </g>
                            ) : (
                              /* Hexancastra sp. - Default Hexagonal Branches */
                              <g>
                                {/* Specimen central core capsule body */}
                                <circle
                                  cx="100"
                                  cy="100"
                                  r={Math.min(18 + (simulationSalinity - 30) * 0.5, 30)}
                                  fill="none"
                                  stroke={isPressureCritical ? "#ef4444" : "#fbf8ff"}
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="8"
                                  fill={isPressureCritical ? "#ef4444" : "#b45309"}
                                  stroke="#ffffff"
                                  strokeWidth="1"
                                />

                                {/* Hexagonal / Radial skeletal branches protruding outward */}
                                {[0, 60, 120, 180, 240, 300].map((angle) => {
                                  const rad = (angle * Math.PI) / 180;
                                  // Scale branches slightly based on pressure
                                  const stemLength = Math.max(65 - (simulationPressure / 15), 35);
                                  const targetX = 100 + stemLength * Math.cos(rad);
                                  const targetY = 100 + stemLength * Math.sin(rad);

                                  // Branching geometry logic matching Hexancastra bifurcation
                                  const forkAngle1 = rad - Math.PI / 6;
                                  const forkAngle2 = rad + Math.PI / 6;
                                  const forkLength = 15;
                                  const fx1 = targetX + forkLength * Math.cos(forkAngle1);
                                  const fy1 = targetY + forkLength * Math.sin(forkAngle1);
                                  const fx2 = targetX + forkLength * Math.cos(forkAngle2);
                                  const fy2 = targetY + forkLength * Math.sin(forkAngle2);

                                  return (
                                    <g key={angle}>
                                      {/* Principal radial spear rod */}
                                      <line
                                        x1="100"
                                        y1="100"
                                        x2={targetX}
                                        y2={targetY}
                                        stroke={isPressureCritical ? "#ef4444" : "#ffffff"}
                                        strokeWidth="1.5"
                                      />
                                      {/* Secondary bifurcation spikes */}
                                      <line
                                        x1={targetX}
                                        y1={targetY}
                                        x2={fx1}
                                        y2={fy1}
                                        stroke={isPressureCritical ? "#f87171" : "#e2e2e6"}
                                        strokeWidth="1"
                                      />
                                      <line
                                        x1={targetX}
                                        y1={targetY}
                                        x2={fx2}
                                        y2={fy2}
                                        stroke={isPressureCritical ? "#f87171" : "#e2e2e6"}
                                        strokeWidth="1"
                                      />

                                      {/* Anchoring geometric micro nodes representing silica mineralization density */}
                                      <circle cx={targetX} cy={targetY} r="3" fill={isPressureCritical ? "#ef4444" : "#7c7ad6"} />
                                      <circle cx={fx1} cy={fy1} r="2" fill="#ffffff" />
                                      <circle cx={fx2} cy={fy2} r="2" fill="#ffffff" />
                                    </g>
                                  );
                                })}
                              </g>
                            )}
                          </motion.g>
                        </svg>

                        {/* Critical parameters indicator displays on canvas */}
                        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-gray-400">
                          <div>ESTRUTURA MATERIAL: {activeSpecimen.composicao_material.split(" com ")[0].toUpperCase()}</div>
                          <div>
                            MODO_ANIMAÇÃO: {
                              activeSpecimen.id === "NAU_001" ? "ESPIRAL LOGARÍTMICA RE-REGULADA" :
                              activeSpecimen.id === "EUP_002" ? "TRELIÇA ORTOGONAL DIAGONAL ESTÁTICA" :
                              activeSpecimen.id === "TRI_091" ? "SIMETRIA TRI-RADIAL TRICERATIALES" :
                              activeSpecimen.id === "LIT_118" ? "ELIPSÓIDES CONCÊNTRICOS NASELLARIA" :
                              activeSpecimen.id === "FOL_003" ? "DISTRIBUIÇÃO CAPILAR DE MURRAY" :
                              activeSpecimen.id === "BAS_004" ? "CONTRAÇÃO TERMOCINÉTICA VOLCÂNICA" :
                              activeSpecimen.id === "GEO_005" ? "CRESCIMENTO ORTOTRÓPICO CRISTALINO" :
                              activeSpecimen.id === "VAS_006" ? "FRACTAL DE FLUXO LAMINAR CARDIOVASCULAR" :
                              activeSpecimen.id === "RIO_007" ? "AUTO-ORGANIZAÇÃO DE GRADIENTE HIDRÁULICO" :
                              "SISTEMA RADIAL DE BIFURCAÇÃO"
                            }
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ESPÉCIME ATIVO</div>
                        <div className="font-serif italic text-lg">{activeSpecimen.nome}</div>
                      </div>
                      <span className="text-metadata-sm text-gray-400 select-all">
                        {activeSpecimen.res_scan}
                      </span>
                    </div>

                  </div>

                  {/* Physics controllers sliders drawer panel */}
                  <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-surface-alt">
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[10px] font-bold text-secondary-grey/95 uppercase tracking-[0.25em] mb-2 font-mono">
                          MÓBILO DE MEIO AMBIENTE
                        </h3>
                        <p className="text-xs text-secondary-grey/85 leading-relaxed">
                          Ajuste as condições físicas circundantes para recalcular a tolerância estrutural do espécime biológico selecionado (micro ou macroscópico).
                        </p>
                      </div>

                      {/* SLA 1: Pressure */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider font-mono text-[10px] text-primary/80">Pressão Hidrostática</span>
                          <span className={`${isPressureCritical ? "text-[#C2410C] font-bold" : "text-primary"} font-mono`}>
                            {simulationPressure} ATM
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="1000"
                          value={simulationPressure}
                          onChange={(e) => setSimulationPressure(Number(e.target.value))}
                          className="w-full accent-primary h-1 bg-primary/10 appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-secondary-grey/80 uppercase font-mono">
                          <span>1 atm (superfície)</span>
                          <span>1000 atm (abissal)</span>
                        </div>
                      </div>

                      {/* SLA 2: Temperature */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider font-mono text-[10px] text-primary/80">Temperatura da Água</span>
                          <span className={`${isTempCritical ? "text-warning-amber font-bold" : "text-primary"} font-mono`}>
                            {simulationTemp.toFixed(1)} °C
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-2"
                          max="45"
                          step="0.5"
                          value={simulationTemp}
                          onChange={(e) => setSimulationTemp(Number(e.target.value))}
                          className="w-full accent-primary h-1 bg-primary/10 appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-secondary-grey/80 uppercase font-mono">
                          <span>-2.0 °C (polar)</span>
                          <span>45.0 °C (ventilar)</span>
                        </div>
                      </div>

                      {/* SLA 3: Salinity */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider font-mono text-[10px] text-primary/80">Salinidade Local</span>
                          <span className="font-mono">{simulationSalinity.toFixed(1)} PSU</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="45"
                          step="0.1"
                          value={simulationSalinity}
                          onChange={(e) => setSimulationSalinity(Number(e.target.value))}
                          className="w-full accent-primary h-1 bg-primary/10 appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-secondary-grey/80 uppercase font-mono">
                          <span>20 PSU (salobro)</span>
                          <span>45 PSU (hiper-salino)</span>
                        </div>
                      </div>

                    </div>

                    {/* Calculated Indicators readouts block */}
                    <div className="pt-6 border-t border-primary/20 mt-8">
                      <span className="text-[9px] font-bold text-secondary-grey/90 tracking-[0.25em] block uppercase mb-4 font-mono">
                        INDICADORES RE-CALCULADOS EM TEMPO REAL
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        
                        <div className="p-3.5 border border-primary/15 bg-[#FAF9F6] transition-all">
                          <div className="text-[8px] font-bold text-secondary-grey/80 tracking-[0.2em] uppercase mb-1 font-mono">
                            ESTRESSE DA REDE
                          </div>
                          <div className={`font-mono text-sm font-bold ${isPressureCritical ? "text-[#C2410C] font-extrabold animate-pulse" : "text-primary"}`}>
                            {simulatedTension} N/mm²
                          </div>
                        </div>

                        <div className="p-3.5 border border-primary/15 bg-[#FAF9F6] transition-all">
                          <div className="text-[8px] font-bold text-secondary-grey/80 tracking-[0.2em] uppercase mb-1 font-mono">
                            COEF_ARRASTO
                          </div>
                          <div className="font-mono text-sm font-bold text-primary">
                            {simulatedDrag}
                          </div>
                        </div>

                        <div className="p-3.5 border border-primary/15 bg-[#FAF9F6] transition-all">
                          <div className="text-[8px] font-bold text-secondary-grey/80 tracking-[0.2em] uppercase mb-1 font-mono">
                            CISALHAMENTO
                          </div>
                          <div className="font-mono text-sm font-bold text-primary">
                            {simulatedElasticity} GPa
                          </div>
                        </div>

                        <div className="p-3.5 border border-primary/15 bg-[#FAF9F6] transition-all">
                          <div className="text-[8px] font-bold text-secondary-grey/80 tracking-[0.2em] uppercase mb-1 font-mono">
                            DELTA-T TÉRMICO
                          </div>
                          <div className="font-mono text-sm font-bold text-primary">
                            {simulatedThermalDelta}
                          </div>
                        </div>

                      </div>

                      {/* Display Alert triggers strictly for Brutalist effect */}
                      {isPressureCritical && (
                        <div className="mt-4 border border-[#C2410C]/30 bg-[#C2410C]/5 p-3.5 text-xs text-[#C2410C] flex gap-2 items-center">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span className="font-semibold uppercase tracking-[0.1em] font-mono text-[10px]">
                            ALERTA ESTRESSE: Pressão limite excedida para opala-A!
                          </span>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* VIEW 6: SEARCH RESULTS VIEW */}
            {activeTab === "busca" && (
              <motion.div
                key="search-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                {/* Header Section */}
                <section className="bg-primary/10 border-b border-primary p-6 md:p-10">
                  <h1 className="text-3xl md:text-4xl font-serif italic font-bold text-primary mb-2">
                    Resultados da Busca
                  </h1>
                  <p className="text-sm text-secondary-grey font-mono">
                    Encontrados <span className="font-bold text-primary">{filteredSpecimens.length}</span> espécimes correspondentes a: <span className="font-bold text-primary">"{lastSearchQuery}"</span>
                  </p>
                </section>

                {/* Results Grid */}
                {filteredSpecimens.length > 0 ? (
                  <div className="p-6 md:p-10 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSpecimens.map((spec) => (
                        <motion.button
                          key={spec.id}
                          onClick={() => {
                            setActiveSpecimenId(spec.id);
                            setActiveTab("colecoes");
                          }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          className="border border-primary/20 hover:border-primary bg-white p-4 text-left transition-all cursor-pointer flex flex-col gap-3"
                        >
                          <img
                            src={spec.imagem_url}
                            alt={spec.nome}
                            className="w-full h-40 object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-primary italic font-serif text-base truncate">
                              {spec.nome}
                            </h3>
                            <p className="text-xs text-secondary-grey font-mono truncate">
                              ID: {spec.id}
                            </p>
                            <p className="text-xs text-secondary-grey font-mono truncate">
                              {spec.lineage.split("|")[0]}
                            </p>
                          </div>
                          <div className="text-[10px] text-primary font-mono uppercase tracking-widest mt-auto">
                            Ver detalhes →
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-10">
                    <div className="text-center">
                      <p className="text-secondary-grey font-mono text-sm mb-4">
                        Nenhum resultado encontrado para "<span className="text-primary font-bold">{lastSearchQuery}</span>"
                      </p>
                      <button
                        onClick={() => setActiveTab("colecoes")}
                        className="px-4 py-2 border border-primary text-xs font-bold uppercase tracking-widest bg-white text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        Voltar às Coleções
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* MODAL 1: EXPORT MODAL DISPLAY */}
      <AnimatePresence>
        {exportModalSpecimen && (
          <div
            className="fixed inset-0 bg-black/55 z-60 flex items-center justify-center p-4 backdrop-blur-[2px] overflow-auto"
            onClick={() => setExportModalSpecimen(null)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-[#F9F7F2] border border-primary/15 max-w-3xl w-full max-h-[80vh] p-6 relative overflow-hidden flex flex-col shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-between items-start gap-4 mb-4 pb-3 border-b border-primary/10">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-secondary-grey/90 uppercase tracking-[0.2em] block font-mono">
                    ARQUIVO DE GAVETA TÉCNICA EXPORT
                  </span>
                  <h3 className="text-lg md:text-xl font-serif font-bold italic text-primary mt-1 truncate">
                    Dados Completos: {exportModalSpecimen.nome}
                  </h3>
                </div>
                <button
                  onClick={() => setExportModalSpecimen(null)}
                  className="p-2 border border-primary/15 hover:bg-primary/5 transition-all text-primary bg-white rounded-md cursor-pointer"
                  aria-label="Fechar exportação"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-secondary-grey/90 mb-4 font-sans leading-relaxed">
                Abaixo estão organizados os esquemas de representação morfológica biogênica do espécime para exportação radical e integração de dados geográficos ou taxonômicos secundários.
              </p>

              {/* Code field display */}
              <div className="flex-1 bg-primary/5 text-primary p-4 font-mono text-[11px] overflow-auto max-h-[55vh] border border-primary/10 relative leading-relaxed select-all">
                <pre>{JSON.stringify(exportModalSpecimen, null, 2)}</pre>
              </div>

              <div className="mt-5 pt-4 border-t border-primary/10 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <button
                  onClick={() => setExportModalSpecimen(null)}
                  className="px-4 py-2 border border-primary/15 text-xs font-bold uppercase tracking-widest bg-white text-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  Fechar
                </button>
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => copyExportDataToClipboard(exportModalSpecimen)}
                    className="px-4 py-2 border border-primary/15 text-xs font-bold uppercase tracking-widest bg-white text-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-2 font-mono"
                  >
                    <Copy className="w-3.5 h-3.5 text-warning-amber" />
                    Copiar JSON
                  </button>
                  <button
                    onClick={() => downloadExportDataFile(exportModalSpecimen)}
                    className="px-4 py-2 bg-primary text-[#F9F7F2] text-xs font-bold uppercase tracking-widest hover:bg-[#1a1a1a] border border-primary/10 transition-all cursor-pointer flex items-center gap-2 font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar Arquivo .json
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: USER PROFILE / CURATOR INFO (Ficha do Pesquisador) */}
      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-[#F9F7F2] border border-primary/15 max-w-md w-full p-8 relative overflow-hidden shadow-xl"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-primary/10">
                <div>
                  <span className="text-[9px] font-bold text-secondary-grey/90 uppercase tracking-[0.2em] block font-mono">
                    FICHA AUTORIZADA PESQUISADOR
                  </span>
                  <h3 className="text-lg font-serif font-bold italic text-primary mt-1">
                    Credencial de Segurança
                  </h3>
                </div>
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="p-1.5 border border-primary/15 hover:bg-primary/5 transition-all text-primary bg-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 my-5 text-xs font-mono">
                <div className="flex items-center gap-4 p-4 border border-primary/10 bg-[#FAF9F6]">
                  <div className="w-12 h-12 bg-warning-amber/10 border border-warning-amber/20 flex items-center justify-center font-bold text-warning-amber text-lg font-mono">
                    MG
                  </div>
                  <div>
                    <div className="font-bold text-sm text-primary">megagl@cesar.school</div>
                    <div className="text-[9px] text-secondary-grey tracking-widest uppercase mt-0.5">// PESQUISADOR SÊNIOR</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-primary/10 pt-4">
                  <div className="flex justify-between text-primary/80">
                    <span className="text-secondary-grey uppercase tracking-wider text-[10px]">INSTITUIÇÃO:</span>
                    <span className="font-semibold text-primary">Laboratório de Morfologia Digital</span>
                  </div>
                  <div className="flex justify-between text-primary/80">
                    <span className="text-secondary-grey uppercase tracking-wider text-[10px]">NÍVEL DE PERMISSÃO:</span>
                    <span className="font-semibold text-warning-amber">TRANSPARÊNCIA_RADICAL_v4</span>
                  </div>
                  <div className="flex justify-between text-primary/80">
                    <span className="text-secondary-grey uppercase tracking-wider text-[10px]">SESSÃO ATIVA DESDE:</span>
                    <span className="font-semibold text-primary">2026-06-03 UTC</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="w-full mt-6 py-2 bg-primary text-[#F9F7F2] border border-primary/10 text-xs uppercase tracking-widest font-mono font-bold hover:bg-[#1a1a1a] transition-all text-center cursor-pointer"
              >
                Retornar aos Arquivos
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: AI SPECIMEN SYNTHESIS WIDGET (Curadoria Artificial Panel) */}
      <AnimatePresence>
        {synthesizerOpen && (
          <div className="fixed inset-0 bg-black/55 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-[#F9F7F2] border border-primary/15 max-w-lg w-full p-8 relative overflow-hidden flex flex-col max-h-[90vh] shadow-xl"
            >
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-warning-amber shrink-0 animate-spin" />
                  <div>
                    <span className="text-[9px] font-bold text-secondary-grey/95 uppercase tracking-[0.2em] block font-mono">
                      MOTOR DE CURADORIA DIGITAL INTELIGENTE
                    </span>
                    <h3 className="text-lg font-serif font-bold italic text-primary mt-0.5">
                      Síntese de Nova Morfologia Natural
                    </h3>
                  </div>
                </div>
                {!isSynthesizing && (
                  <button
                    onClick={() => setSynthesizerOpen(false)}
                    className="p-1.5 border border-primary/15 hover:bg-primary/5 transition-all text-primary bg-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {!isSynthesizing ? (
                  <form onSubmit={handleAISynthesis} className="space-y-4">
                    <p className="text-xs text-secondary-grey/90 font-sans leading-relaxed">
                      Escreva detalhadamente ou conceitualmente a estrutura geométrica, material, proveniência ou comportamento de um espécime biológico microscópico ou macroscópico (ex: <i>"Cesta-de-flores-de-Vênus com treliça de sílica hialina em ângulos retos coletada a 3000 metros de profundidade"</i>). O motor de inteligência Gemini-3.5-flash sintetizará um perfil de arquivo em Brutalismo Técnico completo.
                    </p>

                    <div className="space-y-1">
                    <label className="text-[9px] font-bold text-secondary-grey/85 uppercase tracking-widest block font-mono">
                      Parâmetros descritivos ou notas científicas do espécime *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={customSpecimenPrompt}
                      onChange={(e) => setCustomSpecimenPrompt(e.target.value)}
                      placeholder="Descreva a estrutura, simetria, porosidade e local de amostragem virtual..."
                      className="w-full p-3.5 border border-primary/15 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-warning-amber/40 focus:bg-white placeholder:text-secondary-grey/40 bg-white leading-relaxed"
                    />
                  </div>

                  {/* External Media Hosting & Authorship inputs */}
                  <div className="p-4 border border-warning-amber/20 bg-warning-amber/5 text-[10px] font-mono text-secondary-grey/90 leading-relaxed space-y-3">
                    <div className="font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-warning-amber" />
                      Hospedagem Externa de Mídia & Autoria
                    </div>
                    <p className="text-[10px] leading-normal text-secondary-grey/85">
                      Para manter os custos de armazenamento do servidor em zero, as imagens devem estar hospedadas externamente. Forneça o link público direto da imagem e informe a autoria para os devidos créditos.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-primary uppercase tracking-wider block">
                          Link Direto da Imagem (URL) *
                        </label>
                        <input
                          type="url"
                          required
                          value={userImageUrl}
                          onChange={(e) => setUserImageUrl(e.target.value)}
                          placeholder="Ex: https://images.unsplash.com/photo-..."
                          className="w-full p-2 border border-primary/15 text-xs font-mono focus:outline-none focus:bg-white placeholder:text-secondary-grey/40 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-primary uppercase tracking-wider block">
                          Autoria / Crédito *
                        </label>
                        <input
                          type="text"
                          required
                          value={userImageAuthor}
                          onChange={(e) => setUserImageAuthor(e.target.value)}
                          placeholder="Ex: National Geographic / Nikon Small World"
                          className="w-full p-2 border border-primary/15 text-xs font-mono focus:outline-none focus:bg-white placeholder:text-secondary-grey/40 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 border border-primary/10 text-[10px] text-secondary-grey/90 leading-relaxed font-mono">
                    <strong>Sinal Técnico:</strong> Chamada server-side segura ao modelo Gemini, gerando um registro taxonômico rigorosamente catalogado que se comportará realisticamente no Simulador Físico com a mídia integrada.
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setSynthesizerOpen(false)}
                      className="px-4 py-2 border border-primary/15 text-xs font-bold uppercase tracking-widest font-mono hover:bg-primary/5 bg-white cursor-pointer text-primary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!customSpecimenPrompt.trim() || !userImageUrl.trim() || !userImageAuthor.trim()}
                      className="px-5 py-2 bg-primary text-[#F9F7F2] text-xs font-bold uppercase tracking-widest font-mono border border-primary/10 hover:bg-[#1a1a1a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Sintetizar via IA &rarr;
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 flex flex-col min-h-[300px]">
                  
                  <div className="flex items-center gap-2.5 mb-4 text-xs font-bold font-mono text-primary animate-pulse">
                    <RefreshCw className="w-4 h-4 text-warning-amber animate-spin" />
                    <span>CURANDO MODELOS GEOMÉTRICOS MORFOESTRUTURAIS...</span>
                  </div>

                  {/* Operational Terminal Log output */}
                  <div 
                    ref={logContainerRef}
                    className="flex-1 bg-primary/5 text-primary p-4.5 font-mono text-[10px] leading-relaxed border border-primary/10 overflow-y-auto space-y-1 h-[250px] mb-4 select-all"
                  >
                    {synthesisLogs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-secondary-grey/60 font-bold font-mono">[{index + 1}]</span>
                        <span className={log.startsWith("[ERRO") ? "text-[#c2410c]" : log.startsWith("[OK") ? "text-warning-amber font-semibold" : "text-primary/90"}>
                          {log}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-secondary-grey/85 font-mono text-center tracking-widest uppercase">
                    Não feche esta janela. A cristalização estrutural requere processamento da IA...
                  </div>

                </div>
              )}
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Specimen Footer */}
      <footer className="border-t border-primary/15 bg-[#FAF9F6] fixed bottom-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-40 py-3.5 px-4 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[10px] font-mono leading-none bg-opacity-95 backdrop-blur-[2px]">
        <div>
          <span className="font-bold text-primary tracking-wider font-sans text-[11px]">ACERVO DE FORMAS NATURAIS</span>
          <span className="text-secondary-grey/80 ml-3 font-mono">
            {activeSpecimen.ref_documento}
          </span>
        </div>
        <div className="flex gap-6 items-center shrink-0">
          <div>
            <span className="text-secondary-grey mr-2 text-[9px]">CURADORIA POR:</span>
            <span className="font-bold italic text-primary">{activeSpecimen.curadoria}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-secondary-grey mr-2 text-[9px]">ÚLTIMA MODIFICAÇÃO:</span>
            <span className="font-bold text-primary">{activeSpecimen.ultima_modificacao}</span>
          </div>
        </div>
      </footer>

      {/* Floating Micro-Coordinates HUD for authentic technical lab texture */}
      <div className="fixed bottom-12 right-2 z-40 p-2 border border-primary/15 bg-[#FAF9F6]/90 text-primary font-mono text-[8px] flex flex-col items-end opacity-65 hover:opacity-100 transition-opacity pointer-events-none select-none">
        <div>COORDENADAS HUD: {activeSpecimen.coordenadas_fisicas}</div>
        <div>SCAN RESOLUÇÃO: {activeSpecimen.res_scan}</div>
      </div>

    </div>
  );
}
