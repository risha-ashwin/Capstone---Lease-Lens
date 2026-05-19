# Lease Lens

**Sign with confidence. Lease reviewing made simple.**

Lease Lens reads your PDF lease and returns a plain-English dashboard — risk flags, key terms, clause summaries, and a top-10 list of things to know before you sign. No law degree required.

---

## About

Lease Lens is an independent project built at the University of Washington to solve a real problem student renters face every year: signing leases they don't fully understand.

First-time renters — particularly college students — often sign without fully grasping the financial and legal commitments they're making. Generic online resources don't address lease-specific language, leaving renters vulnerable to hidden fees, unfavorable clauses, and missed deadlines. Lease Lens bridges that gap by turning a complex legal document into something clear, structured, and easy to act on.

The tool is free to use and requires a Google or Microsoft account to upload and save analyses.

---

## Features

- **Plain-English Overview** — lease type, term, parties, and a plain-English summary of your lease, upfront
- **Risk flags** — high, medium, and low severity issues ranked by importance
- **Key terms** — every important number (rent, fees, deposits, dates) extracted and explained
- **Clause summaries** — every clause rewritten so you know what you're agreeing to
- **Top 10 things to know** — the most critical facts about your specific lease
- **PDF report** — download and share your full analysis
- **My Leases** — save analyses to your account and return to them without re-uploading

---

## Tech stack

- **Frontend** — React, React Router, react-pdf
- **Backend** — Node.js, Express, Multer
- **AI** — Google Gemini (via Generative Language API)
- **Auth** — Firebase Authentication (Google and Microsoft OAuth)
- **Hosting** — GitHub Pages (frontend), self-hosted or cloud (backend)

---

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and add a free Gemini API key from [Google AI Studio](https://aistudio.google.com).

3. Start the backend:

```bash
npm run server
```

4. In a separate terminal, start the React app:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Disclaimer

Lease Lens is intended to help you understand your lease more clearly. It is **not legal advice**. For questions about your specific legal rights or obligations, consult a licensed attorney.
