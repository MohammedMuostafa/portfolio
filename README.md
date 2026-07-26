# MOHMOS — Personal Portfolio & Web3 Hub

Welcome to the official repository of my personal portfolio and Web3 professional hub. This repository contains the complete source code for my live portfolio website: **[mohammedmuostafa.github.io/portfolio](https://mohammedmuostafa.github.io/portfolio/)**.

---

## 🚀 About the Project

This portfolio showcases my professional journey, technical expertise, and active contributions within the Web3 ecosystem and Discord infrastructure management. Built with a high-end **AAA Game Reveal Aesthetic** using a pure black background (`#000000`) and crimson red highlights (`#ff1e1e`), it features an Apple-grade interactive presentation powered by **Lenis inertial smooth scrolling**, **GSAP + ScrollTrigger timeline scrubbing**, **SplitType character parsing**, ambient aurora particle lighting, and a seamless **Arabic / English bilingual switcher** (`🌐 العربية / English`).

---

## 👨‍💻 About Mohamed Mostafa (MOHMOS)

> *"I am Mohamed Mostafa (MOHMOS), a 20 year old Computer Science student with a strong passion for Discord communities, blockchain technology, and the Web3 ecosystem."*

* **Current Role:** Protocol Lead @ **Lit Clinic (LitVM Ecosystem)** — leading written protocol communication, technical planning, product discussions, system design conversations, and Discord infrastructure.
* **Journey Milestones:**
  * **Lit Clinic (2026–Present):** Protocol Lead & Discord Infrastructure Specialist.
  * **OnChain Outlaws:** Core Contributor — community organization, member support pipelines, and project coordination.
  * **Bag Guild (2022–2025):** Contributor & Community Leader — building, configuring, and managing Discord infrastructure, ticket support systems, anti-raid security, and moderation workflows.
* **Core Expertise:** Discord Infrastructure (Server layout optimization, role hierarchy & permission trees, anti-raid security, bot configuration, webhooks, ticket support workflows), Community Operations, and Written Protocol Communication.
* **Education & Goals:** Bachelor's Degree in Computer Science (Undergraduate — In Progress), focusing on software engineering, networking, algorithms, and decentralized systems. Long-term goal: **Blockchain Developer**.

---

## 🛠️ Technology Stack & Refined Architecture

* **Frontend:** Single-file HTML5 structure utilizing Tailwind CSS CDN for modern responsive layouts.
* **Inertial Smooth Scroll:** **Lenis 1.0.42** (Studio Freight / Darkroom Engineering) for fluid, Apple-grade wheel scroll momentum (`lerp: 0.08`).
* **Animation Engines:** **GSAP 3.12.5** and **ScrollTrigger** for 60fps sub-pixel timeline scrubbing, smooth easing (`power3.out`), and zero layout reflows.
* **Text Parser:** **SplitType 0.3.4** for discrete character-by-character typewriter animation (`span.char`).
* **Typography:** Google Fonts (**Plus Jakarta Sans** for English, **Cairo** for Arabic, and **JetBrains Mono** for numbers/code).
* **Icons:** Font Awesome 6.5.1 CDN.
* **Cinematic Feature Set:**
  * **Stage 0 Intro Zoom:** Pure black screen + scroll prompt $\rightarrow$ 3D Zoom In of **MOHMOS** (`scale(0.4)` $\rightarrow$ `scale(1.4)`).
  * **Elegant Depth & Blur Entrance:** Replaced mechanical side sliding with subtle depth, opacity, scale (`0.92` $\rightarrow$ `1.0`), and Gaussian blur (`10px` $\rightarrow$ `0px`) entrance reveals.
  * **True Character Typewriter:** SplitType splits headings and paragraphs into discrete characters. Scrolling reveals characters one by one with a blinking crimson cursor (`|`). Sentence 1 finishes 100% before Sentence 2 starts.
  * **Scene Completion State Memory:** Once a scene is revealed, it is tracked in `completedScenes`. Scrolling back upward later maintains 100% visible text without re-triggering typing or hiding content.
  * **Multi-Layered Ambient Aurora Canvas:** Renders floating red dust motes, subtle star motes, and soft glowing red radial aurora lights (`radial-gradient(circle, rgba(255, 30, 30, 0.12), transparent 70%)`).
  * **Delayed Navbar:** `#main-navbar` smoothly fades in *only* after Hero entrance completes (`totalP > 0.09`).
* **Localization:** Vanilla JavaScript bilingual switcher (`🌐 العربية / English`) supporting full RTL direction adjustment (`dir="rtl"`).
* **Hosting:** Deployed via **GitHub Pages**.

---

## 🌐 Connect & Social Platforms

| Platform | Handle / URL | Link |
| :--- | :--- | :--- |
| **Discord** | `mohmos` | 1-Click Copy in Portfolio |
| **Lit Clinic Website** | `litclinic.xyz` | [Visit Site](https://litclinic.xyz) |
| **Linktree** | `moh.mos` | [View Linktree](https://linktree.com/moh.mos) |
| **GitHub** | `MohammedMuostafa` | [View GitHub](https://github.com/MohammedMuostafa) |
| **X (Twitter)** | `@mohmos` | [Follow on X](https://x.com/mohmos) |
| **Telegram** | `@MOH-MOS` | [Message on Telegram](https://t.me/MOH-MOS) |
| **YouTube** | `@MOH-MOS` | [Subscribe on YouTube](https://www.youtube.com/@MOH-MOS) |
| **Kick** | `moh-mos` | [Watch on Kick](https://kick.com/moh-mos) |

---

## 📄 License & Attribution

© 2026 **Mohamed Mostafa (MOHMOS)**. All rights reserved. Source code hosted open-source on [GitHub](https://github.com/MohammedMuostafa/portfolio).
