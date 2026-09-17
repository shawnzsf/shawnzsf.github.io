---
# ============================================================
# SITE CONFIGURATION — edit your personal info here
# ============================================================

# Identity
name_en: "Shoufeng Zhang"
name_jp: "張壽峰"
title: "Electrical & Computer Engineering"
affiliation: "University of Hong Kong"

# Sidebar quick facts
location: "Beijing · Hong Kong"
status: "Open to collaboration"
focus: "Robotics · Hardware · ML Systems"

# Landing Hero Mission Statement
hero_kicker: "SYSTEMS · STREETS · STORIES"
hero_title: "Along the Way"
hero_thesis: "I am drawn to beauty, spare elegance, the way a few symbols can hold an entire slice of reality. I am equally drawn to complexity, the patience of decomposing systems to their atoms, then the triumph of constructing something whole from first principles. Beyond, I observe. Photographing, reading, letting the inner lives of others resonate against my own."

# Vertical decoration text (Japanese)
vertical_deco: "海濤悲湧深藍色"

# Contact links
email: "zhangshoufeng@connect.hku.hk"
github: "https://github.com/shawnzsf"
github_handle: "@shawnzsf"
rednote: "https://www.xiaohongshu.com/user/profile/600952fd00000000010080c1"
rednote_label: "Photography & more"

# Quote in About section
quote: "莫聽穿林打葉聲，何妨吟嘯且徐行。竹杖芒鞋輕勝馬，誰怕？一蓑煙雨任平生。"

# Navigation labels (with Japanese numerals)
nav:
  - { id: about,      num: "壹", label: "About" }
  - { id: education,  num: "貳", label: "Education" }
  - { id: experience, num: "叁", label: "Experience & Works" }
  - { id: skills,     num: "肆", label: "Skills" }
  - { id: contact,    num: "伍", label: "Contact" }
---

<!-- ============================================================
     ABOUT
     ============================================================ -->

## About

I'm a sophomore undergraduate student at the **University of Hong Kong**, under the Faculty of Engineering Elite Programme, majoring in Electronic Engineering with a minor in Computer Science. Prior to university, I studied at Beijing 101 High School.

I currently work on autonomous robotics. My broader interests span hardware-software co-design, edge deployment of intelligent systems, and the system-level questions that arise when autonomous systems leave controlled environments and meet the real world. I am drawn to research at the intersection of perception, planning, and the hardware constraints that make both hard.

> **Interests**
> - Robotics & Embodied AI
> - Computing Hardware
> - Systems & Security

> **Beyond Academics**
> I am interested in Photography (especially streets). Some of the works are published through Visual China Group and so, some of them are available on RedNote. I will try migrate more of them into gallery here in the future.


<!-- ============================================================
     EDUCATION
     ============================================================ -->

## Education

### 2025.9 – Present · The University of Hong Kong
- **Role:** B.Eng., Engineering Elite Programme, Electronic Engineering (Minor: Computer Science)
- CGPA: 3.96/4.3 (Major CGPA: 4.15/4.3)
- 2025-26 The University of Hong Kong Entrance Scholarship
- 2025-26 Martin Scholarship, St. Johns College, The University of Hong Kong
- Core Courses: Data Structures & Algorithms, Computer Organization, Linear Algebra, Multivariable Calculus, Object-Oriented Programming

### 2024.7 · Carnegie Mellon University
- **Role:** Summer Session
- QPA: 4.0 / 4.0
- Core Courses: Principles of Imperative Computation (C, invariants, memory management), Concepts of Mathematics (Discrete Math)

### 2022.9 – 2025.7 · Beijing 101 High School
- **Role:** AP & IB Diploma Programme

<!-- ============================================================
     EXPERIENCE & WORKS (merged)
     ============================================================ -->

## Experience

