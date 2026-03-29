import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const HARDWARE_TIERS = [
  { id: "modern", label: "Modern Laptop/PC", desc: "8+ GB RAM, SSD, made after 2015", icon: "💻", aiCapable: true, ram: "8-16 GB", storage: "256 GB+" },
  { id: "old", label: "Old PC/Laptop", desc: "2-4 GB RAM, HDD, 2005-2015 era", icon: "🖥️", aiCapable: false, ram: "2-4 GB", storage: "64 GB+" },
  { id: "phone", label: "Smartphone/Tablet", desc: "Android or iOS device with storage", icon: "📱", aiCapable: false, ram: "2-6 GB", storage: "32 GB+" },
  { id: "micro", label: "Microcontroller/SBC", desc: "Raspberry Pi, Arduino, ESP32", icon: "🔌", aiCapable: false, ram: "<1 GB", storage: "SD card" },
  { id: "extreme", label: "Scrap Hardware", desc: "Z80/8086 era — CollapseOS/DuskOS mode", icon: "⚡", aiCapable: false, ram: "<64 KB", storage: "Floppy/EPROM" },
];

const RESOURCE_OPTIONS = [
  { id: "solar", label: "Solar panels", icon: "☀️" },
  { id: "battery", label: "Car batteries", icon: "🔋" },
  { id: "generator", label: "Generator/fuel", icon: "⛽" },
  { id: "tools", label: "Hand tools", icon: "🔧" },
  { id: "copper", label: "Copper wire/scrap", icon: "🔶" },
  { id: "radio", label: "Radio equipment", icon: "📻" },
  { id: "medical", label: "Medical supplies", icon: "💊" },
  { id: "seeds", label: "Seeds/agriculture", icon: "🌱" },
  { id: "weapons", label: "Defense/security", icon: "🛡️" },
  { id: "vehicles", label: "Vehicles", icon: "🚗" },
  { id: "water", label: "Water source nearby", icon: "💧" },
  { id: "books", label: "Technical books", icon: "📚" },
];

const REBUILD_TRACKS = [
  {
    id: "day0", phase: "Day 0–30", title: "Immediate Survival", color: "#FF4136", icon: "🔴", priority: "CRITICAL",
    modules: [
      { name: "Radiation Detection & Decontamination", desc: "DIY Geiger counter integration, fallout mapping, 7-10 rule, decontam protocols", tags: ["radiation","safety"], steps: 8 },
      { name: "Water Purification", desc: "SODIS, bio-sand filters, bleach ratios, distillation from scrap — tested for contaminated sources", tags: ["water","survival"], steps: 6 },
      { name: "Emergency Shelter & Hardening", desc: "Fallout shelters, shielding factors, EMP recovery checklists for salvaged electronics", tags: ["shelter","EMP"], steps: 7 },
      { name: "Foraging & Food Safety", desc: "Edible plant ID for your region, contamination testing, calorie triage for groups", tags: ["food","survival"], steps: 5 },
      { name: "First Aid & Radiation Sickness", desc: "Triage protocols, wound care, ARS staging, potassium iodide dosing, infection control", tags: ["medical","radiation"], steps: 9 },
      { name: "Group Organization & Security", desc: "Survivor census, skill inventory, rotating council governance, perimeter security", tags: ["governance","security"], steps: 6 },
    ]
  },
  {
    id: "month1", phase: "Month 1–6", title: "Stabilization & Early Production", color: "#FF851B", icon: "🟠", priority: "HIGH",
    modules: [
      { name: "Food Production Systems", desc: "Permaculture, seed saving, hydroponics from scrap, calorie-crop prioritization", tags: ["agriculture","food"], steps: 8 },
      { name: "Energy from Junk", desc: "Wood gasifiers, scrap wind turbines, solar from salvaged panels, hand-crank generators", tags: ["energy","engineering"], steps: 7 },
      { name: "Sanitation & Disease Prevention", desc: "Composting toilets, greywater filtration, soap from ash/fat, epidemic prevention", tags: ["sanitation","medical"], steps: 6 },
      { name: "Basic Chemistry Lab", desc: "Acids, alkalis, disinfectants, fuels, fertilizers from local materials", tags: ["chemistry","manufacturing"], steps: 7 },
      { name: "Communications Revival", desc: "Crystal radios, ham from junk, mesh networking with salvaged WiFi/LoRa hardware", tags: ["comms","radio"], steps: 6 },
      { name: "Governance & Trade Systems", desc: "Written charter, labor-credit economy, inter-settlement trade protocols", tags: ["governance","economy"], steps: 5 },
    ]
  },
  {
    id: "year1", phase: "Year 1+", title: "Industrial Rebuilding", color: "#FFDC00", icon: "🟡", priority: "STANDARD",
    modules: [
      { name: "Metallurgy & Forge", desc: "Bloomery iron, Bessemer steel, tool progression from knives to machine parts", tags: ["metallurgy","manufacturing"], steps: 8 },
      { name: "Machine Tools", desc: "Lathes from car parts, drill presses, milling — the mother machines that build everything", tags: ["manufacturing","tools"], steps: 7 },
      { name: "Medicine & Pharmacology", desc: "Antibiotic synthesis from mold, surgical tools, microscopy, anesthesia", tags: ["medical","chemistry"], steps: 8 },
      { name: "Advanced Energy", desc: "Micro-hydro, grid-scale wind, steam engines, battery banks, AC transmission", tags: ["energy","engineering"], steps: 6 },
      { name: "Electronics Revival", desc: "Transistors from germanium, basic fabs, circuit design with KiCad, radio networks", tags: ["electronics","computing"], steps: 7 },
      { name: "Computing Bootstrap", desc: "CollapseOS on scrap Z80 → relay computers → basic semiconductor fab → 1970s capability", tags: ["computing","electronics"], steps: 6 },
    ]
  },
];

