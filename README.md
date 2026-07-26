# MOHMOS — Personal Portfolio & Web3 Hub

Welcome to the official repository of my personal portfolio and Web3 professional hub. This repository contains the complete source code for my live portfolio website: **[mohammedmuostafa.github.io/portfolio](https://mohammedmuostafa.github.io/portfolio/)**.

---

## 🚀 About the Project

This portfolio showcases my professional journey, technical expertise, and active contributions within the Web3 ecosystem and Discord infrastructure management. Built with a high-end **AAA Game Reveal Aesthetic** using a pure black background (`#000000`) and crimson red highlights (`#ff1e1e`), it features a 100% **scroll-driven interactive timeline engine** where the mouse wheel directly controls 360-degree image rotations, panel entries, typewriter character progress, and scene transitions, alongside a seamless **Arabic / English bilingual switcher** (`🌐 العربية / English`).

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

## 🛠️ Tech Stack & Scroll-Driven Timeline Architecture

* **Frontend:** Single-file HTML5 structure utilizing Tailwind CSS CDN for modern responsive layouts.
* **Typography:** Google Fonts (**Plus Jakarta Sans** for English, **Cairo** for Arabic, and **JetBrains Mono** for numbers/code).
* **Icons:** Font Awesome 6.5.1 CDN.
* **100% Scroll-Driven Animation Mechanics:**
  * **Zero Automatic Timers:** All `setTimeout` typing functions have been eliminated. The mouse wheel / scroll position acts as the master timeline slider (`totalProgress` 0.0 to 1.0).
  * **Scroll-Driven Typewriter Engine:**
    - Character progress computed via `charIndex = Math.floor(progress * fullText.length)`.
    - **Scroll fast:** Text types fast.
    - **Scroll slow:** Text types slowly.
    - **Stop scrolling:** Typing freezes instantly at that exact character.
    - **Scroll backward:** Text un-types character-by-character.
  * **Stage 0 Intro Zoom:** Scroll progress `0.0` to `0.12` controls the 3D Zoom In of **MOHMOS** (`scale(0.4)` $\rightarrow$ `scale(1.25)`) and transition to blackout.
  * **Phase 1 Panel Entry:** Left image 360-degree rotation (`rotate(-360deg)` $\rightarrow$ `rotate(0deg)`) and Right panel slide are mapped to scene progress `0.0` to `0.22`.
  * **Phase 2 Typewriter Phase:** Character progress mapped to scene progress `0.22` to `0.85`.
  * **Phase 3 Fade Out:** Scene smoothly fades out to pure black before the next section enters (`0.85` to `1.0`).
  * **Navbar Delay:** `#main-navbar` smoothly fades in *only* after Hero typewriter progress completes (`totalProgress > 0.25`).
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
