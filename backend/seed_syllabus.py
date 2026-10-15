"""Seed synthetic Shadow Syllabus data for Delhi University CS-204 & CS-201.

Populates statutory curriculum trees, archived question papers (2018-2024),
and verified question-to-topic mappings per Appendix C.
"""
import hashlib
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
django.setup()

from apps.syllabus.models import (
    University,
    Subject,
    SyllabusVersion,
    Topic,
    Paper,
    Question,
    QuestionTopicMapping,
)

def run():
    print("Seeding Shadow Syllabus curriculum & paper archive...")

    # 1. University
    du, _ = University.objects.get_or_create(
        code="DU",
        defaults={
            "name": "University of Delhi",
            "slug": "university-of-delhi",
        },
    )

    # 2. Subject: CS-204 Distributed Systems
    cs204, _ = Subject.objects.get_or_create(
        university=du,
        code="CS-204",
        defaults={
            "name": "Distributed Systems & Cloud Computing",
            "slug": "distributed-systems",
        },
    )

    # 3. Syllabus Version: 2022-2026 CBCS
    version, _ = SyllabusVersion.objects.get_or_create(
        subject=cs204,
        label="CBCS Institutional Syllabus (2022-2026)",
        defaults={
            "year": 2022,
            "total_marks": 100,
        },
    )

    # 4. Topics across 4 units
    topics_spec = [
        # Unit 1: Foundations & Architecture
        (1, 1, "Characterization of Distributed Systems & System Models", 4.0),
        (1, 2, "Networking and Interprocess Communication (RPC, RMI)", 5.0),
        (1, 3, "Architectural Styles (Layered, Object-based, Event-driven)", 3.0),
        # Unit 2: Synchronization & Coordination
        (2, 1, "Logical Clocks (Lamport Timestamps & Vector Clocks)", 6.0),
        (2, 2, "Distributed Mutual Exclusion (Ricart-Agrawala, Maekawa)", 5.0),
        (2, 3, "Election Algorithms (Bully Algorithm, Ring Algorithm)", 4.0),
        # Unit 3: Consensus & Fault Tolerance
        (3, 1, "Consensus in Crash-Fault Environments (Raft & Paxos)", 7.0),
        (3, 2, "Byzantine Generals Problem & Agreement Impossibility", 5.0),
        (3, 3, "Failure Detectors & Quorum-based Replication", 4.0),
        # Unit 4: Distributed Storage & Advanced Topics
        (4, 1, "Consistency Models (Linearizability, Eventual Consistency)", 6.0),
        (4, 2, "Distributed Transactions & Two-Phase Commit (2PC)", 5.0),
        (4, 3, "Distributed Shared Memory & Cache Coherence", 3.0),  # Intended Dormant/Blind-spot topic
        (4, 4, "Security & Authentication in Open Distributed Systems", 3.0),  # Intended Blind-spot
    ]

    topics_dict = {}
    for unit_no, pos, name, hours in topics_spec:
        topic, _ = Topic.objects.get_or_create(
            syllabus_version=version,
            unit_no=unit_no,
            position=pos,
            defaults={"name": name, "estimated_hours": hours},
        )
        topics_dict[f"u{unit_no}_p{pos}"] = topic

    # 5. Archived Question Papers (2018 through 2024)
    paper_years = [
        (2024, "May-June", 75),
        (2023, "Nov-Dec", 75),
        (2023, "May-June", 75),
        (2022, "May-June", 75),
        (2021, "May-June", 75),
        (2020, "Nov-Dec", 75),
        (2019, "May-June", 75),
        (2018, "May-June", 75),
    ]

    papers_dict = {}
    for year, session, marks in paper_years:
        paper, _ = Paper.objects.get_or_create(
            subject=cs204,
            syllabus_version=version,
            year=year,
            session=session,
            defaults={"max_marks": marks, "licence_tag": "Open Academic Archive"},
        )
        papers_dict[f"{year}_{session}"] = paper

    # 6. Exam Questions & Mappings
    questions_data = [
        # 2024 May-June
        ("2024_May-June", "1(a)", 10.0, "Part A", "Differentiate between Lamport timestamps and Vector clocks. Explain with an event trace why Lamport clocks cannot detect concurrent events.", "u2_p1", 0.98),
        ("2024_May-June", "2(b)", 15.0, "Part A", "Explain the Raft consensus protocol leader election mechanism. How does randomized timeout prevent split-vote deadlocks?", "u3_p1", 0.99),
        ("2024_May-June", "3(a)", 10.0, "Part B", "Analyze the Ricart-Agrawala algorithm for distributed mutual exclusion. Calculate message complexity per critical section access.", "u2_p2", 0.95),
        ("2024_May-June", "4(c)", 12.0, "Part B", "Describe the Two-Phase Commit (2PC) protocol. What failure scenario leads to blocking in 2PC, and how does 3PC alleviate it?", "u4_p2", 0.94),
        ("2024_May-June", "5(a)", 8.0, "Part C", "Compare linearizable consistency with eventual consistency in distributed key-value stores. Cite PACELC theorem.", "u4_p1", 0.92),

        # 2023 Nov-Dec
        ("2023_Nov-Dec", "1(b)", 12.0, "Part A", "Prove that in an asynchronous distributed system with even one crash failure, consensus is impossible (FLP Impossibility).", "u3_p2", 0.96),
        ("2023_Nov-Dec", "2(a)", 10.0, "Part A", "Explain Vector clocks calculation rules with an example of 3 processes and 5 message transmissions.", "u2_p1", 0.98),
        ("2023_Nov-Dec", "3(b)", 15.0, "Part B", "Demonstrate the Bully algorithm for leader election when the coordinator crashes. Trace messages exchanged.", "u2_p3", 0.95),
        ("2023_Nov-Dec", "4(a)", 10.0, "Part B", "Discuss RPC semantics under network failure: Exactly-once vs At-least-once vs At-most-once.", "u1_p2", 0.93),

        # 2023 May-June
        ("2023_May-June", "2(c)", 12.0, "Part A", "Explain log replication in Raft consensus. How are uncommitted conflicting entries overwritten safely?", "u3_p1", 0.97),
        ("2023_May-June", "3(a)", 10.0, "Part A", "Describe Maekawa's voting set algorithm for mutual exclusion. Explain deadlock prevention strategies.", "u2_p2", 0.94),
        ("2023_May-June", "4(b)", 10.0, "Part B", "Explain read-your-writes and monotonic-reads consistency models under client-centric consistency.", "u4_p1", 0.91),

        # 2022 May-June
        ("2022_May-June", "1(a)", 10.0, "Part A", "Explain Lamport logical clock condition: If a -> b then C(a) < C(b). Does the converse hold?", "u2_p1", 0.99),
        ("2022_May-June", "3(b)", 15.0, "Part B", "Explain Paxos Synod algorithm: Phase 1 (Prepare/Promise) and Phase 2 (Accept/Accepted).", "u3_p1", 0.95),
        ("2022_May-June", "5(a)", 10.0, "Part C", "Two-Phase Commit state diagrams for Coordinator and Participants under network partition.", "u4_p2", 0.96),

        # 2021 May-June
        ("2021_May-June", "2(a)", 12.0, "Part A", "Byzantine Generals problem under oral messages: Prove 3m + 1 nodes are necessary to tolerate m traitors.", "u3_p2", 0.98),
        ("2021_May-June", "4(a)", 10.0, "Part B", "Compare Ring algorithm with Bully algorithm for leader election.", "u2_p3", 0.92),

        # 2020 Nov-Dec
        ("2020_Nov-Dec", "1(a)", 10.0, "Part A", "Remote Procedure Calls architecture: Client stub, RPCRuntime, Dispatcher, and Server stub.", "u1_p2", 0.94),
        ("2020_Nov-Dec", "3(a)", 12.0, "Part B", "Ricart-Agrawala vs Token-Ring distributed mutual exclusion comparison table.", "u2_p2", 0.93),

        # 2019 May-June
        ("2019_May-June", "2(a)", 10.0, "Part A", "Vector clocks causal ordering proof and concurrent event detection.", "u2_p1", 0.97),
        ("2019_May-June", "3(b)", 12.0, "Part B", "Explain Distributed Shared Memory (DSM) implementation challenges and false sharing.", "u4_p3", 0.90),  # Last asked in 2019!

        # 2018 May-June
        ("2018_May-June", "1(b)", 10.0, "Part A", "Fundamental differences between distributed operating systems and network operating systems.", "u1_p1", 0.91),
        ("2018_May-June", "4(a)", 10.0, "Part B", "Strict consistency vs Sequential consistency in multiprocessor distributed environments.", "u4_p1", 0.92),
    ]

    for p_key, q_num, marks, sec, excerpt, t_key, conf in questions_data:
        paper = papers_dict[p_key]
        topic = topics_dict[t_key]
        q_hash = hashlib.sha256(f"{paper.id}_{q_num}_{excerpt[:50]}".encode()).hexdigest()

        q, _ = Question.objects.get_or_create(
            paper=paper,
            number=q_num,
            defaults={
                "marks": marks,
                "section": sec,
                "text_excerpt": excerpt,
                "text_hash": q_hash,
            },
        )

        QuestionTopicMapping.objects.get_or_create(
            question=q,
            topic=topic,
            defaults={
                "confidence": conf,
                "method": "human_verified",
                "rationale": f"Explicitly addresses concepts under Unit {topic.unit_no} ({topic.name})",
                "verified_by": "Academic Faculty Reviewer",
            },
        )

    print("Successfully seeded Shadow Syllabus data:")
    print(f"  - Subject: {cs204}")
    print(f"  - Topics: {len(topics_spec)} topics across 4 units")
    print(f"  - Papers: {len(paper_years)} exam papers (2018-2024)")
    print(f"  - Mapped Questions: {len(questions_data)} verified questions")

if __name__ == "__main__":
    run()
