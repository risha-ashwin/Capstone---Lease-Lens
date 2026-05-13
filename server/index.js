const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { leaseAnalysisSchema } = require('./leaseAnalysisSchema');

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

const sampleLeaseAnalysis = {
  overview: {
    tldr:
      'This is a student housing contract running from September 20, 2025 to August 29, 2026 with a base monthly installment of $1,650. A $145 monthly concession may reduce the effective monthly cost, but only if you stay fully compliant. The lease includes significant extra fees, strict default rules, limited flexibility for ending the contract, and strong landlord protections around assignment, relocation, and rule enforcement.',
    lease_type: 'Student Housing Contract / Bedroom Lease',
    parties: [
      'Landlord / Agent: Landmark Venture Management, LLC (agent)',
      'Resident: Named tenant on contract'
    ],
    term_summary:
      'Fixed term from 09/20/2025 to 08/29/2026. The contract automatically expires on the end date unless extended in writing or terminated according to the contract terms.',
    financial_summary:
      'Base monthly installment is $1,650, with a possible $145 monthly concession. Potential additional monthly charges include $50 floor premium, $13.50 damage waiver fee, and $265 parking. Important one-time fees include a $500 assignment fee and $500 relocation fee.'
  },
  clause_summaries: [
    {
      title: 'Concession Terms',
      summary:
        'The lease offers a $1,740 concession applied as a $145 credit each month, but only while the resident remains fully compliant.',
      lease_quote:
        '"The Concession shall only apply if the following conditions are met... If Resident defaults... the total amount of the Concession shall be forfeited."',
      why_it_matters:
        'If the contract ends early or the resident defaults, the full concession can be canceled and may have to be repaid to the landlord.',
      risk_level: 'high'
    },
    {
      title: 'No-Cause Early Termination',
      summary:
        'The resident may terminate early only by giving notice and paying a no-cause termination fee.',
      lease_quote:
        '"Resident may terminate early... by paying a no-cause termination fee equal to the lesser of the remaining installments or six months of installments."',
      why_it_matters:
        'That fee can be very expensive because it is the lesser of the remaining monthly installments or six months of installments.',
      risk_level: 'high'
    },
    {
      title: 'Late Payment Rules',
      summary:
        'Rent is due monthly and late fees apply if payment is not made on time.',
      lease_quote:
        '"If payment is not made on time, late fees and other default remedies may apply under the Contract."',
      why_it_matters:
        'The lease includes timing language around late payment that should be reviewed carefully because penalties can begin quickly.',
      risk_level: 'medium'
    },
    {
      title: 'Assignment and Subletting',
      summary:
        'Subletting is prohibited, and assignment is only allowed with landlord approval and payment of a $500 assignment fee.',
      lease_quote:
        '"Subletting is prohibited. Assignment requires Landlord approval and payment of an assignment fee."',
      why_it_matters:
        'This makes it difficult and expensive to leave the lease by finding a replacement tenant.',
      risk_level: 'high'
    },
    {
      title: 'Roommate and Relocation Control',
      summary:
        'The landlord may assign any gender roommate to vacant bedrooms and may relocate the resident under the contract terms.',
      lease_quote:
        '"Landlord may assign roommates to vacant bedrooms and may relocate Resident to another bedroom or unit within the Facility."',
      why_it_matters:
        'The resident has limited control over who lives in the unit and where within the property they may be placed.',
      risk_level: 'medium'
    },
    {
      title: 'Guest Restrictions',
      summary:
        'Guests may not stay more than two consecutive days or nights without written consent.',
      lease_quote:
        '"Guests may not stay more than two consecutive days or nights without Landlord\'s prior written consent."',
      why_it_matters:
        'If the landlord believes someone is staying too long, the resident can be charged $25 per day and face default consequences.',
      risk_level: 'medium'
    }
  ],
  key_terms: [
    {
      term: 'Contract Term',
      value: '09/20/2025 to 08/29/2026',
      plain_english:
        'You are financially responsible for the lease during this full period unless the contract is ended under one of its specific termination rules.'
    },
    {
      term: 'Monthly Installment',
      value: '$1,650',
      plain_english:
        'This is the base monthly housing payment due under the contract.'
    },
    {
      term: 'Concession',
      value: '$145 monthly credit ($1,740 total)',
      plain_english:
        'This lowers the effective monthly cost, but only if you stay compliant with the lease. If you default or leave early, you may lose it.'
    },
    {
      term: 'No-Cause Termination Fee',
      value: 'Lesser of remaining rent or 6 months of installments',
      plain_english:
        'Ending the lease early without another legal reason can be very expensive.'
    },
    {
      term: 'Parking Fee',
      value: '$265/month',
      plain_english:
        'Parking is not included in base rent and adds a large extra monthly cost if selected.'
    },
    {
      term: 'Monthly Premium Fees',
      value: '$50 floor premium',
      plain_english:
        'This is an extra monthly charge added on top of the base monthly installment.'
    },
    {
      term: 'Damage Waiver Program Fee',
      value: '$13.50/month',
      plain_english:
        'This is an extra recurring monthly fee related to property damage coverage requirements.'
    },
    {
      term: 'Assignment Fee',
      value: '$500',
      plain_english:
        'If the landlord allows you to transfer the lease to someone else, this fee applies.'
    },
    {
      term: 'Unauthorized Person Charge',
      value: '$25/day',
      plain_english:
        'If someone stays longer than allowed and the landlord treats them as an unauthorized occupant, this charge may apply.'
    }
  ],
  top_10_things: [
    'Your base monthly cost is $1,650, but your real monthly cost may be higher once premium fees, damage waiver charges, parking, or pet charges are added.',
    'The $145 monthly concession is not guaranteed forever. If you default or terminate early, you may lose the full concession and have to repay it.',
    'The lease term is long and fixed: September 20, 2025 through August 29, 2026.',
    'Ending the lease early can be very expensive because the no-cause termination fee can equal up to six months of installments.',
    'Subletting is prohibited, and assignment requires landlord approval plus a $500 assignment fee.',
    'The landlord can place any gender roommate in vacant bedrooms, so the unit may not remain single-gender or roommate-selected.',
    'Guests may not stay more than two consecutive days or nights without written consent.',
    'Parking is a separate major monthly charge at $265 if you choose to use it.',
    'The contract includes broad landlord protections, including relocation rights, strong default remedies, and an arbitration clause.',
    'Amenities can be removed or unavailable without giving you a right to reduce rent or terminate the contract.'
  ],
  risk_flags: [
    {
      flag: 'Concession can be canceled and repaid if you default or leave early.',
      severity: 'high'
    },
    {
      flag: 'No-cause termination fee can be very costly.',
      severity: 'high'
    },
    {
      flag: 'Subletting is prohibited and assignment is expensive.',
      severity: 'high'
    },
    {
      flag: 'Additional monthly fees can materially increase total housing cost.',
      severity: 'medium'
    },
    {
      flag: 'Landlord has broad discretion over roommate assignment and relocation.',
      severity: 'medium'
    }
  ]
};

