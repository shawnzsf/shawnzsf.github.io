---
# ============================================================
# SITE CONFIGURATION — edit your personal info here
# ============================================================

# Identity
name_en: "Shoufeng Zhang"
name_jp: "張寿峰"
title: "Electrical & Computer Engineering"
affiliation: "University of Hong Kong"

# Sidebar quick facts
location: "Beijing · Hong Kong"
status: "Open to collaboration"
focus: "Robotics · Hardware · ML Systems"

# Landing Hero Mission Statement
hero_kicker: "SYSTEMS · STREETS · STORIES"
hero_title: "Along the Way"
hero_thesis: "I am drawn to beauty, spare elegance, the way a few symbols can hold an entire slice of reality. I am equally drawn to complexity, the patience of decomposing systems to their atoms, then the triumph of construcitng something whole from first principles. Beyond, I observe. Photographing, reading, letting the inner lives of others resonate against my own."

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
- Core Courses: Multivariable Calculus and Linear Algebra, C++ & Python Programming, Electricity and Electronics, Fundamental Mechanics, etc.

### 2024.7 · Carnegie Mellon University
- **Role:** Summer Session
- QPA: 4.0 / 4.0
- Core Courses: Principles of Imperative Computation (C Programming, Basic data structure and algorithms), Concepts of Mathematics (Discrete Math)

### 2022.9 – 2025.7 · Beijing 101 High School
- **Role:** AP & IB Diploma Programme

<!-- ============================================================
     EXPERIENCE & WORKS (merged)
     ============================================================ -->

## Experience
<!-- 
### 2026.7 – Present · MaRS Lab, HKU — Embodied Navigation Research Assistant
- **Role:** Research Assistant (Supervisor: Prof. Fu Zhang; Mentor: Siqi Liang)
- **Tags:** Robotics, Embodied AI
- Onboarding on **SparseVideoNav**, a video/world-action-model-based navigation framework (paper under review), with focus on deployment and validation on Unitree Go2 and humanoid platforms. Building foundational competence in embodied language models and video-action-model-based navigation ahead of planned follow-up research. -->

### 2025.12 – Present · HKU Innovation Wing Research Assistant
- **Role:** Research Assistant
- **Tags:** Robotics
- **MTR Station Inspection Robot** (2026.6 – Present) [GitHub](https://github.com/shawnzsf/inspection_grounding): Developing the object grounding module of a full autonomous inspection system built on the CMU exploration planner stack with FAST-LIO state estimation. Implemented LiDAR-camera fusion via frustum projection, mapping open-vocabulary 2D detections onto 3D point clouds with per-track accumulation and outlier-rejection/clustering for robust 3D object localization. 
- **Tour Guide Robot** (2025.12 – 2026.5): Built the full autonomy stack for a museum guide robot. Resolved severe odometry drift caused by the corridor effect in featureless hallways and dynamic crowd occlusion by integrating FAST-LIO (LiDAR-inertial odometry); deployed localization via ICP and navigation via Nav2.

### 2025.12 – 2026.5 · HKU JC STEM Lab of Intelligent Cybersecurity Research Assistant
- **Role:** Research Assistant
- **Tags:** Security
- Co-developed **RE-Agent** [GitHub](https://github.com/shawnzsf/Reverse-Engineering-Agent): an automated reverse-engineering pipeline built on Ghidra and DeepSeek that mimics the cognitive strategies of human reverse engineers for vulnerability analysis of stripped binaries. Replaced naive LLM prompting with progressive context enrichment using BFS exploration of caller/callee graphs and iterative hypothesis testing, achieving a **9$\times$ increase** in semantic function name-recovery accuracy compared to naive prompting on raw Ghidra decompiler output.
- Co-authored **INFRASCOPE** ([arXiv:2605.20051](https://arxiv.org/abs/2605.20051), preprint under review): a reference-driven multi-agent framework for detecting vulnerability variants across AI infrastructure repositories; contributed to experiments and validation testing.

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

### Hardware & Systems
- Verilog / SystemVerilog
- Vivado / FPGA Prototyping
- PyRTL
- RISC-V ISA
- Computer Architecture

### Robotics & Perception
- ROS2
- FAST-LIO / LiDAR-Inertial Odometry
- LiDAR-Camera Sensor Fusion
- Point Cloud Processing & 3D Object Grounding
- SLAM & State Estimation

### Software & ML
- C / C++
- Python
- Machine Learning
- Quantization / NN Accelerators
- Reverse Engineering (Ghidra) & LLM Agents
- Data Analysis (LDA, LDAvis)

### Exploring
- Embodied AI / World Models
- Vision-Language-Action (VLA) Models
- Robotics and Computer Systems in general

<!-- ============================================================
     CONTACT
     ============================================================ -->

## Contact

Feel free to reach out.