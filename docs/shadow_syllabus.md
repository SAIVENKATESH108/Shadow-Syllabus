# Shadow Syllabus: Engineering Specification & Algorithmic Blueprint

**Version 1.0 (Hackathon Vertical Slice) • 15 October 2026**  
*Part of Open Student Learning Platform (Master Plan Appendix C)*  
*Prepared for V.A. Sai Venkatesh*

---

## 1. Executive Summary & Problem Statement

Standard student exam preparation relies on coarse "important questions" lists compiled arbitrarily without rigorous curricular grounding. **Shadow Syllabus** replaces this with an empirical, explainable syllabus-to-paper mapping engine.

### Distinctive Features:
1. **Curriculum Grounding**: Every past exam question is mapped to a unit and topic of the institutional university syllabus version.
2. **Recency-Weighted Decay**: Recent exam patterns carry higher weight via exponential half-life decay.
3. **Blind-Spot & Dormancy Detection**: Explicitly alerts students to topics never asked or dormant for 3+ years, mitigating examination surprise risk.
4. **0/1 Knapsack Time-Budget Planner**: Dynamically generates an optimal study schedule given days remaining and daily hours, reserving a strict 15% time buffer for blind-spot review and general revision.
5. **Measured Empirical Benchmarks**: Rigorous 105-question benchmark with inter-annotator agreement (Top-1: 91.43%, Top-3: 98.10%, Macro-F1: 0.9298).

---

## 2. Mathematical Formulation & Algorithmic Core

### 2.1 Exponential Recency Weighting
Let:
- $t$ be a curriculum topic from syllabus version $S$
- $q \in \text{mapped}(t)$ be an examination question mapped to $t$
- $\text{conf}(q,t) \in [0.0, 1.0]$ be the verified mapping confidence
- $\text{marks}(q)$ be the mark value of question $q$
- $\text{year}(q)$ be the examination year of question $q$
- $\text{current\_year}$ be the evaluation year (e.g., 2024)
- $H$ be the recency half-life parameter in years ($H = 3.0$ by default)

The temporal decay factor is:
$$\text{decay}(\text{year}(q)) = 0.5^{\frac{\text{current\_year} - \text{year}(q)}{H}}$$

The raw recency score for topic $t$ is:
$$\text{score}(t) = \sum_{q \in \text{mapped}(t)} \text{conf}(q,t) \times \text{marks}(q) \times \text{decay}(\text{year}(q))$$

The normalized curriculum weight is:
$$\text{weight}(t) = \frac{\text{score}(t)}{\sum_{t' \in S} \text{score}(t')}$$

The expected marks value out of paper total $M$ (e.g., $M = 100$) is:
$$\text{expected\_marks}(t) = \text{weight}(t) \times M$$

---

### 2.2 Blind-Spot & Dormancy Identification
- **Curriculum Blind Spot**: Topic $t \in S$ where $|\text{mapped}(t)| = 0$ across all $N$ analyzed examination papers.
- **Dormant Topic**: Topic $t \in S$ where $|\text{mapped}(t)| > 0$, but:
  $$\text{current\_year} - \max_{q \in \text{mapped}(t)}(\text{year}(q)) \ge K \quad (K = 3 \text{ years})$$

> [!WARNING]
> **Academic Responsibility Mandate (Appendix C.10)**  
> Weightages reflect historical frequency patterns. Skipping topics is inherently risky because institutional university examiners reserve the prerogative to examine any prescribed section. The UI permanently displays this reminder.

---

### 2.3 0/1 Knapsack Time-Budget Optimization
Given student inputs:
- $D$: Days remaining until examination
- $U$: Daily study commitment in hours

Total available study hours:
$$B_{\text{total}} = D \times U$$

Guaranteed Revision & Blind-Spot Reserve (15%):
$$B_{\text{reserve}} = 0.15 \times B_{\text{total}}$$
$$B_{\text{study}} = B_{\text{total}} - B_{\text{reserve}}$$

The optimization problem selects a subset of curriculum topics $X \subseteq S$ to:
$$\max \sum_{t \in X} \text{expected\_marks}(t)$$
$$\text{subject to} \sum_{t \in X} \text{estimated\_hours}(t) \le B_{\text{study}}$$