const createLeaseAnalysisPrompt = (fileName) => `
You are analyzing a residential lease PDF for a student-facing lease review dashboard.

Read the uploaded PDF carefully and extract the lease terms into the exact structured format requested by the schema.

Requirements:
- Focus on facts grounded in the document.
- Use plain English for all summaries.
- For each clause summary, set "lease_quote" to a short verbatim quote copied from the uploaded lease document itself.
- The "lease_quote" value must be exact lease language, not a paraphrase, explanation, or invented sample quote.
- Keep each "lease_quote" brief and specific, ideally one sentence or phrase that directly supports the clause summary.
- If no exact supporting language can be located for a clause, use "Exact quote not clearly found in lease" for "lease_quote".
- Be specific with dates, fees, penalties, concessions, deposits, notice rules, and termination language when available.
- If the lease does not clearly state a value, use "Not clearly stated in lease".
- Keep "top_10_things" concise, practical, and easy for a student renter to scan.
- Assign risk levels using these exact definitions:
  - "high": clause can materially affect cost, legal exposure, trap the tenant, or require them to stay longer/leave early than desired (e.g. auto-renewal, early termination fees, concession forfeiture, landlord entry without notice)
  - "medium": clause has conditional impact or requires tenant awareness but is manageable (e.g. late fees, guest restrictions, maintenance responsibilities, parking charges)
  - "low": clause is standard lease language with minimal financial or legal risk to the tenant (e.g. noise rules, recycling policy, basic maintenance like changing lightbulbs)
- Do not include markdown fences or extra commentary.
- The uploaded filename is "${fileName}".
`;

const verifyLeaseDocument = async (file) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: file.mimetype,
              data: file.buffer.toString('base64'),
            },
          },
          {
            text: 'Is this document a residential lease or rental agreement? Reply with only YES or NO.'
          }
        ]
      }],
      generationConfig: { temperature: 0 }
    })
  });

  const payload = await response.json();
  const answer = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase();
  return answer === 'YES';
};


const analyzeLeaseWithGemini = async (file) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: file.mimetype,
                data: file.buffer.toString('base64'),
              },
            },
            {
              text: createLeaseAnalysisPrompt(file.originalname),
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: leaseAnalysisSchema.schema,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errorBody}`);
  }

  const payload = await response.json();
  const responseText = payload?.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text;

  if (!responseText) {
    throw new Error('Gemini API did not return structured text.');
  }

  return JSON.parse(responseText);
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: GEMINI_API_KEY ? 'gemini-analysis' : 'mock-analysis'
  });
});

app.post('/api/analyze-lease', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'A PDF file is required.' });
  }

   if (GEMINI_API_KEY) {
    const isLease = await verifyLeaseDocument(req.file);
    if (!isLease) {
      return res.status(400).json({
        error: 'This does not appear to be a lease document. Please upload a residential lease or rental agreement.'
      });
    }
  }

  try {
    const analysis = GEMINI_API_KEY
      ? await analyzeLeaseWithGemini(req.file)
      : sampleLeaseAnalysis;

    return res.json({
      fileName: req.file.originalname,
      processedAt: new Date().toISOString(),
      analysis,
      source: GEMINI_API_KEY ? 'gemini' : 'mock'
    });
  } catch (error) {
    console.error('Lease analysis failed:', error);
    return res.status(500).json({
      error: 'Failed to analyze lease.',
      details: error.message
    });
  }
});

const port = process.env.API_PORT || process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Lease Lens API listening on http://localhost:${port}`);
});
