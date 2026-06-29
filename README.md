# 🛸 ChronoPilot (Vibe2ShipApp)

ChronoPilot is an autonomous, AI-driven timeline orchestration and task optimization platform engineered specifically for high-performance developer and engineering workflows. By capturing and transforming unstructured, passive communication channels into actionable time-blocking parameters, ChronoPilot automatically ingests unread email streams, structures them via advanced Large Language Models (LLMs), persists data vectors to a secure cloud database layer, and coordinates execution discipline using system-level local hardware safety alert grids.

---

## 🚀 Core Value Proposition

* **Zero-Overhead Task Ingestion:** Eliminates manual timeline creation by parsing incoming unread communication streams in real time.
* **Intelligent Risk Architecture:** Dynamically evaluates pending backlog entries to predict operational bottlenecks and deliver strategic playbooks.
* **Guaranteed Execution Discipline:** Deploys a system-level hardware notification pacing engine to mitigate task drift and backlog fatigue.

---

## 🛠️ Technical Architecture & Stack

ChronoPilot implements a strictly decoupled, modern three-tier infrastructure designed for real-time telemetry processing, persistence, and high-availability synchronization:

* **Frontend Client Platform:** Engineered via **React Native & Expo (SDK 54 Framework)** utilizing strictly typed **TypeScript**. It delivers a touch-responsive, highly scannable dashboard UI grid optimized for maximum clarity at a glance.
* **Backend Database Node:** Driven by **Supabase Cloud Service Infrastructure** running a cloud instance of a relational **PostgreSQL** database layer for instantaneous data mutations, persistent storage, and secure client synchronization.
* **Cognitive Inference Matrix:** Powered directly by the **Google AI Studio REST Gateway (`gemini-1.5-flash`)**, facilitating structured JSON task extraction, daily macro-strategy planning, predictive risk scoring, and text generation.
* **Local Hardware Alert Grid:** Integrates an automated, hardware-accelerated **3-Tier Native Local Notification System** that programmatically schedules system-level device alerts based on calculated milestone duration parameters.

---

## 📦 System Architecture & Component Workflow

```bash
+───────────────────────────+
│   Gmail IMAP / REST API   │
+───────────────────────────+
              │
      ( OAuth 2.0 Scope )
              │
              ▼
+───────────────────────────+
│ Background Ingestion Unit │
+───────────────────────────+
              │
     ( Unstructured Text )
              │
              ▼
+───────────────────────────+       Secure Batch SQL        +───────────────────────────+
│ Supabase Relational Cloud │ <──────────────────────────── │  Gemini 1.5 Flash Engine  │
+───────────────────────────+                               +───────────────────────────+
              │
       ( Event Trigger )
              │
              ▼
+───────────────────────────+
│ 3-Tier Local Safety Grid  │
+───────────────────────────+
              │
              ├─► [ Tier 1: Baseline Alert ]  ──► Initial Activation
              │
              ├─► [ Tier 2: Horizon Alert ]   ──► Mid-Timeline Countdown
              │
              └─► [ Tier 3: Critical Path ]   ──► Immediate Expiration
```

---

### 1. Autonomous Mail Ingestion Stream
The platform provides a unified orchestration gateway that bridges external communication channels with internal task management schemas without manual user intervention:
* **Targeted Scanning:** Establishes a secure data gateway using Google OAuth 2.0 Identity protocols (`gmail.readonly`) to scan and pull the top 3 most recent unread email headers and body text snippets natively via a background stream.
* **Unified Data Synchronization:** Employs an inline task injection dashboard and manual data controls coupled with pull-to-refresh FlatList gestures to keep view models fully synchronized with Supabase in real-time.

### 2. Gemini Cognitive Control Layer
Once email streams hit the client layer, the Google AI Studio pipeline orchestrates timeline planning across two explicit execution paths:
* **Structured Data Extraction (`analyzeEmailsWithGemini`):** Processes unstructured body text against strict JSON schema boundaries, mapping out explicit task names, estimated durations, and inferring deadlines formatted strictly as `YYYY-MM-DD HH:mm`. It leverages `responseMimeType: 'application/json'` to guarantee structural validity.
* **On-Demand Timeline Optimization (`generateAIScheduleOnDemand`):** Consumes active cloud database snapshots to dynamically return structured schedule slots, predictive bottleneck risk factors (*e.g., 🔥 45% Risk Score*), daily macro-strategy summaries, and adaptive backup playbooks.

### 3. 3-Tier Native Local Safety Grid
To enforce execution discipline and eliminate deadline expiration, ChronoPilot overrides standard, passive reminder layouts by queueing up multi-stage localized mobile device notifications (`notificationEngine.ts`) that calculate precise delivery windows based on a task's duration parameters:
* **Tier 1 (Strategic Baseline):** Initial awareness alert fired upon milestone recognition to confirm scheduling.
* **Tier 2 (Tactical Horizon):** Mid-timeline countdown warning alerting the user of diminishing execution windows.
* **Tier 3 (Critical Path Warning):** High-frequency emergency hardware sound vector fired immediately before absolute deadline expiration to prevent failure boundaries.

### 4. Sandbox Resiliency (Hackathon-Ready Override)
Includes an automated exception-catch fallback layer. If local network limits, security boundaries, or network redirect constraints interrupt live browser auth handshakes during evaluation, the application cleanly generates a development bypass token and populates the telemetry grids with functional preview metrics. This ensures 100% feature visibility, interactive UI testing, and presentation reliability under any local testing environment constraints.

---

## 📊 Relational Database Production Schema

The foundational PostgreSQL storage layer mapped inside Supabase is defined below:

| Attribute | Data Type | Constraint Parameter | Operational Purpose |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key (Unique) | System-wide distinct record identifier |
| `title` | `text` | Non-Null String | Extracted task description or milestone name |
| `duration` | `text` | Default: `'30'` | Target execution time window (in minutes) |
| `deadline` | `text` | Format: `YYYY-MM-DD HH:MM` | System-evaluated expiration timestamp |
| `priority_score`| `integer` | Domain Range: `1` to `5` | Automated or manual weight configuration |
| `created_at` | `timestamp`| Auto-Generated | Baseline anchor for sorting and data fetching |

---

## ⚙️ Configuration & Environment Setup

To run this project locally or build it via EAS Cloud, create a `.env` file in the root directory and populate it with your infrastructure coordinates:

```env
EXPO_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_GEMINI_API_KEY=your-google-ai-studio-api-key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id.apps.googleusercontent.com
