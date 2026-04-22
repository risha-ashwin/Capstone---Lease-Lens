const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

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
      why_it_matters:
        'If the contract ends early or the resident defaults, the full concession can be canceled and may have to be repaid to the landlord.',
      risk_level: 'high'
    },
    {
      title: 'No-Cause Early Termination',
      summary:
        'The resident may terminate early only by giving notice and paying a no-cause termination fee.',
      why_it_matters:
        'That fee can be very expensive because it is the lesser of the remaining monthly installments or six months of installments.',
      risk_level: 'high'
    },
    {
      title: 'Late Payment Rules',
      summary:
        'Rent is due monthly and late fees apply if payment is not made on time.',
      why_it_matters:
        'The lease includes timing language around late payment that should be reviewed carefully because penalties can begin quickly.',
      risk_level: 'medium'
    },
    {
      title: 'Assignment and Subletting',
      summary:
        'Subletting is prohibited, and assignment is only allowed with landlord approval and payment of a $500 assignment fee.',
      why_it_matters:
        'This makes it difficult and expensive to leave the lease by finding a replacement tenant.',
      risk_level: 'high'
    },
    {
      title: 'Roommate and Relocation Control',
      summary:
        'The landlord may assign any gender roommate to vacant bedrooms and may relocate the resident under the contract terms.',
      why_it_matters:
        'The resident has limited control over who lives in the unit and where within the property they may be placed.',
      risk_level: 'medium'
    },
    {
      title: 'Guest Restrictions',
      summary:
        'Guests may not stay more than two consecutive days or nights without written consent.',
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

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: 'mock-analysis'
  });
});

app.post('/api/analyze-lease', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'A PDF file is required.' });
  }

  try {
    return res.json({
      fileName: req.file.originalname,
      processedAt: new Date().toISOString(),
      analysis: sampleLeaseAnalysis
    });
  } catch (error) {
    console.error('Lease analysis failed:', error);
    return res.status(500).json({
      error: 'Failed to analyze lease.',
      details: error.message
    });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Lease Lens API listening on http://localhost:${port}`);
});