### 2026.7 – Present · MaRS Lab, HKU — Embodied AI & World Models
- **Role:** Undergraduate Research Assistant (Supervisor: Prof. Fu Zhang; Mentor: Siqi Liang)
- **Tags:** Embodied AI, Robotics, World Models, VLN
- Formulating predictive world-action models and Vision-Language-Navigation (VLN) policies via [SparseVideoNav](https://opendrivelab.com/SparseVideoNav/) (predictive video generation world model) for zero-shot navigation across complex, dynamic, unmapped environments.
- Integrating real-time perception-action loops and predictive video navigation policies onto quadrupedal (Unitree Go2) and humanoid robotics platforms.

### 2025.12 – Present · HKU Innovation Wing — Autonomous Robotics & Spatial Perception
- **Role:** Research Assistant (Part-time & Full-time Summer 2026; Advisor: Dr. Lei Yang)
- **Tags:** Autonomous Robotics, 3D Spatial Perception, High-Performance Systems, SLAM
- **3D Spatial Perception & Tracking** [GitHub](https://github.com/shawnzsf/inspection_grounding): Built an end-to-end perception pipeline lifting open-vocabulary 2D detections into metric 3D bounding boxes via LiDAR–camera sensor fusion and frustum clustering; formulated metric spatio-temporal association to track 158 persistent infrastructure assets across 1,100+ paired inspection frames.
- **High-Performance C++ Engine**: Re-architected mapping and grounding into a standalone compiled C++ pipeline decoupled from ROS2 message deserialization overhead. Slashed end-to-end dataset processing time from 30 minutes to **under 1 minute** (>30× speedup) and cut peak memory footprint from **>32GB (resolving live OOM crashes) to <3.5GB** across 1,100+ image pairs during operational metro station trials.
- **Autonomy & MTR Field Deployment**: Integrated Nav2, FAST-LIO (LiDAR-inertial odometry), and scan-matching localization; eliminated odometry drift across featureless station floors and dynamic crowd occlusions during operational MTR field trials.
- **Museum Guide Robot** (2025.12 – 2026.5): Built the full autonomy stack for a museum guide robot. Mitigated corridor drift and dynamic crowd occlusions by integrating FAST-LIO odometry, ICP localization, and Nav2 path planning.

### 2025.12 – 2026.5 · HKU Systems Lab — Multi-Agent Systems & Program Reasoning
- **Role:** Undergraduate Research Assistant (Advisor: Prof. Hao Chen)
- **Tags:** Multi-Agent Systems, LLM Reasoning, Program Analysis
- **RE-Agent: LLM-Enhanced Reverse Engineering Agent** [GitHub](https://github.com/shawnzsf/Reverse-Engineering-Agent): Built an automated binary analysis agent translating expert human reverse-engineering workflows into a 3-phase automated pipeline (Triage & Hypothesis Generation, Context Assembly & Naming, Write-back & Refinement) grounded in Ghidra via Model Context Protocol (Ghidra MCP). Employs 5-layer non-linear BFS context expansion with `tiktoken` budget management, raising Exact Match from **7.8% to 71.2%** (Token F1 from **28.4% to 74.1%**, a **9.1× gain**) across 172 stripped functions from 50 binaries.
- **INFRASCOPE: Vulnerability Variant Detection in AI Infra** ([arXiv:2605.20051](https://arxiv.org/abs/2605.20051), under review at USENIX Security 2027): Co-authored a reference-driven multi-agent framework that extracts transferable vulnerability semantics from known disclosures to detect variants across AI infrastructure. Analyzed 688 GitHub repositories and 251 disclosures, and evaluated across 20 production AI infra repositories, uncovering **20+ vulnerabilities** with **11 vendor-acknowledged** and **4 assigned CVEs**.

### 2024 · Hardware-Accelerated 1-Bit Quantization Using PyRTL
- **Role:** Project Leader
- **Tags:** PyRTL, System Design, Quantization
- Designed a 1-bit MAC unit for a Systolic Array with PyRTL for ternary-weight XNOR-Net inference, achieving 95% area reduction and 76% critical path reduction compared to a standard full-precision matrix multiplication MAC unit.

### 2024 · Yishengyixin Program, Chinese Academy of Sciences
- **Role:** Participant
- **Tags:** Verilog, Vivado, C, RISC-V
- Explored computer architecture and systems. Designed circuits with Verilog/Vivado for RV32 instructions and built a simplified RV32I emulator in C.

<!-- ### 2023 · AI Research Topics Analysis Using LDA and LDAvis
- **Role:** Project Leader
- **Tags:** LDA, NLP, Data Analysis
- Project under the Science Talent Program, China Association for Science and Technology. Applied LDA and LDAvis to analyze trending AI topics from arXiv data. -->

<!-- ============================================================
     SKILLS
     ============================================================ -->

## Skills

### Robotics & Perception
- ROS2
- FAST-LIO / LiDAR-Inertial Odometry
- LiDAR-Camera Sensor Fusion
- Point Cloud SLAM & State Estimation
- Nav2 Path Planning & Navigation

### Software & ML Systems
- Modern C++ (C++17/20) & Python
- PyTorch
- Vision-Language Models (VLMs)

### Hardware & Systems
- Linux / Git / Docker
- Verilog / SystemVerilog

### Exploring
- Embodied AI / World-Action Models
- Vision-Language-Action (VLA) Navigation
- High-Performance Autonomous Systems

<!-- ============================================================
     CONTACT
     ============================================================ -->

## Contact

Feel free to reach out.