# AWS Certified AI Practitioner (AIF-C01) — Master Study Guide

**Exam structure**: 5 domains — Fundamentals of AI & ML (20%) · Fundamentals of GenAI (24%) · Applications of Foundation Models (28%, the biggest) · Responsible AI (14%) · Security, Compliance & Governance (14%). Foundational level: no code, no math derivations — the exam tests concept recognition, service matching, and trade-off reasoning.

---

# DOMAIN 1 — Fundamentals of AI and ML

## 1.1 The Concept Hierarchy

```
Artificial Intelligence (systems performing tasks that normally require humans:
│                        perception, reasoning, decision-making)
└── Machine Learning (learns from data to improve at specific tasks,
    │                 instead of following explicit rules)
    └── Deep Learning (multi-layered neural networks that automatically
        │              learn/extract features from large datasets)
        └── LLMs / Generative AI
Related AI fields: Computer Vision (interpret images/video),
                   NLP (translation, generation, sentiment, interpretation)
```

Core term pairs to keep straight:
- **ML algorithm** (the recipe/procedure) vs. **AI model** (the trained result: algorithm + data)
- **Training** (teaching the model with large amounts of data — the most time/resource-intensive phase) vs. **inferencing** (using the trained model to make predictions on new data)
- **Model fairness** (predictions don't disadvantage any group) vs. **model fit** (predictions accurately capture the underlying patterns — see §4.3 for overfitting/underfitting)

## 1.2 Neural Networks (the factory analogy)

- **Input layer** = loading dock: each incoming item is one **feature** (a pixel, a measurement, a key/value pair)
- **Hidden layers** = assembly workers (**neurons**): each transforms what it receives and passes it on; layers do progressively more complex work (pixel color → edge detection → shape detection)
- **Output layer** = packaging/shipping: assembles everything into a usable result (e.g., a classification: "does this image contain a cat? → No")

## 1.3 Data Types

| Type | Definition | Notes |
|---|---|---|
| **Labeled** | Tagged with categories/descriptors | Enables supervised learning; faster, more accurate training |
| **Unlabeled** | No tags | Model must find patterns itself (unsupervised learning) |
| **Tabular** | Rows and columns (spreadsheet-like) | |
| **Time-series** | Timestamped observations at regular intervals | Trend analysis, anomaly detection |
| **Image** | Visual info (images/video) | Powers CV tasks: edge/object detection, facial recognition |
| **Structured text** | Predefined format with fields/tags (CSV, JSON) | Overlaps with tabular |
| **Unstructured** | Freeform text (posts, PDFs) | Hardest to analyze; needs NLP |

## 1.4 Learning Approaches

- **Supervised** — labeled input/output pairs; model predicts outputs for new data
- **Unsupervised** — unlabeled data; model discovers patterns, groupings, structure
- **Reinforcement learning** — learns by trial and error with positive/negative feedback (rewards/penalties)
- **Self-supervised** — how foundation models pre-train: the model learns meaning/context/relationships from unlabeled data at massive scale (Domain 2 crossover)

Mapping cue: labeled + predict a **number** → regression · labeled + predict a **category** → classification · unlabeled + find **groups** → clustering · learn by **feedback** → RL

## 1.5 Core ML Techniques & Algorithms

### Regression (supervised → continuous values, except logistic)
- **Linear** — one independent variable, linear relationship (weight from height)
- **Multiple** — 2+ independent variables (house price from size + location + bedrooms)
- **Polynomial** — nth-degree polynomial / curved relationship (ball trajectory)
- **Logistic** — predicts probability of a **binary** outcome (spam vs. not spam)

### Classification (supervised → categories)
- Email filtering, image recognition, sentiment analysis, medical diagnosis, credit scoring

### Clustering (unsupervised → groups without labels)
- **K-means** — partition into k clusters (customer segmentation by purchase behavior)
- **Hierarchical** — tree-like structure (grouping documents by similarity)
- **DBSCAN** — groups dense points, marks isolated low-density points as outliers → **anomaly detection**

### Other
- **KNN (K-Nearest Neighbors)** — classify by neighbors' classes (recommendation engines)
- **PCA (Principal Component Analysis)** — **dimensionality reduction**: shrink a dataset while keeping important features (facial-recognition preprocessing)

## 1.6 The ML Lifecycle (end to end)

**Business goal → problem framing → data collection → pre-processing → feature engineering → train/tune/evaluate → deployment → monitoring** (then feedback loops back to the start — it's a cycle, not a line)

- **Business goal** — objectively measurable business value; decide whether ML is even the right tool; frame the problem, review data requirements, cost, production feasibility
- **Problem framing** — define what's observed vs. what's predicted; identify dependent/independent variables, inputs/outputs
- **Data collection** — labeling, ingestion (**streaming or batch**), aggregation into storage
- **Pre-processing** — clean, partition, scale; **identify and mitigate bias** via balancing/augmenting
- **Feature engineering** (features = model inputs used in training AND inference):
  - **Selection** — keep relevant features that minimize error
  - **Transformation** — replace missing/invalid features
  - **Creation** — derive new features from existing data
  - **Extraction** — dimensionality reduction (PCA)
- **Train/tune** — **hyperparameters** = settings that control the algorithm's behavior, set *before* training (vs. weights/parameters, which are *learned*); tuning = finding optimal hyperparameters
- **Evaluate** — **offline evaluation**: test on a held-out portion of data never used in training
- **Deploy** — make the model available for inference (MLOps territory)
- **Monitor** — **explainability** of inferences; **drift detection** (data/concept drift: model used to be right, now isn't) with alerts that can auto-trigger retraining via a model update threshold

### Inference styles
- **Batch** — large dataset, all at once, results analyzed together → when **accuracy/throughput beats speed**
- **Real-time** — immediate per-request responses (chatbots, self-driving) → when **latency is critical**

### Deployment architectures
- **Self-hosted API** — API Gateway → load balancer → your compute (EC2 auto-scaling group / containers) running a **local copy of the model**; you manage everything
- **Managed API** — same front end, but inference is delegated privately to a **SageMaker inference endpoint**; less operational overhead

### Model sources
- **Open-source / pre-trained** (Meta, Hugging Face, TensorFlow) vs. **custom models** built in-service (supervised, unsupervised, image processing, text analysis algorithm families)

## 1.7 MLOps

MLOps = DevOps principles extended to ML, plus one new idea:
- **Version control** for **data, code, AND models** — in **three separate, independent repositories**
- **Automation** — automate anything not requiring human oversight
- **CI/CD** — extended beyond code to data and models
- **Model governance** *(unique to MLOps)* — evaluation and transparency for fairness, bias, ethics

Benefits: productivity (automated self-service), reliability, repeatability, **auditability** (versioned inputs/outputs), continuous data & model quality checks.

Pipeline structure: **data pipeline** (prep → data repo) → **build & test pipeline** (build → evaluate → select → code repo) → **deployment pipeline** (→ model repo) → **monitoring pipeline**.

## 1.8 ML Performance Metrics (classification & regression)

Built from the confusion matrix:
- **Accuracy** = correct ÷ total. *Weakness: misleading on imbalanced data* (always predicting "no fraud" is 99% accurate if fraud is 1%)
- **Precision** = of predicted positives, how many were right? (penalizes **false positives**)
- **Recall** = TP ÷ (TP + FN) — of actual positives, how many did we catch? (penalizes **false negatives**)
- **F1 score** = **harmonic mean of precision and recall**. Use when: classes are **imbalanced** / rare events, FP and FN have different costs, or neither precision nor recall alone suffices
- **AUC-ROC** — ability to distinguish classes; **0.5 = random guessing** (diagonal line), ~0.67 = breakeven, **>0.9 = optimal**; higher is better
- **MSE (mean squared error)** — regression; (prediction − actual)² summed; **closer to 0 is better**; squaring punishes big errors
- **R²** — regression; proportion of the dependent variable's variance explained by the independents; a **model fit** measure; closer to 1 is better

Mapping: classification → accuracy/precision/recall/F1/AUC-ROC · regression → MSE/R² · imbalanced → F1, not accuracy

## 1.9 When AI Fits — and When It Doesn't

**Good patterns** (well-defined tasks + lots of data + human oversight where stakes are high):
- Content/data **extraction** (pull financials from an earnings report, text or tables)
- **Summarization** (long legal contract → clauses, risks, obligations, for human review)
- **Medical image annotation** (X-ray analysis for pneumonia/cancer indicators — human always oversees)
- **Drug design** (model 3D protein–drug interactions → candidate compounds for testing)

**Anti-patterns** (accountability, reproducibility, nuanced judgment required):
- **Financial audits** — compliance issues, accuracy problems, no accountability, non-reproducible outputs
- **Pharma regulatory compliance** — complex human decisions, legal review, accountability
- **Legal judgments** — nuance/emotion, unwritten social norms, dynamic context, ethics, accountability

Recurring blockers to recognize in exam scenarios: **accountability, reproducibility (nondeterminism), regulatory sign-off, moral judgment**.

**Real-world application workflows** (multi-step; most steps are AI opportunities, often *different* AI per step): autonomous vehicles (computer vision), virtual assistants (speech recognition + NLP + text-to-speech), e-commerce recommendations, real-time fraud detection, demand forecasting.

---

# DOMAIN 2 — Fundamentals of Generative AI

## 2.1 Core GenAI Terminology

- **Transformer-based LLMs** — understand/generate human-like text (e.g., GPT); learn patterns and relationships between words/phrases from massive text data
- **Token** — the unit of text a model processes (word, sub-word, character, punctuation — depends on the tokenizer). **Pricing and context limits are measured in tokens**
- **Chunking** — splitting large text into manageable pieces; **chunk size and chunk overlap (both in tokens) are the critical vector-database tuning parameters**. "Chunking is easy; *good* chunking is hard"
- **Vector** — ordered series of numbers representing data's features/dimensions; enables similarity math
- **Embedding** — a **dense vector that captures semantic meaning**; similarity searches run **against embeddings**
- Pipeline to internalize: **document → chunks → embeddings → vector DB → similarity search**

## 2.2 Foundation Model Types

| Type | How it works | Primary use |
|---|---|---|
| **LLM** | Trained on vast text | Text generation, translation, summarization |
| **Diffusion** | Starts from noise, progressively adds information until patterns emerge | **Image generation** (also audio/text) |
| **Multimodal** | Trained on multiple media types | Interpret/generate text + image + audio + video |
| **GAN** | **Two adversarial networks**: generator creates, discriminator judges real vs. fake, until indistinguishable | Realistic content generation |
| **VAE** | Neural network + probabilistic modeling | **Anomaly detection in time-series data** |

## 2.3 Foundation Model Lifecycle

**Data selection** (massive datasets; any label/structure status, any media) → **model selection** (type per intended use) → **pre-training** (**self-supervised**; learns meaning/context even from unlabeled data) → **fine-tuning** (**supervised**; specialize for a domain) → **evaluation** (objective metrics for accuracy + speed) → **deployment** (MLOps) → **feedback** (post-production monitoring for bias, drift)

Key contrast: **pre-training = self-supervised, massive, general · fine-tuning = supervised, small, specific**

## 2.4 GenAI Advantages vs. Disadvantages

**Advantages (7)**: adaptability across tasks/domains · responsiveness (near real-time) · simplicity (summarize, simplify, generate code from natural language) · creativity & exploration (art, prototyping) · data efficiency (learns from relatively small datasets) · personalization (uses conversation context) · scalability (horizontal, distributed)

**Disadvantages (7)**: regulatory violations (needs human review) · social risks (deepfakes, disinformation) · data security/privacy (can be tricked into revealing training data) · toxicity (reflects training-data bias) · **hallucinations** (fabricates facts, states them authoritatively — intrinsic to generation) · interpretability (can't trace reasoning) · **nondeterminism** (same prompt → different outputs; good for creativity, terrible for debugging; reducible but never to zero)

## 2.5 GenAI Business Value Metrics

- **Cross-domain performance** — one model serving multiple use cases (support chatbot also doing sales) → fewer models/fine-tunes
- **Efficiency** — speed + resource consumption in training and inference
- **Conversion rate** — % of users taking the recommended action (buying the recommended product)
- **ARPU** — average revenue per user over a period
- **CLV (customer lifetime value)** — total expected revenue over the whole customer relationship (retention-driven)
- **Accuracy** (business sense) — how often output is acceptable (marketing copy approved on first draft → less human rework)
- Evaluation method: compare **pre-AI vs. post-AI** KPIs (response time, ticket resolution rate, click-through, session duration, task time, error rate). Nuance: the goal isn't zero errors — it's **fewer errors than the human baseline**
- Newer exam-guide additions in the same spirit: task completion rate, user satisfaction, cost per interaction

## 2.6 AWS GenAI Services

| Service | What to know |
|---|---|
| **Amazon Bedrock** | The flagship: **foundation models from Amazon + third parties via a single API**; customize privately via **fine-tuning or RAG**; **fully serverless**. Related features worth recognizing: **Bedrock Guardrails** (see Domain 4), Bedrock Model Evaluation, Bedrock Prompt Management, Bedrock Data Automation, and **Bedrock Agents / AgentCore** (build task-executing agents) |
| **SageMaker JumpStart** | **Pre-trained models** (summarization, image gen) you can customize and deploy via UI/SDK; share models/notebooks org-wide; **data encrypted and stays in your VPC** |
| **PartyRock** | **No-code Bedrock playground** for building/learning GenAI apps and prompt chaining |
| **Amazon Q Developer** | GenAI coding assistant: generate/debug code, answer questions; aware of your AWS resource inventory |
| **Amazon Q Business** | Connects to enterprise data repositories; employees query for insights; integrates with **QuickSight** |

Choosing cue: need FM API without infrastructure → Bedrock · want a pre-trained model in your own VPC to tune/deploy → JumpStart · no-code experimentation → PartyRock · coding help → Q Developer · querying company data → Q Business

## 2.7 Advantages, Benefits, and Cost Trade-offs of AWS GenAI

**Advantages**: accessibility (prebuilt models/APIs for every skill level) · lower barrier to entry · efficiency (managed scaling/LB/security) · **pay-as-you-go** cost model · speed to market · business alignment

**Benefits**: security (encryption, permissions) · compliance (AWS-side framework compliance is done; you still certify your workload) · **shared responsibility** (see Domain 5) · safety tooling (e.g., SageMaker Clarify for bias)

**Cost trade-offs — everything good costs more**:
- Faster inference / lower latency → bigger models & resources → more cost
- High availability (multi-AZ), redundancy (cross-region replication/inference, DR) → more cost
- **Token-based pricing** — LLM services charge per token; whole documents as context = pay accordingly
- **Provisioned throughput** — you pay for what you **provision, used or not** (vs. pay-as-you-go)
- Regional coverage — offerings vary per region; cross-region traffic costs
- Custom model training on managed infra costs more than on-prem, buying you availability/quality

## 2.8 Reference Architecture: GenAI Image App (Well-Architected)

VPC with public/private subnets across **two AZs**; **NAT gateway** for outbound-only private traffic → ALB + EC2 (IAM roles) → **CloudFront** CDN (in front of ALB *and* generated images) with wildcard cert + **WAF web ACL** → **Route 53** DNS → app calls **Bedrock** for image generation (returns **base64** image) → metadata to **DynamoDB**, decoded image to **S3** → user gets a CDN URL. **VPC endpoints** for S3/DynamoDB keep that traffic off the internet.
Themes: multi-AZ resilience, IAM least privilege, VPC endpoints, edge security (CDN + WAF).

---

# DOMAIN 3 — Applications of Foundation Models *(28% — the biggest domain)*

## 3.1 Model Selection

**Primary question: what modality?**
- **Text** — creative/conversational → general-purpose model; legal/financial/compliance → fine-tuned; technical/scientific + logic → approaching custom
- **Images** — similar model families; decision is cost/resources
- **Audio** — speech, music, even white noise
- **Video** — most resource-intensive (why it lags)
- **Multimodal** — most complex models

**Secondary criteria** (the GlobalTech chatbot checklist — 8 items): **cost** (licensing + compute) · **modality** · **latency** (accurate-but-slow fails real-time needs) · **multilingual support** (or split translation into a separate model) · **model size** (memory/CPU/GPU/storage vs. your infrastructure) · **complexity** (accuracy vs. tuning/training burden) · **customization** (fine-tunable with your data, brand voice) · **input/output token length** (long queries, answers, whole conversations without cutoff)

**Universal trade-offs**: speed → smaller model; accuracy → larger/slower; both → extraordinary cost. Constraints force sub-optimal (smaller) choices. Strict **GRC** requirements may force on-prem/private hosting.

## 3.2 Inference Parameters

- **Temperature** — randomness. Low = deterministic, high-probability tokens; high = diverse/creative, lower-probability tokens allowed
- **Top K** — the **count** of candidate tokens considered (low = only the likeliest)
- **Top P** — the **cumulative probability mass** of candidates considered (a percentage, not a count)
- **Output length** — min/max tokens; penalties on repetition/frequency can also shape length; overlaps with prompt engineering ("3 sentences or less")

Worked example ("The sky is filled with ___": stars 0.6, clouds 0.3, dragons 0.1): high temperature boosts dragons' chances; Top K=2 removes dragons from consideration entirely; Top P=0.8 keeps stars+clouds likely but leaves dragons a chance.
Hook: **Temperature = how adventurous · Top K = how many menu items · Top P = how much of the probability pie**

## 3.3 Prompt Structure & Priority

Elements: **system message** (role the LLM assumes; may be a server-side default) · **user message** (the classic prompt) · **assistant message** (tone/format of the response, e.g., "JSON") · **contextual data** (RAG lives here) · **model bias** (the model's ingrained tendencies)

**Priority order**: model bias overrides everything → then system message overrides the rest of the prompt → assistant message formats the output. You cannot prompt your way past model bias; system outranks user.

## 3.4 Prompt Engineering

**Definition**: designing/refining prompts to optimize model performance → quality, guided behavior, accuracy, business value.

**Components**: **context** (background: auto-included conversation history up to the token limit, user details, provided docs/RAG) · **instruction** (the task — with **clarity, specificity, brevity**) · **negative prompts** (what NOT to do: "no personal opinions," "avoid jargon"). Labeling the sections explicitly in the prompt helps.

**Techniques** (identify from a description):
| Technique | Signature |
|---|---|
| **Zero-shot** | Task, no examples |
| **Single/one-shot** | One guiding example |
| **Few-shot** | Multiple examples to learn the pattern (bigger payoff on harder tasks) |
| **Chain-of-thought** | Step-by-step reasoning laid out: define the problem, edge cases, expected outputs, "use an existing library" → cleaner, more accurate results |
| **Prompt templates** | Predefined fill-in structure (e.g., JSON of purpose/input/output/examples); **version-controllable, team-shareable**, close to what the backend consumes |

**Best practices**: clear & specific beats generic ("main causes of climate change and impact on sea levels" vs. "tell me about climate change") · experiment with wording/structure · set guardrails in the prompt ("200 words or less… only technology challenges") · use discovery prompts for insight · break complex queries into parts (economic impacts / social effects as separate prompts)

## 3.5 RAG (Retrieval Augmented Generation)

**Definition**: augmenting LLM output by referencing a **knowledge base outside the model's training data**, retrieved at query time and added to the prompt.

**Knowledge-base implementations**:
- **Relational/index (e.g., Elasticsearch)** — keyword search → matching docs to the LLM
- **Vector database** (most common) — chunk → embed (transformer encoder) → store → **similarity search** with the embedded query
- **Hybrid** — keyword + similarity (sequential or parallel), optionally **re-ranked** (e.g., boost results found by both)
- **Graph RAG** — vectors + graph DB; **structure-aware chunking**; returns closest chunk *plus* related chunks from the knowledge graph
- **Direct model integration** — fine-tuning the knowledge in = *not RAG anymore*

**Benefits**: improved accuracy (the big one) · **source attribution** → transparency/explainability · contextual relevance (you pick the corpus) · strong vertical/domain handling
**Challenges**: pipeline complexity · added latency (search + LLM) · dependent on retrieval quality · extra infrastructure to host · harder/costlier tuning & maintenance

## 3.6 Vector Databases

- **Vector DB** — specialized store for high-dimensional embeddings; fast **similarity / nearest-neighbor** search
- 2D intuition: embed words → semantically similar words cluster geometrically; query "fruit" lands among the fruits; which neighbors return depends on search parameters
- Real embeddings are hundreds/thousands of dimensions

### AWS vector store options
| Service | Type | Serverless? | Notes |
|---|---|---|---|
| **OpenSearch** | Managed search (text + vector) | Yes | **The only one that can arrange embedding generation (externally)**; keyword + vector search |
| **Aurora PostgreSQL** | Cloud-native relational | Yes | **pgvector** plugin; store/search only |
| **RDS PostgreSQL** | Traditional managed relational | **No** | **pgvector**; store/search only |
| **Neptune** | Managed **graph** DB | Yes | Gremlin/SPARQL clients; natural fit for graph RAG |
| **DocumentDB** | MongoDB-compatible document store | No | Store/search only |

**Exam fact**: every option except OpenSearch requires embeddings to be **generated before insertion**.

## 3.7 Customizing Foundation Models — the Cost Ladder

Low → high effort/cost: **in-context learning → RAG → fine-tuning → pre-training (build your own)**

| Method | Compute | Data | Speed | Watch out |
|---|---|---|---|---|
| **In-context learning** | Low (no training) | None | Instant, mid-conversation | Limited customization; bounded by model's bias/guardrails; resets per conversation |
| **RAG** | Moderate–high, spread out (ingestion cost + search latency) | Your document corpus | Moderate | Extra infrastructure tier, data management |
| **Fine-tuning** | Moderate (GPUs/TPUs) | Small can work | **15–30 minutes possible** | **Overfitting** if the dataset is small/unrepresentative |
| **Pre-training** | Very high (GPUs/TPUs, time) | Massive, high-quality, pre-processed | Slowest | Needs deep expertise; payoff = highest potential performance |

**Build vs. buy decision factors**: required performance vs. investment (business value) · availability of high-quality **domain data** (little data → fine-tune, don't build) · expertise (from-scratch demands the most). Most workloads don't need from-scratch.

### Fine-tuning methods
- **Instruction tuning** — retrain on **prompt + desired-output pairs** (structured/JSON); improves command execution; great for interactive apps (Alexa: "play my favorite playlist" → action)
- **Domain adaptation** — fine-tune on a domain corpus (legal/medical); ROSS Intelligence on case law/statutes; **combining with RAG is even stronger and cuts hallucinations**
- **Transfer learning** — reuse a pre-trained model for a **new related task** (BERT → sentiment analysis), optionally fine-tune further
- **Continuous pre-training** — periodically extend training with fresh data; stays current, gradually reduces bias/toxicity (X/Twitter feeding recommendation models new posts/trends)

### Data preparation for FM training
- **Curation** (two passes): rigorous selection (drop irrelevant and **low-quality** data) + contextual relevance check — required even for fine-tuning
- **Governance & compliance**: framework for data use/storage/access at scale; follow GDPR/HIPAA-style controls
- **Labeling**: clear high-quality labels; **annotation accuracy** may need subject-matter experts
- **Diversity**: representative across demographics/contexts; mitigate found bias via **adversarial training** or fine-tuning with **counterexamples**
- **Size**: **quality over quantity** — enough to capture nuance without overfitting
- **RLHF** — human feedback (thumbs up/down, expert review) fed back into training; aligns the model with human goals/expectations; boosts satisfaction (also a human-centered design principle)

## 3.8 Generative AI Agents

- Generic agent = software acting autonomously on **predefined rules** (static)
- **GenAI agent** = generative AI inside agent software, for tasks rigid rules can't handle
- News-curation scenario — which task needs which:
  - Fetch article lists, check a deny list → **plain code**
  - Article length → character count works, but GenAI can intelligently strip headers/footers first
  - **Relevance scoring, summarization, sentiment** → **LLM**
- Architecture pattern: **scheduler → job-initiator function** (reads config from parameter storage) → **message queue** → LLM relevance-scoring function with a **threshold** → second queue → LLM summary + sentiment function → **NoSQL store** for the UI
- Design lessons: event-driven, queue-decoupled; LLMs only where judgment is needed; **account for nondeterminism in thresholds** (same input, different scores)
- AWS tie-in: **Bedrock Agents / AgentCore** provide managed agent orchestration

## 3.9 Evaluating Foundation Models

### Automated metrics
- **ROUGE** (Recall-Oriented Understudy for Gisting Evaluation) — **summarization**; overlap between generated and reference text; higher = better
  - **ROUGE-N** — N-gram overlap (ROUGE-1 = unigrams; e.g., 8 of 10 unigrams shared → 0.8)
  - **ROUGE-L** — **longest common subsequence**
  - N-gram = contiguous sequence of N items (words/characters/punctuation)
- **BLEU** (Bilingual Evaluation Understudy) — **machine translation**; N-gram comparison against a reference translation; penalizes overly short translations
- **BERTScore** — **semantic similarity** via BERT embeddings (meaning, not exact words): embed both → vector similarity → precision/recall → **F1**

Hook: **ROUGE = summaries · BLEU = translation · BERTScore = meaning**

### Human evaluation vs. benchmarks
- **Human assessors** — open conversation, Q&A; judge coherence, relevance, factuality, quality. The **gold standard**, but slow, expensive, unscalable
- **Benchmark datasets** — standardized tasks/metrics: **GLUE** (language understanding), **SuperGLUE** (harder GLUE), **SQuAD** (question answering), **WMT** (translation). Advantages: objectivity/standardization, topic coverage, progress tracking over time
- Why evaluate: verify expectations, find per-task strengths/weaknesses, align with strategy; business side — better decisions, customer experience, innovation
- AWS tie-in: **Bedrock Model Evaluation** offers automated and human-based model evaluation

---

# DOMAIN 4 — Guidelines for Responsible AI

## 4.1 The Six Pillars

| Pillar | Definition | Techniques / notes |
|---|---|---|
| **Bias** | Systematic favoritism/prejudice → skewed results | Anti-bias metrics, correction techniques; can perpetuate inequality |
| **Fairness** | Impartial, equitable outcomes | **Individual fairness** (similar people, similar treatment) vs. **group fairness** (groups similar in aggregate); critical in hiring/lending/justice |
| **Inclusivity** | Serves all demographics incl. underrepresented groups | Diverse dev teams, inclusive training data, all users considered |
| **Robustness** | Reliable under varied conditions incl. **adversarial attack** | Adversarial training; edge-case testing |
| **Safety** | No harm to humans/environment | Predictability, transparent decisions, error recovery; critical in healthcare/AVs |
| **Veracity** | Truthful, accurate output | The anti-hallucination pillar; verified data integrity + explainability |

## 4.2 Responsible Dataset Characteristics

- **Inclusivity** — wide range of people/cultures/perspectives (gender, race, age, dialects, accessibility)
- **Diversity** — varied data reflecting real-world complexity (demographics, urban/rural, developed/developing) → better generalization
- **Curated sources** — reliable, high-quality (verified academic/government databases, expert annotations) → integrity, less noise
- **Balanced** — equal/proportionate class representation → avoids **class imbalance**; addresses under-/over-sampling

## 4.3 Bias & Variance (the statistical pair — distinct from fairness-bias)

- **Bias** (statistical) — error from an **oversimplified model** approximating a real problem
- **Variance** — error from **sensitivity to small fluctuations** in training data
- **Overfitting** — model memorizes training data (noise included); training error → ~0 but **validation error bottoms out then climbs**; = low bias + **high variance**; cause: excess complexity or a too-small fine-tuning set
- **Underfitting** — model too simple to capture patterns; training AND validation error both stay high; = **high bias** + low variance
- Goal: the bias–variance trade-off sweet spot
- Real-world effects: statistical bias → wrong specifically for certain groups (facial recognition); high variance → unpredictable generalization (hiring model favoring clones of past hires)
- Sources of fairness-bias: **training data bias** (skewed/incomplete data) and **algorithmic bias** (model design)

## 4.4 Transparency & Explainability

- **Transparency** — internal processes are **visible and interpretable**; traceable decisions; typical of simple models (decision trees, linear regression); easier to debug, trust, and deploy in regulated industries
- **Explainability** — output can be **explained in human terms**, even for complex models; includes **post-hoc explanations of black boxes**
- Non-transparent/un-explainable — deep neural nets, GANs; high accuracy on complex tasks, but debugging/trust/accountability suffer
- **Interpretability** — the ability to explain *why* a specific decision was made
- Trade-off: simple = trustworthy but may underperform; complex = powerful but opaque

### Safety ↔ transparency trade-offs
- Transparency helps detect/correct harm — but may **expose exploitable details**
- Safety layers (filters, guardrails) can **reduce performance/effectiveness** and business value
- **High transparency + low safety** = simple interpretable model that may miss needed complexity; **low transparency + high safety** = deep net that performs but can't be interpreted
- Pitfalls: **overfitting to safety** (overly conservative, uncreative output) · no cross-industry standardization · stakeholder/business-value trade-offs

## 4.5 AWS Responsible-AI Tooling

| Tool | Role |
|---|---|
| **Bedrock Guardrails** | Customizable safeguards on Bedrock: **content filters** (hate/violence), **custom denied topics**, **PII/sensitive-info redaction**, **hallucination detection via contextual grounding** |
| **SageMaker Clarify** | Detect & mitigate **bias** — during training (before deployment) and continuing in production; decision-making insight |
| **SageMaker Model Monitor** | Production **drift** watch: model drift, data drift, feature distribution, data quality, performance degradation; auto-notifications, no manual metric setup |
| **Amazon A2I (Augmented AI)** | **Human review** in the prediction loop — verify or override predictions; adaptable (healthcare, finance) |
| **SageMaker Model Cards** | **Version-controlled governance documentation**: overview, intended uses, **risk rating**, evaluation metrics, training details; supports audits |
| **Comprehend Medical** | Detects medical-specific sensitive information (complements Guardrails in health workloads) |

Hooks: **Guardrails = filter the output · Clarify = bias · Model Monitor = drift · A2I = humans · Model Cards = paperwork**

### Model Card risk ratings
- **Low** — reliable/safe for intended purpose (well-tested e-commerce recommender)
- **Medium** — mostly suitable; some performance/fairness concerns; monitor (churn model on limited data)
- **High** — **known limitations**: bias, poor generalization, performance issues; don't deploy without extensive validation (racially biased facial recognition for law enforcement)
- **Unknown** — insufficient information (brand-new model on experimental data, never in production)

### Reference build: healthcare virtual assistant
Bedrock (FMs) + Guardrails (filter/redact/ground) + Comprehend Medical (medical PII) + SageMaker (tuning on health data) + IAM (access control) + Lambda (real-time content checks) + CloudWatch (metrics, logs, **alarms** when harmful content slips through)

## 4.6 Legal Risks of GenAI

- **IP infringement** — content resembling copyrighted work; unresolved ownership of AI output (user? training-data owners?); derivative-work disputes
- **Biased/discriminatory output** — potential **anti-discrimination law** violations (hiring, lending)
- **Loss of customer trust** — opaque decisions, error-driven experiences; need **clear AI-use disclosure**
- **End-user risks** — privacy violations, data misuse, users generating harmful/defamatory content with legal repercussions
- **Hallucinations** — misinformation spread; liability for false authoritative content (fake article moving a stock)

## 4.7 Environmental Impact & Model Right-Sizing

- Large models → more powerful hardware → more energy; scale example: GPT-4 training ≈ tens of MWh (a car's lifetime energy)
- Practices: **efficient algorithms**, lighter versions of large models, **carbon-aware training** (renewables/offsets), efficiency metrics (**performance per unit energy**), sustainable cloud providers, carbon-offset/neutral programs
- Predictive-maintenance lesson: **a decision tree or simple regression may be all you need — not an LLM.** Right-size the model to the problem

## 4.8 Human-Centered Design

Products that are intuitive, easy to use, and meet users' needs; for AI: understandable, explainable, effective.
- **Amplified decision-making** (high-stakes support): clarity, simplicity (no overload), usability for all levels, **reflexivity** (promotes reflection), **accountability** (consequences attach to decisions)
- **Unbiased decision-making**: identify/assess biases, transparent fair processes, **train the decision-makers** to spot and mitigate bias
- **Human + AI learning**: **cognitive apprenticeship** (AI learns from human guidance), personalization, user-centered tooling
- **RLHF** — see §3.7; the human-feedback alignment loop

---

# DOMAIN 5 — Security, Compliance, and Governance

## 5.1 Prompt-Level Attacks & Mitigations

| Attack | When | What |
|---|---|---|
| **Exposure** | Inference | Poorly crafted prompts leak sensitive/confidential data — even the model's own internals |
| **Poisoning** | **Training** | Adversary manipulates training data/inputs to corrupt behavior (e.g., skewing sentiment analysis) — severe in regulated industries |
| **Hijacking** | Inference | Crafted prompts seize control of output (fake news, botnet disinformation) |
| **Jailbreaking** | Inference | Bypassing safety guardrails — classic vector: role-play framing ("you're a journalist interviewing an arrested terrorist…") |
| **Prompt injection** | Inference | Malicious prompts fed into the system to alter behavior/output → **validate & sanitize inputs, monitor outputs**, continuously test |

Mitigation stack: robust safety protocols + content moderation · regular audits/tests against published vulnerabilities · ethical-use guidelines with clear harmful-prompt definitions.

## 5.2 Shared Responsibility Model

- **IaaS** — AWS: hardware, global infrastructure, compute/storage/DB/network, service API endpoints. **Customer: guest OS → data** (network security/firewalls, server-side encryption, platform management)
- **PaaS** — AWS also takes guest OS, platform/app management, server-side encryption
- **SaaS** — AWS takes still more
- Rule: **more managed = less customer security responsibility**, traded against flexibility/configurability. Applies fully to AI workloads. (This is also why compliance is easier: AWS's side is pre-certified — you still certify your workload.)

## 5.3 Encryption Everywhere

- In transit: **TLS/SSL** at every tier (CDN, load balancer, app, file system, DB, warehouse, object storage)
- At rest: block-storage/KMS encryption with **customer-configurable keys**; N/A where data never persists (load balancer)
- Standard: strong encryption like **AES-256** with proper key management, covering **model inputs and outputs** too
- Key services: **ACM** (TLS certs) · **KMS** (symmetric/asymmetric keys) · **CloudHSM** (single-tenant, hardware-backed — data warehouses)

## 5.4 Data Protection & Network Privacy Services

- **Macie** — **classifies sensitive data** per privacy frameworks; analyzes access permissions for inappropriate grants; severity-organized findings
- **PrivateLink** — private VPC ↔ AWS-service (and on-prem) connectivity; traffic never crosses the multi-tenant/public network
- **VPC endpoints** — keep S3/DynamoDB traffic inside the VPC (see §2.8)

## 5.5 Data Provenance

- **Source citation** — document who created data, how gathered, timestamps → integrity, trust, ownership/accountability, regulatory provenance requirements
- **Data lineage** — trace flow **source → transformations → destination**; visualize the journey, find pipeline errors, scope blast radius
- **Data cataloguing** — central repository of sources/definitions/metadata with classification and search → discovery, sharing, governance, efficiency
- Hook: **citation = where it came from · lineage = where it went · catalog = where to find it**

## 5.6 Secure Data Engineering (problem → solution pattern)

| Problem | Solution |
|---|---|
| **Data quality** (uncontrolled sources, mixed formats, dupes) | Ingestion-stage detection/removal of incomplete, faulty, duplicate data |
| **Privacy** (sensitive records exposed) | **Homomorphic encryption** — data stays encrypted **even during processing**; even internal admins can't read it |
| **Access control** | **ABAC** — permissions from user attributes + data properties + request properties, not just identity, enforced everywhere |
| **Integrity** (corruption in transit/storage) | Encryption + **checksums**: generate at ingestion; every processing task re-verifies first |

## 5.7 AI Workload Security Practices

- **Application security** — secure coding, security audits, penetration testing, patch management
- **Threat detection** — real-time monitoring, abnormal behavior/drift detection, input/output anomaly detection
- **Vulnerability management** — patches plus **AI-specific threats: adversarial attacks, model inversion** (reverse-engineering predictions)
- **Infrastructure protection** — encrypted storage, secure access roles, automated failover/high availability

## 5.8 AWS Governance & Compliance Services

| Service | Role | Hook |
|---|---|---|
| **Config** | Records **resource configurations**; change timelines; compliance **rules** flag non-compliant resources with mitigation | *what things ARE* |
| **CloudTrail** | **API activity audit trail** (requests + outcomes); logs to S3 for long-term storage | *what things DID* |
| **Inspector** | Scans workloads for **software vulnerabilities** (CVE database); EC2 network-exposure checks | *what's vulnerable* |
| **Audit Manager** | Organizes findings/evidence into **compliance-framework reports**; integrates Security Hub + service APIs | *your evidence* |
| **Artifact** | On by default: **AWS's auditor-issued reports**, certifications, attestations | *AWS's evidence* |
| **Trusted Advisor** | **Well-Architected checks** (incl. security); free + premium; best-practice reports | *recommendations* |

Scenario flow (fintech, GDPR + SOC 2): Config monitors configuration compliance → Inspector scans for vulnerabilities → Audit Manager gathers your evidence → Artifact supplies AWS's → CloudTrail centralizes the audit trail → Trusted Advisor recommends improvements.

## 5.9 Data Governance

**Definition**: managing data securely, ethically, effectively across its **entire lifecycle**; guarantees accuracy, availability, integrity, security — all auditable.

**GenAI data lifecycle**: collection (diverse sources) → pre-processing → training → deployment → **archiving & deletion** — governance applies at every stage.

Supporting practices:
- **Data logging** — record data-usage activities (compliance, troubleshooting, transparency, performance monitoring)
- **Residency & sovereignty** — *where* data physically lives; regulations may pin it to a geography
- **Monitoring & observation** — continuous tracking of usage/behavior/compliance; catch anomalies and unauthorized access
- **Retention & deletion** — keep the **minimum necessary** (storage costs); delete **securely** and compliantly

## 5.10 Governance Protocols & Compliance Standards

**Six governance-protocol elements**: policies · review cadence · review strategies · governance frameworks · transparency standards · team training requirements

**AI compliance focus areas**: algorithm accountability · data privacy & security · ethical deployment (bias)

**Standards to recognize**:
- **ISO** — International Organization for Standardization (global, includes AI standards)
- **SOC** — System and Organization Controls, from the **AICPA** (service/data-handling controls; SOC 2 most cited)
- **GDPR** — EU data privacy regulation
- **CCPA** — California's consumer-privacy law (GDPR-like, California-scoped)
- Sector overlays seen in scenarios: **HIPAA** (health data)

---

# CONSOLIDATED SERVICE INDEX (one-line service matching)

**Core AI services**: SageMaker (build/train/deploy ML, full-control to no-code) · Transcribe (**speech→text**; domain models, PII masking) · Polly (**text→speech**; voices, style/speed/pitch) · Translate (languages; real-time + batch; custom terminology) · Comprehend (text insight: keywords, phrases, **sentiment**, classification) · Comprehend Medical (medical PII/entities) · Lex (**chatbots**, voice + text) · Rekognition (computer vision)* · Textract (document data extraction)* · Personalize (recommendations)* · Fraud Detector (fraud)* — *(starred services aren't in this course but appear on the exam's service list)*

**GenAI**: Bedrock (FMs via one API, serverless; Guardrails, Agents, Model Evaluation, Prompt Management) · JumpStart (pre-trained models in your VPC) · PartyRock (no-code playground) · Q Developer (code) · Q Business (enterprise data)

**SageMaker pipeline features** (know the order): **Data Wrangler/Canvas** (low/no-code data prep) → **Feature Store** (store/share features; time travel) → **Training** (at scale, built-in/custom algorithms) → **MLflow/Experiments** (track metrics, fine-tuning experiments) → **Processing** (scripts/notebooks; model evaluation) → **Model Registry** (catalog, versions, approval status) → **Deployment** (instance-type choice, performance/cost) → **Model Monitor** (production quality; continuous + scheduled batch) — orchestrated end-to-end by **SageMaker Pipelines**

**Responsible AI**: Clarify (bias) · Model Monitor (drift) · A2I (human review) · Model Cards (governance docs + risk ratings) · Bedrock Guardrails (filters, topics, redaction, grounding)

**Security & governance**: IAM (permissions) · KMS/ACM/CloudHSM (keys/certs/HSM) · Macie (sensitive-data classification) · PrivateLink & VPC endpoints (private connectivity) · Config (configuration state) · CloudTrail (API activity) · Inspector (vulnerabilities) · Audit Manager (your compliance evidence) · Artifact (AWS's compliance reports) · Trusted Advisor (best-practice checks) · CloudWatch (metrics, logs, alarms)

---

# HIGH-YIELD FACTS (last-pass review)

1. AI ⊃ ML ⊃ deep learning ⊃ LLMs; pre-training is self-supervised, fine-tuning is supervised
2. Labeled→supervised, unlabeled→unsupervised, feedback→reinforcement
3. Algorithm match: linear regression=numbers, logistic=binary, KNN=recommendations, PCA=dimensionality reduction, K-means=segments, DBSCAN=anomalies
4. Batch inference = accuracy/throughput; real-time = latency
5. Hyperparameters are set before training; weights are learned
6. Overfit: train error ↓, validation error ↑ (high variance). Underfit: both stay high (high bias)
7. Metrics: F1 for imbalanced classes; AUC-ROC 0.5=random, >0.9=optimal; MSE/R² for regression
8. FM metrics: ROUGE=summarization, BLEU=translation, BERTScore=semantics; benchmarks GLUE/SuperGLUE/SQuAD/WMT
9. Diffusion=images-from-noise, GAN=generator vs. discriminator, VAE=time-series anomalies, multimodal=multiple media
10. Temperature=randomness, Top K=candidate count, Top P=probability mass
11. Prompt priority: model bias > system message > user prompt; assistant message formats output
12. Customization cost ladder: in-context < RAG < fine-tuning < pre-training; fine-tuning risk = overfitting; fine-tuning can take 15–30 min
13. RAG = external knowledge at query time; benefits accuracy + source attribution; costs latency + complexity
14. Chunk→embed→store→similarity search; chunk size & overlap (in tokens) are the tuning knobs; **only OpenSearch handles embedding generation**; pgvector = Aurora/RDS PostgreSQL
15. Bedrock = serverless multi-provider FM API; JumpStart = pre-trained in your VPC; Q Developer=code, Q Business=company data; PartyRock=no-code
16. Token-based pricing; provisioned throughput = pay whether used or not
17. Six responsible-AI pillars: bias, fairness (individual vs. group), inclusivity, robustness, safety, veracity
18. Clarify=bias, Model Monitor=drift, A2I=human review, Model Cards=documentation (low/medium/high/unknown risk)
19. Guardrails: content filters, denied topics, PII redaction, contextual-grounding hallucination detection
20. Attacks: poisoning=training time; hijacking/jailbreaking/injection=inference time; model inversion=reverse-engineering predictions
21. Shared responsibility: more managed service = less customer security burden
22. Config=configuration state, CloudTrail=API activity; Audit Manager=your evidence, Artifact=AWS's evidence
23. Macie=find sensitive data; PrivateLink/VPC endpoints=keep traffic private; ABAC=attributes not just identity; homomorphic encryption=process while encrypted
24. Data provenance: citation (origin) → lineage (journey) → catalog (findability); residency = where data physically lives
25. GDPR=EU privacy, CCPA=California, SOC=AICPA controls, ISO=international standards, HIPAA=health
26. Right-size the model: a decision tree may beat an LLM on cost, energy, and explainability
27. AI anti-pattern tells: accountability, reproducibility, regulatory sign-off, moral judgment → human required
28. Business metrics: conversion rate, ARPU, CLV, task completion, pre-AI vs. post-AI comparison; goal is beating the human baseline, not perfection
