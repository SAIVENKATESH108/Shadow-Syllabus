"""Walk-Forward Historical Backtest Engine for Shadow Syllabus.

Evaluates how effectively historical topic ranking strategies predict marks
on held-out future examination papers.

Implements requirements of Appendix C.9:
1. Strict walk-forward temporal split: For each test year Y, only papers with
   year < Y are available for training.
2. 4 test years: 2021, 2022, 2023, 2024.
3. Evaluates 6 distinct strategies on the top 5 topics (approx 38.5% of curriculum):
   - Strategy 1: Random Topic Selection (Monte Carlo N=200 trials)
   - Strategy 2: Chronological Syllabus Order (Unit 1.1 to 2.2)
   - Strategy 3: Plain Question Frequency (raw count without temporal decay)
   - Strategy 4: No-Decay Marks Weighting (sum of marks without decay)
   - Strategy 5: Last-Year-Only (Lag-1: exclusively using year Y - 1)
   - Strategy 6: Exponential Recency Decay (H = 3.0 years)
4. Reports per-year marks capture rate, multi-year mean, standard deviation (spread),
   and sample sizes.
5. Saves results to backtest_results.json.
"""
import json
import os
import random
from collections import Counter, defaultdict
from typing import Any

def run_backtest():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "labelled_questions_dataset.json")

    with open(data_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    questions = meta["questions"]
    all_topic_ids = [
        "u1_p1", "u1_p2", "u1_p3",
        "u2_p1", "u2_p2", "u2_p3",
        "u3_p1", "u3_p2", "u3_p3",
        "u4_p1", "u4_p2", "u4_p3", "u4_p4"
    ]

    test_years = [2021, 2022, 2023, 2024]
    top_k_topics = 5  # Top 5 out of 13 topics (~38.5% of syllabus)
    half_life = 3.0

    strategies = [
        "Random Topic Selection",
        "Chronological Syllabus Order",
        "Plain Question Frequency",
        "No-Decay Marks Weighting",
        "Last-Year-Only (Lag-1)",
        "Shadow Syllabus (Recency Decay H=3.0)",
    ]

    yearly_results = {s: {} for s in strategies}
    sample_sizes = {}

    print("=" * 85)
    print("SHADOW SYLLABUS • WALK-FORWARD HISTORICAL BACKTEST ENGINE")
    print(f"Test Years: {test_years} | Curriculum: DU CS-204 | Top-K Studied: {top_k_topics}/13 Topics")
    print("=" * 85)

    for y in test_years:
        train_q = [q for q in questions if q["year"] < y]
        test_q = [q for q in questions if q["year"] == y]

        total_test_marks = sum(q["marks"] for q in test_q)
        test_topics_marks = defaultdict(float)
        for q in test_q:
            test_topics_marks[q["ground_truth_topic_id"]] += q["marks"]

        sample_sizes[y] = {
            "training_questions": len(train_q),
            "test_questions": len(test_q),
            "total_test_marks": total_test_marks,
            "training_year_range": f"2018–{y-1}",
        }

        # --- 1. Random Selection (Monte Carlo N=200) ---
        random_captures = []
        for seed in range(200):
            rng = random.Random(seed + y)
            chosen = rng.sample(all_topic_ids, top_k_topics)
            cap = sum(test_topics_marks[tid] for tid in chosen)
            random_captures.append((cap / total_test_marks) * 100)
        yearly_results["Random Topic Selection"][y] = round(sum(random_captures) / len(random_captures), 2)

        # --- 2. Chronological Syllabus Order ---
        chrono_chosen = all_topic_ids[:top_k_topics]
        chrono_cap = sum(test_topics_marks[tid] for tid in chrono_chosen)
        yearly_results["Chronological Syllabus Order"][y] = round((chrono_cap / total_test_marks) * 100, 2)

        # --- 3. Plain Question Frequency ---
        freq = Counter([q["ground_truth_topic_id"] for q in train_q])
        ranked_by_freq = sorted(all_topic_ids, key=lambda tid: freq[tid], reverse=True)
        freq_chosen = ranked_by_freq[:top_k_topics]
        freq_cap = sum(test_topics_marks[tid] for tid in freq_chosen)
        yearly_results["Plain Question Frequency"][y] = round((freq_cap / total_test_marks) * 100, 2)

        # --- 4. No-Decay Marks Weighting ---
        marks_by_topic = defaultdict(float)
        for q in train_q:
            marks_by_topic[q["ground_truth_topic_id"]] += q["marks"]
        ranked_by_marks = sorted(all_topic_ids, key=lambda tid: marks_by_topic[tid], reverse=True)
        marks_chosen = ranked_by_marks[:top_k_topics]
        marks_cap = sum(test_topics_marks[tid] for tid in marks_chosen)
        yearly_results["No-Decay Marks Weighting"][y] = round((marks_cap / total_test_marks) * 100, 2)

        # --- 5. Last-Year-Only (Lag-1) ---
        lag1_q = [q for q in train_q if q["year"] == (y - 1)]
        lag1_marks = defaultdict(float)
        for q in lag1_q:
            lag1_marks[q["ground_truth_topic_id"]] += q["marks"]
        ranked_by_lag1 = sorted(all_topic_ids, key=lambda tid: lag1_marks[tid], reverse=True)
        lag1_chosen = ranked_by_lag1[:top_k_topics]
        lag1_cap = sum(test_topics_marks[tid] for tid in lag1_chosen)
        yearly_results["Last-Year-Only (Lag-1)"][y] = round((lag1_cap / total_test_marks) * 100, 2)

        # --- 6. Shadow Syllabus Exponential Recency Decay ---
        decay_scores = defaultdict(float)
        for q in train_q:
            delta = max(0, y - q["year"])
            decay_factor = 0.5 ** (delta / half_life)
            decay_scores[q["ground_truth_topic_id"]] += q["marks"] * decay_factor
        ranked_by_decay = sorted(all_topic_ids, key=lambda tid: decay_scores[tid], reverse=True)
        decay_chosen = ranked_by_decay[:top_k_topics]
        decay_cap = sum(test_topics_marks[tid] for tid in decay_chosen)
        yearly_results["Shadow Syllabus (Recency Decay H=3.0)"][y] = round((decay_cap / total_test_marks) * 100, 2)

    # Compute summary statistics
    summary = []
    print(f"\n{'Strategy':<38} | {'2021':<7} | {'2022':<7} | {'2023':<7} | {'2024':<7} | {'Mean':<7} | {'StdDev':<7}")
    print("-" * 85)

    for strat in strategies:
        scores = [yearly_results[strat][y] for y in test_years]
        mean_score = sum(scores) / len(scores)
        variance = sum((s - mean_score) ** 2 for s in scores) / len(scores)
        std_dev = variance ** 0.5

        summary.append({
            "strategy": strat,
            "yearly_capture_pct": yearly_results[strat],
            "mean_capture_pct": round(mean_score, 2),
            "std_dev": round(std_dev, 2),
            "delta_vs_syllabus_order": round(mean_score - (sum(yearly_results["Chronological Syllabus Order"].values()) / 4), 2),
        })

        print(f"{strat:<38} | {scores[0]:<7.1f} | {scores[1]:<7.1f} | {scores[2]:<7.1f} | {scores[3]:<7.1f} | {mean_score:<7.1f} | {std_dev:<7.2f}")

    print("=" * 85)
    print("\nSample Sizes & Provenance by Test Year:")
    for y, info in sample_sizes.items():
        print(f"  Year {y}: Training Qs = {info['training_questions']} ({info['training_year_range']}) | Test Qs = {info['test_questions']} ({info['total_test_marks']} marks)")

    # Save to backtest_results.json
    out_file = os.path.join(base_dir, "backtest_results.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "subject_code": "CS-204",
            "curriculum": "DU CS-204 CBCS (2022-2026)",
            "top_k_topics": top_k_topics,
            "total_topics": len(all_topic_ids),
            "test_years": test_years,
            "sample_sizes_by_year": sample_sizes,
            "strategies_comparison": summary,
            "scientific_disclosures": [
                "Evaluated strictly on held-out test years using papers prior to test year only.",
                "Marks capture rate measures percentage of exam marks falling within selected top-K topics.",
                "Historical backtest results demonstrate retrospective correlation, not a predictive guarantee of future exams.",
                "Examiners retain the institutional prerogative to test any prescribed syllabus module.",
            ],
        }, f, indent=2)

    print(f"\nBacktest results saved to {out_file}")

if __name__ == "__main__":
    run_backtest()
