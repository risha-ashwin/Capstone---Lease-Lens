# Capstone---Lease-Lens

# Lease Lens: Sign with confidence. Lease Reviewing made simple. 

Lease Lens is a web app that helps first-time renters — especially college students — make sense of complicated apartment lease agreements. Upload your lease PDF and get an AI-powered breakdown in plain language.


Features

Overview — Key property details, lease type, and estimated monthly costs at a glance
Clause Summaries — Each clause shown side-by-side with a plain-language explanation
Key Terms — Legal terminology decoded, no law degree required
Top 10 TLDR — The ten most important things to know before signing
Risk Detection — Flags unusual or high-risk clauses compared to standard student housing leases

Tech Stack

Frontend: React
Backend: Node.js / Express
AI: Google Gemini API
Database: PostgreSQL
OCR: Extracts text from uploaded PDF leases

Project Background
Lease Lens was built as a UW INFORMATICS Capstone project. Our research found that first-time renters, particularly college students, often sign leases without fully understanding the financial and legal commitments they're making. Generic online resources don't address lease-specific language, leaving renters vulnerable to hidden fees, unfavorable clauses, and missed deadlines.
Lease Lens bridges that gap by turning a complex legal document into something clear, structured, and easy to act on.


## Running locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and add a free Gemini API key from Google AI Studio.

3. Start the backend:

```bash
npm run server
```

4. In a separate terminal, start the React app:

```bash
npm start
```
