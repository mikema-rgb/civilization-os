<p align="center">
  <img src="public/logo.svg" width="80" alt="CivOS Logo" />
</p>

<h1 align="center">Civilization OS</h1>

<p align="center">
  <strong>The open-source, offline-first platform to rebuild civilization after collapse.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#what-is-civos">What Is CivOS</a> •
  <a href="#features">Features</a> •
  <a href="#the-knowledge-vault">Knowledge Vault</a> •
  <a href="#hardware-requirements">Hardware</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/offline-100%25-blue?style=flat-square" alt="100% Offline" />
  <img src="https://img.shields.io/badge/status-alpha-orange?style=flat-square" alt="Alpha" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>

---

## The Problem

In a total civilizational collapse — nuclear war, pandemic, solar EMP — survivors default to subsistence farming and oral tradition, losing centuries of accumulated knowledge. Existing resources are either static libraries with no intelligence, survival apps that require internet, or scattered PDFs that are impossible to search under stress.

**The first group to organize wins.** Speed of coordination equals survival advantage.

## What Is CivOS

CivOS (Civilization OS) is a **fully offline, AI-powered civilization accelerator** designed to be downloaded *today* and activated after any collapse scenario. It turns survivors with a salvaged laptop into a rapid-rebuild team: part encyclopedia, part expert tutor, part virtual R&D lab, part project manager.

This isn't a survival app. It's a **complete platform to leapfrog from stone age to industrial age 2.0** using whatever local resources survive.

```
┌─────────────────────────────────────────────────────────────┐
│                    CIVILIZATION OS v1.0                      │
│                                                             │
│   Download today.  Store in a Faraday cage.                 │
│   Boot after collapse.  Rebuild faster than anyone else.    │
│                                                             │
│   "From ashes, we rebuild — faster."                        │
└─────────────────────────────────────────────────────────────┘
```

### Core Design Principles

- **Offline-first and EMP-resilient** — Download once via torrent/ISO. Store on rugged USBs or optical media in Faraday cages. Runs entirely from RAM or minimal storage. Zero cloud dependencies.
- **Hardware-agnostic** — Works on a modern laptop, a 20-year-old PC, a smartphone, or even scrap 8086 hardware via CollapseOS/DuskOS integration.
- **AI as force multiplier** — Local LLM (no cloud) that reasons step-by-step from your exact resources. "I have these scrap wires and a car battery — build me a generator?"
- **Curated and practical** — Not raw Wikipedia dumps. Prioritized, cross-linked, tested knowledge focused on *doing*, with safety warnings for nuclear/fallout contexts.
- **Self-replicating** — Full source code included. You can rebuild CivOS itself from scratch.
- **100% open source** — MIT licensed. Built on proven FOSS. Community-improvable before any crisis.

---

## Quick Start

### Run the Web Interface (Development)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/civilization-os.git
cd civilization-os

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The `dist/` folder contains a fully self-contained static site that works offline — no server required. Open `dist/index.html` directly in any browser.

### Deploy to USB (Offline Kit)

```bash
# Build the static site
npm run build

# Copy to USB drive (replace /mnt/usb with your mount point)
cp -r dist/ /mnt/usb/civOS/
```

The entire web interface is a single static bundle. No internet required to use it.

---

## Features

### 🗺️ Personalized Rebuild Roadmap

On first boot, CivOS runs a **Situation Assessment**:

1. **Hardware Triage** — What device are you running on? (Determines AI availability)
2. **Survivor Count** — How many people? (Adjusts team roles and governance templates)
3. **Resource Inventory** — What do you have? Solar panels, car batteries, seeds, tools...
4. **Radiation Status** — Current exposure levels (Adjusts shelter/scavenging priorities)

CivOS generates a **personalized 30/90/365-day rebuild plan** tailored to your exact situation. Every recommendation adapts: no power source? Emergency generator is Priority #1. Have seeds? Start planting fast-calorie crops immediately.

### 🧠 AI Rebuilder Mentor

The game-changer for technological superiority. A local LLM fine-tuned on physics, engineering, chemistry, biology, and rebuilding knowledge:

- **Diagnose problems** — "My alternator is fried — here's how to rewind it with copper from power lines"
- **Simulate & optimize** — Physics/chemistry models via SciPy. "Prioritize these 5 projects with my 4 survivors and scrap inventory"
- **Teach interactively** — Step-by-step tutorials adapted to your exact materials
- **Radiation reasoning** — "My Geiger reads 0.5 mSv/hr. Is it safe to scavenge?" → Detailed safety protocols

Other groups rediscover the wheel slowly. You have an expert consultant that never sleeps and cross-references 10,000 years of knowledge instantly.

