# MOHMOS — Personal Portfolio & Web3 Hub

Welcome to the official repository of my personal portfolio and Web3 professional hub. This repository contains the complete source code for my live portfolio website: **[mohammedmuostafa.github.io/portfolio](https://mohammedmuostafa.github.io/portfolio/)**.

---

## 🚀 About the Project

This portfolio showcases my professional journey, technical expertise, and active contributions within the Web3 ecosystem and Discord infrastructure management. Built with a high-end **AAA Game Reveal Aesthetic** using a pure black background (`#000000`) and crimson red highlights (`#ff1e1e`), it features a rebuilt scroll-driven Home section intro sequence, scroll-controlled typewriter animation, and a seamless **Arabic / English bilingual switcher** (`🌐 العربية / English`).

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

## 🛠️ Rebuilt Home Section & Cinematic Flow Architecture

* **Frontend:** Single-file HTML5 structure utilizing Tailwind CSS CDN for modern responsive layouts.
* **Typography:** Google Fonts (**Plus Jakarta Sans** for English, **Cairo** for Arabic, and **JetBrains Mono** for numbers/code).
* **Icons:** Font Awesome 6.5.1 CDN.
* **Rebuilt Home Section Sequence:**
  * **Step 1 — Pure Black Screen:** Starts on 100% black screen (`#000000`) with no content, profile image, or navbar visible. Only displays a subtle **"Scroll Down"** indicator (`#intro-scroll-prompt`).
  * **Step 2 — Scroll Triggered 3D Zoom:** Scrolling initiates the 3D Zoom In of **MOHMOS** (`scale(0.4)` $\rightarrow$ `scale(1.4)`).
  * **Step 3 — Seamless Hero Reveal:** Before the name fully disappears (`p 0.35` to `0.55`), the profile image (360-degree rotation left) and information panel (slide right) enter together seamlessly.
  * **Step 4 — Initial Text Hidden:** All typewriter targets (`.hero-type-target`) start 100% empty / hidden. Text is unreadable until typing begins.
  * **Step 5 — Scroll-Controlled Typewriter:** Character progress (`p 0.55` to `0.85`) is 100% bound to scroll wheel movement. Scrolling forward types text; stopping scroll pauses typing instantly; scrolling back un-types text.
  * **Step 6 — Navbar Reveal & Seamless Section Flow:** Navbar smoothly fades in ONLY after Hero typing completes (`p > 0.85`). Standard scrolling continues seamlessly to `#about`, `#journey`, `#experience`, `#skills`, and `#connect`.
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
