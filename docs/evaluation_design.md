# AI Evaluation Engine Design: Data Analyst Role

## 1. Required Output Schema (EvaluationReport)
The LLM MUST return a strict JSON object adhering to the following structure. This is critical for automated parsing.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `technical_score` | float (0.0 - 10.0) | Objective assessment of correctness and depth. |
| `clarity_score` | float (0.0 - 10.0) | Assessment of structured communication and conciseness. |
| `fluency_score` | float (0.0 - 10.0) | Assessment of pace, confidence, and natural language use. |
| `detailed_feedback` | string | Comprehensive paragraph-style advice. |
| `technical_strengths` | list[string] | 2-3 specific topics where the user demonstrated expertise. |
| `technical_weaknesses` | list[string] | 2-3 specific concepts the user was vague on or got wrong. |

## 2. Data Analyst Scoring Benchmarks (Technical Score)
The LLM should prioritize these concepts when scoring the technical accuracy for a Data Analyst:

* **Foundational Statistics:** Correctly explaining concepts like **Bias-Variance Tradeoff**, **Central Limit Theorem**, or when to use different **Hypothesis Tests** (e.g., T-test vs. Chi-square).
* **SQL Competence:** Demonstration of complex queries, especially **Window Functions** (`ROW_NUMBER()`, `RANK()`), advanced **JOINs**, or subqueries.
* **Python/Pandas:** Effective discussion of data cleaning tasks, handling **missing values**, and feature engineering.
* **Visualization:** Understanding of when to use specific chart types (e.g., histogram vs. box plot) to convey information.

## 3. Master Prompt Directives
The prompt instructing the LLM must emphasize:
1.  **Impartiality (temperature=0.0).**
2.  **Strict adherence to the JSON schema** (using the `response_format` feature).
3.  **Use of the full transcript** to judge fluency and clarity, not just technical facts.