> **Current status:** The web interface ships with a simulated AI mentor demonstrating the interaction model. The full local LLM stack (Ollama + quantized Llama 3.2) is planned for the bootable ISO distribution. See [Roadmap](#roadmap).

### 📖 Knowledge Vault (~197 GB)

| Module | Size | Contents |
|--------|------|----------|
| Wikipedia (Kiwix) | ~90 GB | Full English Wikipedia, offline searchable |
| iFixit Repair Manuals | ~15 GB | Thousands of device/machine repair guides |
| Medical Library | ~8 GB | Surgery, pharmacology, radiation medicine, field guides |
| Engineering Corpus | ~12 GB | Metallurgy, EE, mechanical, chemical engineering |
| Agriculture & Botany | ~6 GB | Permaculture, seed saving, regional crop guides |
| Project Gutenberg | ~8 GB | 70,000+ texts including historical tech manuals |
| OpenStreetMap | ~25 GB | Full offline world maps with navigation |
| Manufacturing Blueprints | ~4 GB | 3D-printable designs: turbines, engines, radios, pumps |
| Nuclear Survival Guides | ~2 GB | FEMA, ORNL, Kearny — tested fallout/EMP protocols |
| AI Models (Quantized) | ~14 GB | Llama 3.2/3.3 fine-tuned for rebuild reasoning |

Core survival set fits on a **256 GB USB**. Full suite on 512 GB.

### 📚 Rebuild Tracks

Step-by-step progressions inspired by Lewis Dartnell's *The Knowledge* + modern engineering:

**Phase 0: Immediate Survival (Day 0–30)**
Radiation detection, water purification, emergency shelter, first aid, group organization

**Phase 1: Stabilization (Month 1–6)**
Food production, energy from junk, sanitation, basic chemistry, communications revival

**Phase 2: Industrial Rebuilding (Year 1+)**
Metallurgy, machine tools, medicine, advanced energy, electronics, computing bootstrap

### ☢️ Radiation Monitoring Dashboard

- Live sensor integration (ESPGeiger and compatible hardware)
- 24-hour dose history with threshold alerts
- Decontamination protocols
- Fallout modeling (wind/current predictions)
- Safe scavenging zone mapping

### 🔧 Maker + Lab Suite

Full offline engineering toolkit:

| Category | Tools |
|----------|-------|
| CAD/Design | FreeCAD, OpenSCAD, KiCad, LibreCAD |
| Simulation | SciPy/NumPy, Circuit Sim, FEA Engine |
| Programming | Python 3, GCC/G++, Forth, AVR/ARM ASM |
| Communications | GNU Radio, BATMAN Mesh, Packet Radio |
| Radiation | ESPGeiger Interface, Fallout Mapper, Dose Logger |
| Productivity | SQLite DB, Task Tracker, Inventory System |

### 📡 Communications & Mesh Networking

- Mesh networking (BATMAN) for local survivor networks via salvaged WiFi/LoRa
- Software-defined radio (GNU Radio) + build guides for ham/shortwave from junk
- One laptop serves an entire group via local WiFi hotspot mode

### ⚡ CollapseOS / Extreme Mode

If modern PCs die completely, CivOS includes **Forth-based operating systems** (CollapseOS/DuskOS) that run on Z80/8086/6502 processors — found in old calculators, industrial equipment, and 1980s computers. You can bootstrap computing from literal scrap.

---

## Hardware Requirements

CivOS is designed to run on **whatever survives**:

| Tier | Hardware | RAM | AI Mentor | Notes |
|------|----------|-----|-----------|-------|
| 🟢 Modern | Laptop/PC (2015+) | 8–16 GB | ✅ Full | Best experience. Full AI reasoning. |
| 🟡 Legacy | Old PC (2005-2015) | 2–4 GB | ❌ Text only | Knowledge vault + tools work fully |
| 🟡 Mobile | Smartphone/Tablet | 2–6 GB | ❌ Text only | Runs web interface in browser |
| 🟠 Micro | Raspberry Pi / SBC | <1 GB | ❌ Text only | Can serve as mesh network node |
| 🔴 Extreme | Z80/8086 scrap | <64 KB | ❌ | CollapseOS mode — Forth-based |

---

## Project Structure

```
civilization-os/
├── public/
│   └── logo.svg              # Project logo
├── src/
│   ├── App.jsx                # Main CivOS application
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Build configuration
├── LICENSE                    # MIT License
├── CONTRIBUTING.md            # Contribution guidelines
├── CODE_OF_CONDUCT.md         # Community standards
└── README.md                  # This file
```

---

## Roadmap

CivOS is currently an **alpha-stage interactive prototype**. Here's what's planned:

### Phase 1 — Web Interface (Current)
- [x] Boot sequence and situation assessment flow
- [x] Personalized rebuild roadmap generator
- [x] Knowledge vault browser with rebuild tracks
- [x] AI mentor chat interface (simulated)
- [x] Radiation monitoring dashboard
- [x] Maker/lab suite catalog
- [ ] Persistent state (IndexedDB for progress tracking)
- [ ] PWA support (installable, works offline)
- [ ] Print-friendly procedure exports

### Phase 2 — Knowledge Integration
- [ ] Kiwix/ZIM reader integration for offline Wikipedia
- [ ] OpenStreetMap tile renderer
- [ ] Searchable iFixit and medical databases
- [ ] Manufacturing blueprint viewer (STL/STEP)
- [ ] Offline video tutorials (compressed)

### Phase 3 — AI Mentor (Local LLM)
- [ ] Ollama integration for local model serving
- [ ] Fine-tuned Llama 3.2/3.3 rebuild model
- [ ] Vision support (analyze photos of resources/readings)
- [ ] Resource-aware reasoning ("given what you have...")
- [ ] Physics/chemistry simulation integration

### Phase 4 — Bootable ISO
- [ ] Lightweight Linux base (Puppy Linux/antiX derivative)
- [ ] Boot from USB/DVD with full GUI
- [ ] WiFi hotspot mode for group access
- [ ] CollapseOS/DuskOS integration for scrap hardware
- [ ] EMP-hardened distribution packaging
- [ ] Torrent distribution network

### Phase 5 — Community & Expansion
- [ ] Mesh network auto-discovery
- [ ] Inter-settlement communication protocols
- [ ] Community knowledge contribution pipeline
- [ ] Regional adaptation packs (climate, flora, resources)
- [ ] Multi-language support

---

## Distribution Strategy

**Pre-crisis:**
- Free ISO download (~200-500 GB depending on modules)
- Torrent distribution for resilience
- Physical media kits (USB + printed quick-start card)
- Encourage multiple backup copies in Faraday cages

**Post-crisis:**
- Plug in → Boot → Situation assessment → Personalized roadmap
- One device serves an entire group via WiFi hotspot
- Scales to inter-settlement mesh networks as infrastructure rebuilds

---

## Contributing

We welcome contributions from everyone. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**High-impact areas where help is needed:**

- 🧠 **AI/ML** — Fine-tuning rebuild-focused LLM, optimizing for low-RAM inference
- 📚 **Knowledge curation** — Reviewing, structuring, and testing survival/rebuild procedures
- 🐧 **Linux/OS** — Building the bootable ISO, driver support, EMP hardening
- 📡 **Radio/Networking** — Mesh networking, SDR integration, packet radio
- ☢️ **Nuclear science** — Radiation modeling, fallout prediction, dosimetry
- 🏥 **Medicine** — Field medicine procedures, pharmacology from natural sources
- ⚙️ **Engineering** — CAD templates, manufacturing procedures, materials science
- 🎨 **Design/UX** — Making the interface usable under extreme stress and poor conditions
- 🌍 **Translation** — Multi-language support for global distribution
- 🧪 **Testing** — Actually building things from the procedures (IRL testing)

### How to Contribute

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/civilization-os.git
cd civilization-os
npm install
npm run dev

# Create a branch for your feature
git checkout -b feature/your-feature-name

# Make your changes, then submit a PR
```

---

## Philosophy

> *"The best time to prepare was yesterday. The second best time is now."*

Existing prepper resources are either static libraries (great but unsearchable under stress), survival apps (useless without internet), or scattered PDFs (impossible to cross-reference). CivOS combines curated knowledge + AI reasoning + engineering tools into a single platform that adapts to your exact post-collapse reality.

A small group with CivOS could:
- Detect and avoid radiation hotspots **immediately**
- Build reliable power and communications in **weeks**
- Scale food production and basic manufacturing in **months**
- Rebuild electronics and computing in **1-2 years**

Without it? Survivors default to subsistence and oral tradition — losing centuries of progress. With it? You become the seed of a new technological civilization.

**Humanity's backup drive — literally.**

---

## Acknowledgments

CivOS builds on the shoulders of giants:

- [Lewis Dartnell](https://www.lewisdartnell.com/) — *The Knowledge: How to Rebuild Civilization in the Aftermath of a Cataclysm*
- [CollapseOS](https://collapseos.org/) — Computing from scrap hardware
- [Kiwix](https://www.kiwix.org/) — Offline Wikipedia and knowledge access
- [Ollama](https://ollama.ai/) — Local LLM serving
- [OpenStreetMap](https://www.openstreetmap.org/) — Open map data
- [iFixit](https://www.ifixit.com/) — Repair knowledge for everyone
- [Project Gutenberg](https://www.gutenberg.org/) — Free classic texts
- [GNU Radio](https://www.gnuradio.org/) — Open-source SDR toolkit

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Use it. Fork it. Improve it. Store it in a Faraday cage. Share it with everyone you know.

---

<p align="center">
  <strong>⚡ CIVILIZATION OS ⚡</strong><br/>
  <em>From ashes, we rebuild — faster.</em>
</p>
