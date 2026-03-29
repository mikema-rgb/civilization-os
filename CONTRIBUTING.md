# Contributing to Civilization OS

Thank you for your interest in contributing to CivOS. This project exists because
the sum of human knowledge should be preservable, accessible, and actionable —
especially when it matters most.

Every contribution moves this forward, whether it's fixing a typo, adding a
rebuild procedure, or building out the bootable ISO.

## How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/civilization-os.git
cd civilization-os
npm install
npm run dev
```

### 2. Pick an Area

Look at the [open issues](https://github.com/YOUR_USERNAME/civilization-os/issues)
or choose from the high-impact areas below:

| Area | What's Needed | Label |
|------|---------------|-------|
| AI/ML | Fine-tuning rebuild LLM, low-RAM inference optimization | `ai` |
| Knowledge | Reviewing, structuring, testing survival/rebuild procedures | `knowledge` |
| Linux/OS | Bootable ISO, driver support, EMP hardening | `os` |
| Radio/Networking | Mesh networking, SDR integration, packet radio | `comms` |
| Nuclear Science | Radiation modeling, fallout prediction, dosimetry | `radiation` |
| Medicine | Field medicine, pharmacology from natural sources | `medical` |
| Engineering | CAD templates, manufacturing procedures, materials science | `engineering` |
| Design/UX | Interface usability under stress and poor conditions | `design` |
| Translation | Multi-language support | `i18n` |
| IRL Testing | Actually building things from the procedures | `tested` |

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 4. Make Your Changes

- Follow the existing code style
- Test your changes locally with `npm run dev`
- If adding knowledge content, cite your sources
- If adding procedures, include safety warnings where relevant

### 5. Submit a Pull Request

- Write a clear description of what your PR does and why
- Reference any related issues
- Include screenshots if the change is visual

## Knowledge Contribution Guidelines

If you're contributing rebuild procedures, survival knowledge, or technical guides:

### Format

Each module should include:

- **Clear title** and category tags
- **Summary** (1-2 sentences on what this covers)
- **Prerequisites** (what modules should be completed first)
- **Materials needed** (with alternatives for scarcity)
- **Step-by-step procedure** (numbered, clear, unambiguous)
- **Safety warnings** (especially for nuclear/fallout contexts)
- **Verification** (how to know it worked)
- **Sources** (where this knowledge comes from)

### Quality Standards

- **Tested over theoretical** — Procedures that someone has actually done are
  worth 10x more than theoretical descriptions. If you've built a forge, purified
  water, or wound copper coils, your lived experience is invaluable.
- **Scarcity-aware** — Always provide alternatives. "If you don't have X, use Y."
  Assume the reader has limited resources.
- **Safety-first** — Nuclear, chemical, electrical, and medical procedures must
  include clear danger warnings. Err on the side of caution.
- **Cross-linked** — Reference related modules. "See: Water Purification for
  clean water needed in this step."

### What We're NOT Looking For

- Raw Wikipedia dumps or unprocessed text
- Weapons manufacturing procedures (CivOS is about building, not destroying)
- Unverified "survival hacks" from social media
- Content that requires internet access to be useful

## Code Standards

- React functional components with hooks
- Inline styles using the existing `S` style system (for single-file portability)
- No external CSS frameworks
- All features must work 100% offline
- Keep bundle size minimal — every byte matters on a USB stick

## Reporting Issues

Use the [issue templates](https://github.com/YOUR_USERNAME/civilization-os/issues/new/choose)
for bug reports, feature requests, or knowledge corrections.

For security vulnerabilities, email security@civOS.org instead of opening a
public issue.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). In short: be respectful, be
constructive, remember we're all working toward the same goal.

## License

By contributing, you agree that your contributions will be licensed under the
MIT License.

---

*"The best time to prepare was yesterday. The second best time is now."*