This is solved exactly using dynamic programming with discrete 0.5-hour granularity. The selected topics are ordered pedagogically by `unit_no` and `position`.

---

## 3. Empirical Evaluation & Backtest Benchmarks

### 3.1 Mapping Accuracy (105-Question Hand-Labelled Benchmark)
- **Dataset**: 105 examination questions across DU CS-204 Distributed Systems (2018–2024).
- **Inter-Annotator Agreement**: 93.3% raw agreement, Cohen's Kappa $\kappa = 0.927$ between two independent raters.
- **Evaluation Command**: `wsl python3 /mnt/d/TCS/zetahackthon/backend/apps/syllabus/evaluation/evaluate_mapping.py`

| Methodology | Top-1 Accuracy | Top-3 Accuracy | Macro-Precision | Macro-Recall | Macro-F1 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Keyword Frequency Baseline | 90.48% (95/105) | 98.10% (103/105) | 0.9503 | 0.9095 | 0.9189 |
| Embeddings-Only Cosine Similarity | 95.24% (100/105) | 100.00% (105/105) | 0.9626 | 0.9532 | 0.9555 |
| **Shadow Syllabus (Hybrid Embeddings + Taxonomy)** | **91.43% (96/105)** | **98.10% (103/105)** | **0.9586** | **0.9178** | **0.9298** |

### 3.2 Walk-Forward Historical Backtest (Top 5 of 13 Topics Studied across 2021–2024)
- **Methodology**: Strict temporal walk-forward split. For each test year $Y \in \{2021, 2022, 2023, 2024\}$, only examination papers with $\text{year} < Y$ are used for training.
- **Evaluation Command**: `wsl python3 /mnt/d/TCS/zetahackthon/backend/apps/syllabus/evaluation/backtest_engine.py`

| Study Strategy | 2021 | 2022 | 2023 | 2024 | Mean Capture (%) | StdDev | Delta vs Syllabus Order |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Random Topic Selection (Monte Carlo N=200) | 39.1% | 39.1% | 39.5% | 39.2% | 39.2% | 0.13 | -4.9% |
| Chronological Syllabus Order | 44.8% | 45.0% | 42.5% | 44.1% | 44.1% | 0.97 | Baseline (0.0%) |
| Plain Question Frequency (No Decay) | 44.8% | 45.0% | 55.3% | 50.0% | 48.8% | 4.31 | +4.7% |
| Last-Year-Only (Lag-1) | 48.3% | 50.0% | 51.1% | 50.0% | 49.8% | 1.00 | +5.7% |
| No-Decay Marks Weighting | 44.8% | 55.0% | 51.1% | 61.8% | 53.2% | 6.15 | +9.1% |
| **Shadow Syllabus (Recency Decay $H=3.0$)** | **51.7%** | **55.0%** | **51.1%** | **61.8%** | **54.9%** | **4.24** | **+10.8%** |

> [!NOTE]
> **Scientific Uncertainty Disclosure**:
> Sample sizes: 2021 test (37 train Qs, 11 test Qs, 145 marks); 2022 test (48 train Qs, 18 test Qs, 200 marks); 2023 test (66 train Qs, 24 test Qs, 235 marks); 2024 test (90 train Qs, 15 test Qs, 170 marks). Historical backtest results measure retrospective correlation and do not guarantee future exam distributions. Institutional examiners retain the authority to test any syllabus topic.

---

## 4. REST API Contract

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/v1/syllabus/subjects/` | `GET` | List accredited universities and subjects. |
| `/api/v1/syllabus/topics/?subject_code=CS-204` | `GET` | Retrieve topic tree with computed recency scores, weights, and yield tiers. |
| `/api/v1/syllabus/blind-spots/?subject_code=CS-204` | `GET` | Retrieve unasked blind spots and dormant topics with examination pattern risk notices. |
| `/api/v1/syllabus/evidence/<topic_id>/` | `GET` | Full question provenance, paper session, year, marks, and OCR excerpts. |
| `/api/v1/syllabus/planner/` | `POST` | Solve 0/1 knapsack study schedule given `{ days_left, hours_per_day }`. |
| `/api/v1/syllabus/accuracy-report/` | `GET` | Empirical validation agreement and backtest benchmark comparison. |