const VAULT_CONTENTS = [
  { name: "Wikipedia (Kiwix)", size: "90", desc: "Full English Wikipedia, searchable offline via ZIM", icon: "📖" },
  { name: "iFixit Repair Manuals", size: "15", desc: "Repair guides for thousands of devices and machines", icon: "🔧" },
  { name: "Medical Library", size: "8", desc: "Surgery, pharmacology, radiation medicine, field guides", icon: "🏥" },
  { name: "Engineering Corpus", size: "12", desc: "Metallurgy, EE, mechanical, chemical engineering texts", icon: "⚙️" },
  { name: "Agriculture & Botany", size: "6", desc: "Permaculture, seed saving, regional crop guides, soil science", icon: "🌾" },
  { name: "Project Gutenberg", size: "8", desc: "70,000+ classic texts including historical tech manuals", icon: "📚" },
  { name: "OpenStreetMap", size: "25", desc: "Full offline world maps with navigation tools", icon: "🗺️" },
  { name: "Manufacturing Blueprints", size: "4", desc: "3D-printable & hand-tool designs: turbines, engines, radios, pumps", icon: "📐" },
  { name: "Nuclear Survival Guides", size: "2", desc: "FEMA, ORNL, Cresson Kearny — tested fallout/EMP protocols", icon: "☢️" },
  { name: "AI Models (Quantized)", size: "14", desc: "Llama 3.2/3.3 fine-tuned on rebuild knowledge — runs on 8GB RAM", icon: "🧠" },
];

const SOFTWARE_SUITE = [
  { cat: "CAD/Design", tools: ["FreeCAD", "OpenSCAD", "KiCad", "LibreCAD"], icon: "📐" },
  { cat: "Simulation", tools: ["SciPy/NumPy", "Circuit Sim", "FEA Engine", "Chemistry Models"], icon: "🔬" },
  { cat: "Programming", tools: ["Python 3", "GCC/G++", "Forth (CollapseOS)", "AVR/ARM Assembler"], icon: "💻" },
  { cat: "Communications", tools: ["GNU Radio", "BATMAN Mesh", "Packet Radio", "Morse Trainer"], icon: "📡" },
  { cat: "Radiation Tools", tools: ["ESPGeiger Interface", "Fallout Mapper", "Dose Logger", "Wind Model"], icon: "☢️" },
  { cat: "Productivity", tools: ["SQLite DB", "Task Tracker", "Inventory System", "Governance Templates"], icon: "📋" },
];

