# MOHMOS — Personal Portfolio & Web3 Hub

Welcome to the official repository of my personal portfolio and Web3 professional hub. This repository contains the complete source code for my live portfolio website: **[mohammedmuostafa.github.io/portfolio](https://mohammedmuostafa.github.io/portfolio/)**.

---

## 🚀 About the Project

This portfolio showcases my professional journey, technical expertise, and active contributions within the Web3 ecosystem and Discord infrastructure management. Built with a high-end **AAA Game Reveal Aesthetic** using a pure black background (`#000000`) and crimson red highlights (`#ff1e1e`), it features a dramatic cinematic intro, scene-by-scene 360-degree rotating image entries, a sequential typewriter text engine, and a seamless **Arabic / English bilingual switcher** (`🌐 العربية / English`).

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

## 🛠️ Tech Stack & Fixed Cinematic Architecture

* **Frontend:** Single-file HTML5 structure utilizing Tailwind CSS CDN for modern responsive layouts.
* **Typography:** Google Fonts (**Plus Jakarta Sans** for English, **Cairo** for Arabic, and **JetBrains Mono** for numbers/code).
* **Icons:** Font Awesome 6.5.1 CDN.
* **AAA Cinematic Bug Fixes & Mechanics:**
  * **Hero & Navbar Synchronization:** Navbar remains completely hidden (`display: none; opacity: 0;`) during intro and Hero animations. It smoothly fades in *only* after the Hero sequence completes 100%.
  * **Panel Settlement & Typewriter Sync:** Text targets (`.typewriter-target`) are hidden until Left (360 photo) and Right (info panel) CSS transitions settle (`transitionend`).
  * **Promise-Based Sequential Typewriter:** Async queue (`typeElementPromise`) ensuring Heading 1 finishes 100% $\rightarrow$ Paragraph 1 finishes 100% $\rightarrow$ Paragraph 2 finishes 100% with a single blinking crimson cursor (`|`). Includes `Esc` key bypass.
  * **Smooth 360 Spin & Floating Isolation:** Entry rotation (`transform: rotate(-360deg)` $\rightarrow$ `rotate(0deg)`) runs without jitter; continuous floating orbit activates *after* entry settles.
  * **Zero-Jump Scene Alignment:** SceneController ensures clean vertical snap alignment without extra blank gaps or jumping.
  * **Ambient Particles:** Lightweight HTML5 Canvas particle overlay (`#particle-canvas`) rendering subtle floating dark-red dust motes.
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