const AI_EXAMPLES = [
  { q: "I have copper wire from a house and a car alternator. How do I build a wind generator?", tag: "Energy" },
  { q: "3 survivors, contaminated water source, no fuel. Prioritize our first 48 hours.", tag: "Triage" },
  { q: "My Geiger counter reads 0.5 mSv/hr outside. Is it safe to scavenge?", tag: "Radiation" },
  { q: "Show me how to build a bloomery forge using car parts and firebrick.", tag: "Metallurgy" },
  { q: "Identify antibacterial compounds I can extract from common local plants.", tag: "Medicine" },
  { q: "Design a mesh network using 3 salvaged WiFi routers and a Raspberry Pi.", tag: "Comms" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function CivOS() {
  const [screen, setScreen] = useState("boot");
  const [bootLines, setBootLines] = useState([]);
  const [nav, setNav] = useState("dashboard");
  const [expandedModule, setExpandedModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [setupData, setSetupData] = useState({ hardware: null, survivors: 4, resources: [], radiation: "unknown" });
  const [roadmap, setRoadmap] = useState(null);
  const [radLevel, setRadLevel] = useState(0.12);
  const [radHistory] = useState(() => Array.from({ length: 24 }, (_, i) => ({ hour: i, mSv: Math.random() * 0.3 + 0.05 })));
  const bootIndex = useRef(0);
  const aiChatRef = useRef(null);

  const BOOT_LINES = useRef([
    { text: "CivOS v1.0.0 — Civilization Accelerator Platform", type: "header" },
    { text: "Kernel: civOS-linux 6.8.0-survival #1 SMP", type: "sys" },
    { text: "Hardware scan... detecting available resources", type: "sys" },
    { text: "RAM: OK | Storage: OK | Display: OK", type: "ok" },
    { text: "Loading Knowledge Vault... 197.4 GB verified", type: "load" },
    { text: "  ├─ Wikipedia (Kiwix)............. 90.2 GB ✓", type: "load" },
    { text: "  ├─ Engineering Corpus............ 12.1 GB ✓", type: "load" },
    { text: "  ├─ Medical Library............... 8.3 GB ✓", type: "load" },
    { text: "  ├─ Manufacturing Blueprints...... 4.1 GB ✓", type: "load" },
    { text: "  └─ AI Rebuilder Model............ 14.2 GB ✓", type: "load" },
    { text: "Initializing AI Mentor (Llama 3.2-rebuild-Q4)...", type: "ai" },
    { text: "  Model loaded. Context: 8192 tokens. Ready.", type: "ai" },
    { text: "Loading tools: FreeCAD, KiCad, GNU Radio, SciPy...", type: "load" },
    { text: "Radiation monitor: STANDBY (connect sensor for live)", type: "warn" },
    { text: "Network: NO EXTERNAL CONNECTION DETECTED", type: "warn" },
    { text: "Mesh radio: SCANNING... no peers found", type: "warn" },
    { text: "", type: "blank" },
    { text: "╔═══════════════════════════════════════════════════╗", type: "banner" },
    { text: "║  CIVILIZATION OS — FULLY OPERATIONAL              ║", type: "banner" },
    { text: "║  All modules loaded. AI Mentor online.            ║", type: "banner" },
    { text: "║  \"From ashes, we rebuild — faster.\"               ║", type: "banner" },
    { text: "╚═══════════════════════════════════════════════════╝", type: "banner" },
  ]);

  useEffect(() => {
    if (screen !== "boot") return;
    bootIndex.current = 0;
    setBootLines([]);
    const lines = BOOT_LINES.current;
    const iv = setInterval(() => {
      if (bootIndex.current < lines.length) {
        const line = lines[bootIndex.current];
        bootIndex.current++;
        setBootLines(prev => [...prev, line]);
      } else {
        clearInterval(iv);
        setTimeout(() => setScreen("setup"), 1200);
      }
    }, 120);
    return () => clearInterval(iv);
  }, [screen]);

  useEffect(() => {
    const iv = setInterval(() => {
      setRadLevel(prev => Math.max(0.01, prev + (Math.random() - 0.52) * 0.03));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const generateRoadmap = useCallback(() => {
    const hw = HARDWARE_TIERS.find(h => h.id === setupData.hardware);
    const hasEnergy = setupData.resources.some(r => ["solar", "battery", "generator"].includes(r));
    const hasWater = setupData.resources.includes("water");
    const hasTools = setupData.resources.includes("tools");
    const hasRadio = setupData.resources.includes("radio");
    const hasSeeds = setupData.resources.includes("seeds");

    const items = [];
    items.push({ day: "Day 1-3", task: "Radiation assessment & shelter hardening", priority: "CRITICAL", done: false,
      detail: setupData.radiation === "high" ? "HIGH RADIATION: Stay sheltered. Use 7-10 rule. Minimum 48hr shelter-in-place." : "Monitor levels. Identify safe scavenging corridors." });
    items.push({ day: "Day 1-3", task: "Water security", priority: "CRITICAL", done: false,
      detail: hasWater ? "Water source available. Set up purification immediately (boil/SODIS/filter)." : "NO WATER SOURCE IDENTIFIED. Priority #1: locate water within 2km radius." });
    items.push({ day: "Day 3-7", task: "Hardware triage & CivOS deployment", priority: "HIGH", done: false,
      detail: hw ? `${hw.label} detected. ${hw.aiCapable ? "AI Mentor AVAILABLE — full reasoning support." : "Limited hardware — text-only knowledge access. Consider locating better hardware."}` : "Run hardware diagnostics. Test all salvaged electronics." });
    if (!hasEnergy) items.push({ day: "Day 7-14", task: "Emergency power generation", priority: "CRITICAL", done: false, detail: "No power source identified. Build hand-crank generator or locate solar panels/car batteries." });
    if (hasEnergy) items.push({ day: "Day 7-14", task: "Stabilize power supply", priority: "HIGH", done: false, detail: "Wire battery bank. Establish charging rotation. Protect from elements." });
    items.push({ day: "Day 14-30", task: `Organize ${setupData.survivors} survivors — assign roles`, priority: "HIGH", done: false,
      detail: `With ${setupData.survivors} people: ${setupData.survivors <= 3 ? "Small group — everyone multitasks. Pair up for safety." : setupData.survivors <= 8 ? "Assign: water/food lead, security, medical, engineering." : "Establish council. Create work teams of 3-4 with rotating leads."}` });
    items.push({ day: "Month 1-2", task: hasSeeds ? "Plant first crops — fast-calorie focus" : "Locate seeds / establish foraging routes", priority: "HIGH", done: false,
      detail: hasSeeds ? "Start with radishes (25d), beans (60d), potatoes (90d). Maximize calorie/acre." : "Scavenge garden centers, farms, seed banks. Propagate from wild edibles." });
    if (hasRadio) items.push({ day: "Month 1-2", task: "Establish radio communications", priority: "MEDIUM", done: false, detail: "Set up ham radio scanning. Broadcast on emergency frequencies. Log contacts." });
    if (hasTools) items.push({ day: "Month 2-4", task: "Begin forge construction", priority: "MEDIUM", done: false, detail: "Build charcoal kiln → construct bellows → assemble forge. Start tool production." });
    items.push({ day: "Month 3-6", task: "Establish mesh network with nearby settlements", priority: "MEDIUM", done: false, detail: "Deploy BATMAN mesh on salvaged WiFi routers. ~300m per node. Share CivOS data." });
    items.push({ day: "Year 1", task: "Machine tool production — build a lathe", priority: "STANDARD", done: false, detail: "The lathe is the mother machine. Once you have one, you can build every other tool." });
    items.push({ day: "Year 1-2", task: hw?.aiCapable ? "AI-assisted electronics design & basic fab" : "Manual electronics revival from salvaged components", priority: "STANDARD", done: false,
      detail: "Use KiCad for circuit design. Salvage transistors/ICs. Build toward basic computing." });
    setRoadmap(items);
  }, [setupData]);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setAiTyping(true);
    setTimeout(() => {
      let response = "";
      const q = userMsg.toLowerCase();
      if (q.includes("generator") || q.includes("wind") || q.includes("alternator")) {
        response = `WIND GENERATOR FROM CAR ALTERNATOR:\n\n1. ALTERNATOR PREP: Remove voltage regulator for direct field coil access. Most 12V alternators output 50-80A at ~3000 RPM.\n\n2. BLADE DESIGN: Cut 3 blades from sheet metal or PVC pipe (split lengthwise, heat-form into airfoil). Each blade 1-1.5m. Mount 120° apart on hub.\n\n3. HUB: Bolt blade roots to steel disc. Attach to alternator pulley shaft. Critical: balance all blades by weight.\n\n4. TOWER: 10m minimum. Steel pipe or timber A-frame. Pivot mount for yaw. Include furling for storms.\n\n5. WIRING: Alternator → charge controller → battery bank (12V car batteries parallel). 10 AWG minimum for 15m+ runs.\n\n⚡ Expected: 200-500W in 15-25 km/h wind. Powers devices, lights, radio.`;
      } else if (q.includes("radiation") || q.includes("msv") || q.includes("geiger") || q.includes("safe")) {
        response = `RADIATION SAFETY ASSESSMENT:\n\n📊 Reading context:\n• < 0.1 mSv/hr: LOW — safe for extended outdoor work\n• 0.1–0.5 mSv/hr: MODERATE — limit outdoor to 2-4 hrs/day\n• 0.5–1.0 mSv/hr: HIGH — max 1 hr. Full decontam after.\n• > 1.0 mSv/hr: DANGER — shelter in place. 3ft earth shielding.\n\n7-10 RULE: Radiation drops 10× for every 7× time elapsed.\n• 7 hours: 1/10th\n• 49 hours (~2 days): 1/100th\n• 14 days: ~1/1000th\n\nDECONTAM:\n1. Remove outer clothing (eliminates ~90%)\n2. Wash with soap + water (NO conditioner)\n3. Bag contaminated items, bury downwind`;
      } else if (q.includes("prioritize") || q.includes("survivor") || q.includes("first") || q.includes("48")) {
        response = `SURVIVAL TRIAGE — First 48 Hours:\n\n🔴 HOUR 0-6 (IMMEDIATE):\n1. SHELTER — underground or behind mass. 3ft earth = 1000× dose reduction\n2. HEADCOUNT — alive, injured, skilled? Inventory NOW.\n3. WATER — don't drink open sources near fallout. Sealed containers first.\n\n🟠 HOUR 6-24:\n4. RADIATION RECON — map immediate area. ID safe corridors.\n5. MEDICAL TRIAGE — bleeding > breathing > burns > fractures.\n6. COMMS — try AM/FM radio. Listen before broadcasting.\n\n🟡 HOUR 24-48:\n7. RESOURCE INVENTORY — every tool, food, fuel in safe perimeter.\n8. ASSIGN ROLES — ${setupData.survivors} survivors = ${setupData.survivors <= 3 ? "buddy system, everyone multitasks" : "team leads: water, food, security, engineering"}.\n9. 30-DAY PLAN — Use CivOS Roadmap for your rebuild sequence.\n\n⚡ First group to organize WINS.`;
      } else if (q.includes("mesh") || q.includes("network") || q.includes("wifi") || q.includes("router")) {
        response = `MESH NETWORK FROM SALVAGED ROUTERS:\n\n1. FLASH OpenWrt on any router (Linksys, TP-Link, etc). Need 3+ nodes.\n\n2. INSTALL BATMAN-adv:\n   opkg install kmod-batman-adv\n   Same SSID, ad-hoc mode, same channel on all nodes.\n\n3. RANGE: Stock = ~100-300m. Boost with:\n   • Yagi antenna from wire hangers (directional, 1-2km)\n   • Cantenna from tin can (700m directional)\n   • Raise height — every 3m up ≈ doubles range\n\n4. POWER: 5-10W per router. Solar + car battery handles 5 nodes 24/7.\n\n5. SERVICES on mesh:\n   • Shared CivOS (any device via browser)\n   • Bulletin board for settlements\n   • Resource/inventory database\n\n📡 5 elevated nodes covers 2-3km radius.`;
      } else if (q.includes("forge") || q.includes("bloomery") || q.includes("iron") || q.includes("metal")) {
        response = `BLOOMERY FORGE FROM SCRAP:\n\n1. CHARCOAL: Build earth kiln — stack hardwood in pit, cover with earth leaving air holes. Burn 24+ hrs.\n\n2. FORGE BODY: Firebrick or stacked stone chamber, ~60cm interior. Line with clay if using stone.\n\n3. BELLOWS: Two boards + leather bag. Hinge at back. Nozzle from steel pipe into forge base.\n\n4. BLOOMERY (iron smelting): Layer charcoal + iron ore (or rust/oxide) in tall chimney (1m+). Force air from bottom with bellows. Maintain 1200°C+ for 6-8 hours.\n\n5. BLOOM: Extract spongy iron mass. Reheat and hammer repeatedly to consolidate and remove slag.\n\n6. TOOL PROGRESSION:\n   Knives → chisels → hammers → tongs → plows → axles\n\nANVIL: Railroad track section, I-beam cutoff, or large sledgehammer head on stump.\n\n🔥 With forge running, you can produce tools that multiply everything else.`;
      } else {
        response = `I can help with that. To give you the best answer, I'll cross-reference the Knowledge Vault against your specific situation.\n\nTell me more about:\n• What materials/tools do you have right now?\n• How many people can work on this?\n• Any safety concerns (radiation, structural, medical)?\n\nThe more context about your exact constraints, the more precisely I can tailor instructions.\n\nYou can also try browsing the Rebuild Tracks for step-by-step procedures, or check the Maker Suite for CAD templates and simulation tools.`;
      }
      setAiMessages(prev => [...prev, { role: "ai", text: response }]);
      setAiTyping(false);
      setTimeout(() => { if (aiChatRef.current) aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight; }, 50);
    }, 1200 + Math.random() * 800);
  };

  const allModules = REBUILD_TRACKS.flatMap(t => t.modules.map(m => ({ ...m, phase: t.phase, color: t.color })));
  const searchResults = searchQuery.length > 1
    ? allModules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.tags.some(t => t.includes(searchQuery.toLowerCase())) || m.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const S = {
    root: { background: "#060a0e", minHeight: "100vh", color: "#c8d6df", fontFamily: "'Courier New', Consolas, monospace", fontSize: 13 },
    amber: "#f0c040",
    green: "#40d870",
    red: "#ff4444",
    cyan: "#40c8e0",
    dim: "#405060",
    purple: "#d060f0",
    panel: { background: "#0a1018", border: "1px solid #1a2a38", borderRadius: 4, padding: 16 },
    btn: (active) => ({
      background: active ? "#f0c040" : "#0a1018",
      color: active ? "#060a0e" : "#607080",
      border: `1px solid ${active ? "#f0c040" : "#1a2a38"}`,
      borderRadius: 3,
      padding: "7px 14px",
      fontSize: 11,
      fontFamily: "'Courier New', monospace",
      fontWeight: "bold",
      cursor: "pointer",
      letterSpacing: 1,
      transition: "all 0.15s",
    }),
    tag: (color) => ({
      display: "inline-block",
      background: `${color}18`,
      color: color,
      fontSize: 10,
      padding: "2px 7px",
      borderRadius: 2,
      fontFamily: "'Courier New', monospace",
      border: `1px solid ${color}30`,
    }),
  };

  // ─── BOOT SCREEN ───────────────────────────────────────────────────────
  if (screen === "boot") {
    const typeColor = { header: "#f0c040", sys: "#607080", ok: "#40d870", load: "#40c8e0", ai: "#d060f0", warn: "#f0a030", blank: "transparent", banner: "#f0c040" };
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 620, width: "100%" }}>
          <div style={{ marginBottom: 16, opacity: 0.3, fontSize: 10, letterSpacing: 3 }}>BIOS POST... OK</div>
          {bootLines.map((line, i) => {
            if (!line || !line.text && line.type !== "blank") return null;
            return (
              <div key={i} style={{
                color: typeColor[line.type] || "#607080",
                fontSize: line.type === "header" ? 14 : line.type === "banner" ? 13 : 12,
                lineHeight: line.type === "blank" ? 0.8 : 1.8,
                fontWeight: line.type === "header" || line.type === "banner" ? "bold" : "normal",
                letterSpacing: line.type === "banner" ? 1 : 0.3,
                opacity: 0,
                animation: "civFadeIn 0.2s forwards",
                animationDelay: `${i * 0.04}s`,
              }}>{line.text || "\u00A0"}</div>
            );
          })}
          <div style={{ width: 8, height: 15, background: "#f0c040", animation: "civBlink 1s step-end infinite", marginTop: 4 }} />
        </div>
        <style>{`
          @keyframes civFadeIn { to { opacity: 1 } }
          @keyframes civBlink { 50% { opacity: 0 } }
        `}</style>
      </div>
    );
  }

  // ─── SETUP / ASSESSMENT ────────────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, minHeight: "100vh" }}>
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: S.amber, letterSpacing: 4, marginBottom: 6 }}>CIVOS INITIALIZATION</div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Situation Assessment</div>
            <div style={{ fontSize: 11, color: S.dim, marginTop: 6 }}>Answer so CivOS can generate your personalized rebuild roadmap.</div>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 14 }}>
              {[0,1,2,3].map(s => (
                <div key={s} style={{ width: 40, height: 3, borderRadius: 2, background: setupStep >= s ? S.amber : "#1a2a38", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>

          {setupStep === 0 && (
            <div>
              <div style={{ color: S.amber, fontSize: 12, marginBottom: 12, fontWeight: "bold" }}>01 — HARDWARE AVAILABLE</div>
              <div style={{ display: "grid", gap: 8 }}>
                {HARDWARE_TIERS.map(h => (
                  <div key={h.id} onClick={() => setSetupData(d => ({ ...d, hardware: h.id }))}
                    style={{
                      ...S.panel, borderColor: setupData.hardware === h.id ? S.amber : "#1a2a38",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.2s",
                    }}>
                    <div style={{ fontSize: 28, minWidth: 40, textAlign: "center" }}>{h.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: setupData.hardware === h.id ? "#fff" : "#a0b0c0", fontWeight: "bold", fontSize: 13 }}>{h.label}</div>
                      <div style={{ color: S.dim, fontSize: 11, marginTop: 2 }}>{h.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 10, color: S.dim }}>
                      <div>{h.ram}</div>
                      <div style={{ color: h.aiCapable ? S.green : S.dim, marginTop: 2 }}>{h.aiCapable ? "AI ✓" : "No AI"}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setupData.hardware && setSetupStep(1)}
                style={{ ...S.btn(!!setupData.hardware), width: "100%", marginTop: 16, padding: "12px 0", opacity: setupData.hardware ? 1 : 0.4 }}>
                NEXT →
              </button>
            </div>
          )}

          {setupStep === 1 && (
            <div>
              <div style={{ color: S.amber, fontSize: 12, marginBottom: 6, fontWeight: "bold" }}>02 — SURVIVORS IN YOUR GROUP</div>
              <div style={{ color: S.dim, fontSize: 11, marginBottom: 16 }}>How many people in your immediate group?</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 20 }}>
                <button onClick={() => setSetupData(d => ({ ...d, survivors: Math.max(1, d.survivors - 1) }))} style={{ ...S.btn(true), fontSize: 18, padding: "8px 16px" }}>−</button>
                <div style={{ fontSize: 48, fontWeight: "bold", color: "#fff", minWidth: 80, textAlign: "center" }}>{setupData.survivors}</div>
                <button onClick={() => setSetupData(d => ({ ...d, survivors: Math.min(100, d.survivors + 1) }))} style={{ ...S.btn(true), fontSize: 18, padding: "8px 16px" }}>+</button>
              </div>
              <div style={{ textAlign: "center", color: S.dim, fontSize: 11, marginBottom: 20 }}>
                {setupData.survivors <= 3 ? "Small team — CivOS will prioritize solo/pair procedures." :
                 setupData.survivors <= 10 ? "Good working group. CivOS will assign specialized roles." :
                 "Large group — CivOS will generate council governance and work teams."}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSetupStep(0)} style={{ ...S.btn(false), flex: 1, padding: "12px 0" }}>← BACK</button>
                <button onClick={() => setSetupStep(2)} style={{ ...S.btn(true), flex: 2, padding: "12px 0" }}>NEXT →</button>
              </div>
            </div>
          )}

          {setupStep === 2 && (
            <div>
              <div style={{ color: S.amber, fontSize: 12, marginBottom: 6, fontWeight: "bold" }}>03 — AVAILABLE RESOURCES</div>
              <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>Select everything you have access to. Tap to toggle.</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {RESOURCE_OPTIONS.map(r => {
                  const sel = setupData.resources.includes(r.id);
                  return (
                    <div key={r.id} onClick={() => setSetupData(d => ({ ...d, resources: sel ? d.resources.filter(x => x !== r.id) : [...d.resources, r.id] }))}
                      style={{ ...S.panel, padding: "10px 12px", borderColor: sel ? S.green : "#1a2a38", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "border-color 0.2s" }}>
                      <span style={{ fontSize: 18 }}>{r.icon}</span>
                      <span style={{ color: sel ? "#fff" : "#708090", fontSize: 11, fontWeight: sel ? "bold" : "normal" }}>{r.label}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setSetupStep(1)} style={{ ...S.btn(false), flex: 1, padding: "12px 0" }}>← BACK</button>
                <button onClick={() => setSetupStep(3)} style={{ ...S.btn(true), flex: 2, padding: "12px 0" }}>NEXT →</button>
              </div>
            </div>
          )}

          {setupStep === 3 && (
            <div>
              <div style={{ color: S.amber, fontSize: 12, marginBottom: 6, fontWeight: "bold" }}>04 — RADIATION STATUS</div>
              <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>What's the radiation situation?</div>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { id: "low", label: "Low / None detected", desc: "< 0.1 mSv/hr — safe for outdoor activity", color: S.green },
                  { id: "moderate", label: "Moderate", desc: "0.1–0.5 mSv/hr — limit outdoor exposure", color: S.amber },
                  { id: "high", label: "High / Active fallout", desc: "> 0.5 mSv/hr — shelter in place", color: S.red },
                  { id: "unknown", label: "Unknown / No sensor", desc: "Assume worst case until measured", color: S.dim },
                ].map(r => (
                  <div key={r.id} onClick={() => setSetupData(d => ({ ...d, radiation: r.id }))}
                    style={{ ...S.panel, cursor: "pointer", borderColor: setupData.radiation === r.id ? r.color : "#1a2a38", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: r.color, minWidth: 14 }} />
                    <div>
                      <div style={{ color: setupData.radiation === r.id ? "#fff" : "#a0b0c0", fontWeight: "bold", fontSize: 12 }}>{r.label}</div>
                      <div style={{ color: S.dim, fontSize: 10, marginTop: 2 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setSetupStep(2)} style={{ ...S.btn(false), flex: 1, padding: "12px 0" }}>← BACK</button>
                <button onClick={() => { generateRoadmap(); setScreen("main"); }} style={{ ...S.btn(true), flex: 2, padding: "12px 0" }}>GENERATE ROADMAP →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── MAIN INTERFACE ────────────────────────────────────────────────────
  const hw = HARDWARE_TIERS.find(h => h.id === setupData.hardware);
  const radColor = radLevel < 0.1 ? S.green : radLevel < 0.5 ? S.amber : S.red;
  const radStatus = radLevel < 0.1 ? "LOW" : radLevel < 0.5 ? "MODERATE" : "HIGH";
  const vaultTotal = VAULT_CONTENTS.reduce((s, v) => s + parseInt(v.size), 0);

  return (
    <div style={S.root}>
      {/* Top bar */}
      <div style={{ background: "#080e14", borderBottom: "1px solid #1a2a38", padding: "8px 14px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 3, background: `linear-gradient(135deg, ${S.amber}, #d08020)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚡</div>
            <div>
              <span style={{ color: S.amber, fontWeight: "bold", fontSize: 13, letterSpacing: 2 }}>CIVOS</span>
              <span style={{ color: S.dim, fontSize: 10, marginLeft: 8 }}>v1.0.0 • OFFLINE</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10 }}>
            <span style={{ color: radColor }}>☢ {radLevel.toFixed(2)} mSv/hr</span>
            <span style={{ color: "#1a2a38" }}>│</span>
            <span style={{ color: S.dim }}>{hw?.icon} {hw?.label}</span>
            <span style={{ color: "#1a2a38" }}>│</span>
            <span style={{ color: S.dim }}>👥 {setupData.survivors}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 8, overflowX: "auto", paddingBottom: 2 }}>
          {[
            { key: "dashboard", label: "DASHBOARD" },
            { key: "roadmap", label: "ROADMAP" },
            { key: "knowledge", label: "KNOWLEDGE" },
            { key: "ai", label: "AI MENTOR" },
            { key: "vault", label: "VAULT" },
            { key: "tools", label: "TOOLS" },
            { key: "radiation", label: "RAD MON" },
          ].map(t => (
            <button key={t.key} onClick={() => { setNav(t.key); setExpandedModule(null); }}
              style={{ ...S.btn(nav === t.key), padding: "5px 10px", fontSize: 10 }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 12px" }}>

        {/* ─── DASHBOARD ─── */}
        {nav === "dashboard" && (
          <div>
            <div style={{ ...S.panel, marginBottom: 14, borderColor: `${S.amber}40`, background: "linear-gradient(135deg, #12180a 0%, #0a1018 50%, #0a1210 100%)" }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>Rebuild. Faster than anyone else.</div>
              <div style={{ color: "#8098a8", fontSize: 12, lineHeight: 1.7 }}>
                CivOS is your civilization accelerator — {vaultTotal}+ GB of curated knowledge, local AI reasoning,
                engineering tools, and step-by-step rebuild procedures. Other groups rediscover the wheel slowly.
                You have an expert consultant that never sleeps.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))", gap: 8, marginBottom: 14 }}>
              {[
                { label: "RADIATION", value: radLevel.toFixed(2), unit: "mSv/hr", color: radColor, sub: radStatus },
                { label: "SURVIVORS", value: String(setupData.survivors), unit: "people", color: S.cyan, sub: setupData.survivors <= 3 ? "Small team" : "Organized" },
                { label: "AI MENTOR", value: hw?.aiCapable ? "ONLINE" : "N/A", unit: "", color: hw?.aiCapable ? S.green : S.dim, sub: hw?.aiCapable ? "Full reasoning" : "Text only" },
                { label: "KNOWLEDGE", value: String(vaultTotal), unit: "GB", color: S.amber, sub: "Fully loaded" },
                { label: "RESOURCES", value: String(setupData.resources.length), unit: `/${RESOURCE_OPTIONS.length}`, color: S.green, sub: "types tracked" },
                { label: "MESH NET", value: "SCAN", unit: "", color: S.dim, sub: "No peers yet" },
              ].map((c, i) => (
                <div key={i} style={{ ...S.panel, textAlign: "center", padding: 12 }}>
                  <div style={{ fontSize: 9, color: S.dim, letterSpacing: 2, marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontSize: 20, fontWeight: "bold", color: c.color }}>{c.value}<span style={{ fontSize: 10, color: S.dim, marginLeft: 2 }}>{c.unit}</span></div>
                  <div style={{ fontSize: 9, color: S.dim, marginTop: 4 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ ...S.panel, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", marginBottom: 10, letterSpacing: 1 }}>QUICK ACTIONS</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 6 }}>
                {[
                  { label: "Ask AI Mentor", icon: "🧠", target: "ai" },
                  { label: "View Roadmap", icon: "🗺️", target: "roadmap" },
                  { label: "Radiation Monitor", icon: "☢️", target: "radiation" },
                  { label: "Browse Knowledge", icon: "📖", target: "knowledge" },
                  { label: "Engineering Tools", icon: "🔧", target: "tools" },
                  { label: "Re-run Assessment", icon: "⚙️", target: null },
                ].map((a, i) => (
                  <div key={i} onClick={() => a.target ? setNav(a.target) : (() => { setScreen("setup"); setSetupStep(0); })()}
                    style={{ ...S.panel, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = S.amber}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1a2a38"}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ color: "#c0d0e0", fontSize: 11, fontWeight: "bold" }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...S.panel }}>
              <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", marginBottom: 8, letterSpacing: 1 }}>OPEN SOURCE & DISTRIBUTION</div>
              <div style={{ color: "#708898", fontSize: 11, lineHeight: 1.8 }}>
                MIT licensed. Download the full ISO (~200-500 GB) pre-crisis via torrent. Store on EMP-hardened USBs in Faraday cages.
                Core survival fits on 256 GB. One laptop serves your group via WiFi hotspot. Full source included — rebuild CivOS itself if needed.
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {["Puppy Linux Base", "100% FOSS", "MIT License", "Torrent/ISO", "Self-Replicating", "CollapseOS Included"].map(t => (
                  <span key={t} style={S.tag(S.amber)}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── ROADMAP ─── */}
        {nav === "roadmap" && roadmap && (
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>PERSONALIZED REBUILD ROADMAP</div>
            <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>
              {hw?.label} • {setupData.survivors} survivors • {setupData.resources.length} resource types • Radiation: {setupData.radiation}
            </div>
            {roadmap.map((item, i) => (
              <div key={i} onClick={() => setRoadmap(rm => rm.map((r, j) => j === i ? { ...r, done: !r.done } : r))}
                style={{
                  ...S.panel, marginBottom: 6, cursor: "pointer", opacity: item.done ? 0.4 : 1,
                  borderLeft: `3px solid ${item.priority === "CRITICAL" ? S.red : item.priority === "HIGH" ? S.amber : S.dim}`,
                  transition: "opacity 0.2s",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{
                      width: 16, height: 16, minWidth: 16, borderRadius: 2, marginTop: 1,
                      border: `2px solid ${item.done ? S.green : "#2a3a48"}`,
                      background: item.done ? S.green : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{item.done && <span style={{ color: "#060a0e", fontSize: 10, fontWeight: "bold" }}>✓</span>}</div>
                    <div>
                      <div style={{ color: item.done ? S.dim : "#e0e8f0", fontSize: 12, fontWeight: "bold", textDecoration: item.done ? "line-through" : "none" }}>{item.task}</div>
                      <div style={{ color: "#506878", fontSize: 11, marginTop: 4, lineHeight: 1.6 }}>{item.detail}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 65 }}>
                    <div style={{ fontSize: 10, color: S.dim }}>{item.day}</div>
                    <span style={S.tag(item.priority === "CRITICAL" ? S.red : item.priority === "HIGH" ? S.amber : S.dim)}>{item.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── KNOWLEDGE ─── */}
        {nav === "knowledge" && (
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>REBUILD TRACKS</div>
            <div style={{ color: S.dim, fontSize: 11, marginBottom: 8 }}>Step-by-step from Day 0 to industrial rebuilding.</div>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules, tags..."
              style={{ width: "100%", boxSizing: "border-box", ...S.panel, padding: "10px 14px", color: "#c8d6df", fontSize: 12, outline: "none", marginBottom: 12, borderColor: searchQuery ? S.amber : "#1a2a38" }} />
            {searchQuery.length > 1 && <div style={{ color: S.dim, fontSize: 10, marginBottom: 8 }}>{searchResults.length} results</div>}

            {(searchQuery.length > 1 ? [{ phase: "Results", color: S.cyan, modules: searchResults }] : REBUILD_TRACKS).map((track, ti) => (
              <div key={ti} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  {track.icon && <span>{track.icon}</span>}
                  <div style={{ color: track.color, fontSize: 13, fontWeight: "bold" }}>{track.phase}{track.title ? ` — ${track.title}` : ""}</div>
                  {track.priority && <span style={S.tag(track.color)}>{track.priority}</span>}
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {track.modules.map((mod, mi) => {
                    const key = `${ti}-${mi}`;
                    return (
                      <div key={key}>
                        <div onClick={() => setExpandedModule(expandedModule === key ? null : key)}
                          style={{ ...S.panel, cursor: "pointer", borderColor: expandedModule === key ? S.amber : "#1a2a38", transition: "border-color 0.2s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ color: expandedModule === key ? "#fff" : "#c0d0e0", fontSize: 12, fontWeight: "bold" }}>{mod.name}</div>
                              <div style={{ color: "#506878", fontSize: 11, marginTop: 3 }}>{mod.desc}</div>
                              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>{mod.tags.map(t => <span key={t} style={S.tag(track.color || S.cyan)}>#{t}</span>)}</div>
                            </div>
                            <div style={{ color: S.dim, fontSize: 10, textAlign: "right", minWidth: 50 }}>
                              {mod.steps} steps
                              <div style={{ marginTop: 4, transition: "transform 0.2s", transform: expandedModule === key ? "rotate(90deg)" : "none" }}>▶</div>
                            </div>
                          </div>
                        </div>
                        {expandedModule === key && (
                          <div style={{ ...S.panel, marginTop: 4, borderColor: `${S.amber}40` }}>
                            <div style={{ color: "#8098a8", fontSize: 11, lineHeight: 1.8 }}>
                              {mod.steps} procedures with safety warnings for nuclear contexts, material alternatives, and cross-links.
                            </div>
                            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                              <button onClick={() => { setNav("ai"); setAiInput(`Tell me about: ${mod.name}`); }} style={S.btn(true)}>Ask AI About This</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── AI MENTOR ─── */}
        {nav === "ai" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 2 }}>
              AI REBUILDER MENTOR {hw?.aiCapable ? "— ONLINE" : "— SIMULATED"}
            </div>
            <div style={{ color: S.dim, fontSize: 10, marginBottom: 10 }}>
              Local LLM fine-tuned on physics, engineering, chemistry, biology. Reasons from YOUR exact resources.
            </div>

            {aiMessages.length === 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: "#506878", fontSize: 10, marginBottom: 6 }}>TRY ASKING:</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {AI_EXAMPLES.map((ex, i) => (
                    <div key={i} onClick={() => setAiInput(ex.q)}
                      style={{ ...S.panel, padding: "8px 10px", cursor: "pointer", fontSize: 10, color: "#8098a8", lineHeight: 1.5 }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = S.amber}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#1a2a38"}>
                      <span style={S.tag(S.cyan)}>{ex.tag}</span>
                      <div style={{ marginTop: 4 }}>{ex.q}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={aiChatRef} style={{ flex: 1, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 8 }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%", ...S.panel,
                  background: msg.role === "user" ? "#1a2010" : "#0a1018",
                  borderColor: msg.role === "user" ? `${S.green}30` : "#1a2a38",
                  padding: "10px 14px",
                }}>
                  <div style={{ fontSize: 9, color: msg.role === "user" ? S.green : S.amber, marginBottom: 4, fontWeight: "bold", letterSpacing: 1 }}>
                    {msg.role === "user" ? "YOU" : "AI MENTOR"}
                  </div>
                  <div style={{ color: "#c0d0e0", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.text}</div>
                </div>
              ))}
              {aiTyping && (
                <div style={{ ...S.panel, alignSelf: "flex-start", padding: "10px 14px" }}>
                  <div style={{ fontSize: 9, color: S.amber, marginBottom: 4, fontWeight: "bold" }}>AI MENTOR</div>
                  <div style={{ color: S.dim }}>Reasoning through your situation<span style={{ animation: "civBlink 1s step-end infinite" }}>...</span></div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAiSend()}
                placeholder="Describe your situation, ask anything..."
                style={{ flex: 1, ...S.panel, padding: "12px 14px", color: "#c8d6df", fontSize: 12, outline: "none" }} />
              <button onClick={handleAiSend} style={S.btn(true)}>SEND</button>
            </div>
          </div>
        )}

        {/* ─── VAULT ─── */}
        {nav === "vault" && (
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>KNOWLEDGE VAULT</div>
            <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>Curated, cross-linked, tested — with safety warnings for nuclear contexts.</div>
            <div style={{ display: "grid", gap: 6 }}>
              {VAULT_CONTENTS.map((v, i) => (
                <div key={i} style={{ ...S.panel, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 24, minWidth: 36, textAlign: "center" }}>{v.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#e0e8f0", fontSize: 12, fontWeight: "bold" }}>{v.name}</div>
                    <div style={{ color: "#506878", fontSize: 11, marginTop: 2 }}>{v.desc}</div>
                  </div>
                  <div style={{ color: S.cyan, fontSize: 11, fontWeight: "bold", minWidth: 50, textAlign: "right" }}>~{v.size} GB</div>
                </div>
              ))}
            </div>
            <div style={{ ...S.panel, marginTop: 12, textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>Total: ~{vaultTotal} GB</div>
              <div style={{ color: S.dim, fontSize: 10, marginTop: 4 }}>Core survival: 256 GB USB. Full suite: 512 GB.</div>
            </div>
          </div>
        )}

        {/* ─── TOOLS ─── */}
        {nav === "tools" && (
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>MAKER + LAB SUITE</div>
            <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>Full CAD/CAM, physics engines, circuit simulators, manufacturing blueprints — all offline.</div>
            <div style={{ display: "grid", gap: 8 }}>
              {SOFTWARE_SUITE.map((cat, i) => (
                <div key={i} style={S.panel}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ color: S.amber, fontSize: 12, fontWeight: "bold" }}>{cat.cat}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {cat.tools.map(t => <span key={t} style={{ ...S.tag(S.cyan), padding: "4px 10px", fontSize: 11 }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ ...S.panel, marginTop: 12, borderColor: `${S.amber}30` }}>
              <div style={{ color: S.amber, fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>EXTREME MODE — CollapseOS / DuskOS</div>
              <div style={{ color: "#708898", fontSize: 11, lineHeight: 1.7 }}>
                If modern PCs die, CivOS includes Forth-based systems for Z80/8086/6502 processors — old calculators,
                industrial equipment, 1980s computers. Wire up a Z80 from a printer, connect serial terminal, run CollapseOS. Rebuild upward.
              </div>
            </div>
          </div>
        )}

        {/* ─── RADIATION ─── */}
        {nav === "radiation" && (
          <div>
            <div style={{ fontSize: 11, color: S.amber, fontWeight: "bold", letterSpacing: 2, marginBottom: 4 }}>RADIATION MONITORING</div>
            <div style={{ color: S.dim, fontSize: 11, marginBottom: 14 }}>Connect ESPGeiger for live data. Showing simulated readings.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8, marginBottom: 14 }}>
              <div style={{ ...S.panel, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: S.dim, letterSpacing: 2, marginBottom: 6 }}>CURRENT</div>
                <div style={{ fontSize: 30, fontWeight: "bold", color: radColor }}>{radLevel.toFixed(3)}</div>
                <div style={{ fontSize: 10, color: S.dim }}>mSv/hr</div>
              </div>
              <div style={{ ...S.panel, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: S.dim, letterSpacing: 2, marginBottom: 6 }}>STATUS</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: radColor }}>{radStatus}</div>
                <div style={{ fontSize: 10, color: S.dim }}>{radLevel < 0.1 ? "Safe for activity" : radLevel < 0.5 ? "Limit exposure" : "SHELTER NOW"}</div>
              </div>
              <div style={{ ...S.panel, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: S.dim, letterSpacing: 2, marginBottom: 6 }}>24HR DOSE</div>
                <div style={{ fontSize: 18, fontWeight: "bold", color: S.cyan }}>{(radLevel * 24).toFixed(2)}</div>
                <div style={{ fontSize: 10, color: S.dim }}>mSv/day</div>
              </div>
            </div>

            <div style={S.panel}>
              <div style={{ fontSize: 10, color: S.dim, marginBottom: 8 }}>24-HOUR HISTORY (mSv/hr)</div>
              <svg viewBox="0 0 600 120" style={{ width: "100%", height: "auto" }}>
                <line x1="0" y1="60" x2="590" y2="60" stroke="#1a2a38" strokeDasharray="4,4" />
                <text x="594" y="64" fill="#405060" fontSize="8" fontFamily="monospace">0.15</text>
                <line x1="0" y1="30" x2="590" y2="30" stroke="#2a1a18" strokeDasharray="4,4" />
                <text x="594" y="34" fill="#405060" fontSize="8" fontFamily="monospace">0.30</text>
                {radHistory.map((p, i) => {
                  const x = (i / 23) * 570 + 10;
                  const y = 110 - (p.mSv / 0.4) * 100;
                  const nextP = radHistory[i + 1];
                  return (
                    <g key={i}>
                      {nextP && <line x1={x} y1={y} x2={((i + 1) / 23) * 570 + 10} y2={110 - (nextP.mSv / 0.4) * 100} stroke={S.cyan} strokeWidth="1.5" opacity="0.7" />}
                      <circle cx={x} cy={y} r="2.5" fill={p.mSv > 0.3 ? S.red : p.mSv > 0.1 ? S.amber : S.green} />
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ ...S.panel, marginTop: 10 }}>
              <div style={{ fontSize: 10, color: S.amber, fontWeight: "bold", marginBottom: 8, letterSpacing: 1 }}>DOSE THRESHOLDS</div>
              {[
                { range: "< 0.1 mSv/hr", action: "Safe — normal activity", color: S.green },
                { range: "0.1–0.5 mSv/hr", action: "Caution — limit outdoor 2-4 hrs", color: S.amber },
                { range: "0.5–1.0 mSv/hr", action: "High — max 1 hr. Full decontam.", color: "#ff8800" },
                { range: "> 1.0 mSv/hr", action: "DANGER — shelter in place. 3ft earth.", color: S.red },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #0e1820" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, minWidth: 8 }} />
                  <div style={{ color: t.color, fontSize: 11, fontWeight: "bold", minWidth: 90 }}>{t.range}</div>
                  <div style={{ color: "#8098a8", fontSize: 11 }}>{t.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes civBlink { 50% { opacity: 0 } }
        @keyframes civFadeIn { to { opacity: 1 } }
        input::placeholder { color: #405060; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060a0e; }
        ::-webkit-scrollbar-thumb { background: #1a2a38; border-radius: 3px; }
      `}</style>
    </div>
  );
}
