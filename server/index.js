const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const zlib = require('zlib');
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
const GEMINI_USAGE_LOG_PATH = path.join(__dirname, 'logs', 'gemini-usage.jsonl');
const ANALYSIS_CACHE_DIR = path.join(__dirname, 'cache', 'lease-analysis');
const ANALYSIS_CACHE_VERSION = 'v1';
const MAX_EXTRACTED_TEXT_CHARS = 45000;

app.use(cors());
app.use(express.json());

const formatUploadDebug = (file) => {
  if (!file) {
    return {
      fileName: null,
      mimeType: null,
      fileSizeBytes: null,
      fileHashPrefix: null,
    };
  }

  return {
    fileName: file.originalname,
    mimeType: file.mimetype,
    fileSizeBytes: file.size,
    fileHashPrefix: getFileHash(file.buffer).slice(0, 12),
  };
};

const logUploadDebug = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[upload-debug] ${timestamp} ${event} ${JSON.stringify(details)}`);
};

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

const createLeaseAnalysisPrompt = () => `
You are analyzing a residential lease PDF for a student-facing lease review dashboard.

Read the uploaded PDF carefully and extract the lease terms into the exact structured format requested by the schema.

Requirements:
- Determine what the document is from its contents only.
- Ignore the uploaded filename completely. Do not use the filename as evidence for whether this is or is not a lease.
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
- If the document appears to be a lease, analyze it even if the filename is generic, abbreviated, or unrelated.
`;

const createLeaseTextAnalysisPrompt = (extractedText) => `
${createLeaseAnalysisPrompt()}

The PDF text below was extracted before analysis to reduce API payload size.

Instructions for extracted-text analysis:
- Treat this extracted text as the source of truth for the document contents.
- The extraction may be imperfect, out of order, or incomplete. Use only what is present.
- Do not invent facts that are not supported by the extracted text.
- If a field is missing or unclear, use "Not clearly stated in lease".

EXTRACTED LEASE TEXT:
${extractedText}
`;

const appendGeminiUsageLog = async (entry) => {
  try {
    await fs.mkdir(path.dirname(GEMINI_USAGE_LOG_PATH), { recursive: true });
    await fs.appendFile(GEMINI_USAGE_LOG_PATH, `${JSON.stringify(entry)}\n`, 'utf8');
  } catch (error) {
    console.error('Failed to write Gemini usage log:', error);
  }
};

const getFileHash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

const getAnalysisCachePath = (fileHash) => path.join(ANALYSIS_CACHE_DIR, `${fileHash}.json`);

const readAnalysisCache = async (fileHash) => {
  try {
    const raw = await fs.readFile(getAnalysisCachePath(fileHash), 'utf8');
    const cached = JSON.parse(raw);

    if (
      cached?.cacheVersion !== ANALYSIS_CACHE_VERSION ||
      cached?.model !== GEMINI_MODEL
    ) {
      return null;
    }

    return cached;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    console.error('Failed to read analysis cache:', error);
    return null;
  }
};

const writeAnalysisCache = async (fileHash, entry) => {
  try {
    await fs.mkdir(ANALYSIS_CACHE_DIR, { recursive: true });
    await fs.writeFile(
      getAnalysisCachePath(fileHash),
      JSON.stringify(entry, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Failed to write analysis cache:', error);
  }
};

const extractInflatedPdfText = (buffer) => {
  const extractedChunks = [];
  const streamToken = Buffer.from('stream');
  const endStreamToken = Buffer.from('endstream');
  let cursor = 0;

  while (cursor < buffer.length) {
    const streamIndex = buffer.indexOf(streamToken, cursor);

    if (streamIndex === -1) {
      break;
    }

    let dataStart = streamIndex + streamToken.length;

    if (buffer[dataStart] === 0x0d && buffer[dataStart + 1] === 0x0a) {
      dataStart += 2;
    } else if (buffer[dataStart] === 0x0a || buffer[dataStart] === 0x0d) {
      dataStart += 1;
    }

    const endStreamIndex = buffer.indexOf(endStreamToken, dataStart);

    if (endStreamIndex === -1) {
      break;
    }

    const streamChunk = buffer.slice(dataStart, endStreamIndex);

    try {
      const inflated = zlib.inflateSync(streamChunk).toString('latin1');
      const printableChunks = inflated.match(/[A-Za-z][A-Za-z0-9,.:;'"()\-\/\s]{3,}/g) || [];
      extractedChunks.push(...printableChunks);
    } catch (_error) {
      // Not every PDF stream is flate-compressed or text-bearing.
    }

    cursor = endStreamIndex + endStreamToken.length;
  }

  return extractedChunks.join(' ');
};

const cleanExtractedPdfText = (text) => {
  const cleaned = text
    .replace(/%PDF-\d\.\d/gi, ' ')
    .replace(/\b\d+\s+\d+\s+obj\b/gi, ' ')
    .replace(/\b\d+\s+\d+\s+R\b/gi, ' ')
    .replace(/\bendobj\b|\bstream\b|\bendstream\b|\bxref\b|\btrailer\b|\bstartxref\b/gi, ' ')
    .replace(/\bBT\b|\bET\b|\bTf\b|\bTj\b|\bTJ\b|\bTd\b|\bTm\b|\bcm\b|\bq\b|\bQ\b|\bre\b|\bn\b|\brg\b/gi, ' ')
    .replace(/\/[A-Za-z0-9#._-]+/g, ' ')
    .replace(/<[^>]{1,120}>/g, ' ')
    .replace(/\b(?:MediaBox|Contents|Resources|Parent|Type|Page|Length|Filter|FlateDecode|FontDescriptor|ProcSet|Subtype|Font|CIDToGIDMap|Artifact|MCID|BDC|EMC|BBox)\b/gi, ' ')
    .replace(/[^\x20-\x7E\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
};

const extractPdfTextForAnalysis = (buffer) => {
  const inflatedText = extractInflatedPdfText(buffer);
  return cleanExtractedPdfText(inflatedText);
};

const summarizeExtractedTextQuality = (extractedText) => {
  const lowerText = extractedText.toLowerCase();
  const longWords = extractedText.match(/\b[a-zA-Z]{3,}\b/g) || [];
  const singleLetterWords = extractedText.match(/\b[a-zA-Z]\b/g) || [];
  const leaseSignals = [
    /\blease agreement\b/,
    /\brental agreement\b/,
    /\bresidential lease\b/,
    /\btenant\b/,
    /\blandlord\b/,
    /\bmonthly rent\b/,
    /\bsecurity deposit\b/,
    /\bpremises\b/,
    /\bnotice to vacate\b/,
  ].filter((pattern) => pattern.test(lowerText)).length;
  const pdfNoiseSignals = [
    /\bendobj\b/,
    /\bflatedecode\b/,
    /\bmediabox\b/,
    /\bfontdescriptor\b/,
    /\bcidtogidmap\b/,
    /\bstartxref\b/,
    /\br0t\(/,
    /\bx\s+r0t\(/,
  ].filter((pattern) => pattern.test(lowerText)).length;
  const singleLetterWordRate = singleLetterWords.length / Math.max(longWords.length, 1);
  const extractedTextUsable =
    extractedText.length >= 1000 &&
    extractedText.length <= 250000 &&
    longWords.length >= 250 &&
    leaseSignals >= 3 &&
    pdfNoiseSignals === 0 &&
    singleLetterWordRate <= 0.08;

  return {
    lowerText,
    wordCount: longWords.length,
    leaseSignals,
    pdfNoiseSignals,
    singleLetterWordRate,
    extractedTextUsable,
  };
};

const chooseAnalysisInput = (file) => {
  const extractedText = extractPdfTextForAnalysis(file.buffer);
  const quality = summarizeExtractedTextQuality(extractedText);

  if (quality.extractedTextUsable) {
    return {
      mode: 'extracted-text',
      parts: [{ text: createLeaseTextAnalysisPrompt(extractedText.slice(0, MAX_EXTRACTED_TEXT_CHARS)) }],
      extractedTextChars: extractedText.length,
      extractedTextWordCount: quality.wordCount,
      extractedTextLeaseSignals: quality.leaseSignals,
      extractedTextNoiseSignals: quality.pdfNoiseSignals,
      extractedTextSingleLetterRate: quality.singleLetterWordRate,
    };
  }

  return {
    mode: 'pdf-inline',
    parts: [
      {
        inline_data: {
          mime_type: file.mimetype,
          data: file.buffer.toString('base64'),
        },
      },
      {
        text: createLeaseAnalysisPrompt(),
      },
    ],
    extractedTextChars: extractedText.length,
    extractedTextWordCount: quality.wordCount,
    extractedTextLeaseSignals: quality.leaseSignals,
    extractedTextNoiseSignals: quality.pdfNoiseSignals,
    extractedTextSingleLetterRate: quality.singleLetterWordRate,
  };
};

const analysisLooksGarbled = (analysis) => {
  const overviewText = [
    analysis?.overview?.tldr,
    analysis?.overview?.term_summary,
    analysis?.overview?.financial_summary,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const topThingsText = (analysis?.top_10_things || []).join(' ').toLowerCase();
  const combinedText = `${overviewText} ${topThingsText}`;

  const garbledSignals = [
    'garbled',
    'no discernible lease information',
    'no lease information could be extracted',
    'impossible to determine',
    'please provide a readable lease document',
    'without clear text',
    'not clearly stated in lease',
  ].filter((phrase) => combinedText.includes(phrase)).length;

  const meaningfulClauseCount = (analysis?.clause_summaries || []).filter(
    (clause) =>
      clause?.summary &&
      !String(clause.summary).toLowerCase().includes('not clearly stated') &&
      !String(clause.summary).toLowerCase().includes('garbled')
  ).length;

  const meaningfulTermCount = (analysis?.key_terms || []).filter(
    (term) =>
      term?.value &&
      !String(term.value).toLowerCase().includes('not clearly stated')
  ).length;

  return garbledSignals >= 2 || (meaningfulClauseCount === 0 && meaningfulTermCount <= 1);
};

const callGeminiJson = async ({
  parts,
  schema,
  temperature = 0.1,
  purpose = 'analyze-lease',
  metadata = {},
}) => {
  const startedAt = Date.now();
  let responseStatus = null;
  let payload = null;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts,
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseJsonSchema: schema,
          temperature,
        },
      }),
    });

    responseStatus = response.status;

    if (!response.ok) {
      const errorBody = await response.text();

      await appendGeminiUsageLog({
        timestamp: new Date().toISOString(),
        purpose,
        model: GEMINI_MODEL,
        success: false,
        durationMs: Date.now() - startedAt,
        responseStatus,
        ...metadata,
        error: `Gemini API returned ${response.status}: ${errorBody}`,
      });

      throw new Error(`Gemini API returned ${response.status}: ${errorBody}`);
    }

    payload = await response.json();
    const responseText = payload?.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text;

    if (!responseText) {
      await appendGeminiUsageLog({
        timestamp: new Date().toISOString(),
        purpose,
        model: GEMINI_MODEL,
        success: false,
        durationMs: Date.now() - startedAt,
        responseStatus,
        ...metadata,
        usageMetadata: payload?.usageMetadata || null,
        error: 'Gemini API did not return structured text.',
      });

      throw new Error('Gemini API did not return structured text.');
    }

    const parsed = JSON.parse(responseText);

    await appendGeminiUsageLog({
      timestamp: new Date().toISOString(),
      purpose,
      model: GEMINI_MODEL,
      success: true,
      durationMs: Date.now() - startedAt,
      responseStatus,
      ...metadata,
      usageMetadata: payload?.usageMetadata || null,
    });

    return parsed;
  } catch (error) {
    if (responseStatus === null) {
      await appendGeminiUsageLog({
        timestamp: new Date().toISOString(),
        purpose,
        model: GEMINI_MODEL,
        success: false,
        durationMs: Date.now() - startedAt,
        responseStatus: null,
        ...metadata,
        usageMetadata: payload?.usageMetadata || null,
        error: error.message,
      });
    }

    throw error;
  }
};

const extractSearchablePdfText = (buffer) =>
  extractPdfTextForAnalysis(buffer).toLowerCase();

const validateLeaseLocally = async (file) => {
  const text = extractSearchablePdfText(file.buffer);

  const strongLeasePatterns = [
    /\blease agreement\b/,
    /\brental agreement\b/,
    /\btenancy agreement\b/,
    /\bresidential lease\b/,
    /\bstudent housing contract\b/,
    /\bsublease agreement\b/,
    /\blandlord\b.*\btenant\b/,
    /\blessor\b.*\blessee\b/,
  ];

  const housingPatterns = [
    /\bmonthly rent\b/,
    /\bsecurity deposit\b/,
    /\bpremises\b/,
    /\boccupancy\b/,
    /\bnotice to vacate\b/,
    /\bterm of this lease\b/,
    /\brent due\b/,
    /\butilities\b/,
    /\btenant\b/,
    /\blandlord\b/,
    /\bproperty address\b/,
  ];

  const nonLeasePatterns = [
    /\bhomework\b/,
    /\bmidterm\b/,
    /\bsyllabus\b/,
    /\blecture\b/,
    /\bquiz\b/,
    /\bexam\b/,
    /\bcourse\b/,
    /\bmarketing plan\b/,
    /\bpop-up\b/,
    /\bmktg\b/,
    /\bmarketing\b/,
    /\bbrand\b/,
    /\bcampaign\b/,
    /\bconsumer\b/,
    /\badvertising\b/,
    /\bprofessor\b/,
    /\bstudent\b/,
    /\bclass\b/,
    /\bassignment due\b/,
    /\bdiscussion post\b/,
    /\bcanvas\b/,
    /\bmodule\b/,
    /\bresume\b/,
    /\binvoice\b/,
    /\bbank statement\b/,
  ];

  const strongMatches = strongLeasePatterns.filter((pattern) => pattern.test(text)).length;
  const housingMatches = housingPatterns.filter((pattern) => pattern.test(text)).length;
  const nonLeaseMatches = nonLeasePatterns.filter((pattern) => pattern.test(text)).length;

  if (!text || text.length < 120) {
    return {
      isLease: true,
      reason: 'The PDF has limited readable text, so upload is being allowed to continue to full analysis.',
      documentType: 'Low-text or scanned PDF'
    };
  }

  if (strongMatches >= 1) {
    return {
      isLease: true,
      reason: 'The document contains direct lease markers such as lease agreement, landlord, and tenant language.',
      documentType: 'Lease or rental agreement'
    };
  }

  if (housingMatches >= 4 && nonLeaseMatches === 0) {
    return {
      isLease: true,
      reason: 'The document contains multiple rent, premises, and tenant-related terms consistent with a lease.',
      documentType: 'Lease-like housing document'
    };
  }

  if (nonLeaseMatches >= 1 && strongMatches === 0 && housingMatches === 0) {
    return {
      isLease: false,
      reason: 'The uploaded document does not appear to be a lease or rental agreement.',
      documentType: 'Likely non-lease document'
    };
  }

  if (nonLeaseMatches >= 2 && strongMatches === 0 && housingMatches <= 1) {
    return {
      isLease: false,
      reason: 'The uploaded document does not appear to be a lease or rental agreement.',
      documentType: 'Likely non-lease document'
    };
  }

  if (housingMatches >= 2 && nonLeaseMatches === 0) {
    return {
      isLease: true,
      reason: 'The document contains some housing-related language and is being allowed to continue to full analysis.',
      documentType: 'Possible housing document'
    };
  }

  return {
    isLease: false,
    reason: 'The uploaded document does not appear to be a lease or rental agreement.',
    documentType: nonLeaseMatches > 0 ? 'Ambiguous non-lease document' : 'Unclassified document'
  };
};

const analyzeLeaseWithGemini = async (file) => {
  const fileHash = getFileHash(file.buffer);
  const cached = await readAnalysisCache(fileHash);

  if (cached?.analysis) {
    if (cached.analysisMode === 'extracted-text' && analysisLooksGarbled(cached.analysis)) {
      console.warn(`Ignoring garbled extracted-text cache for ${file.originalname}; retrying with PDF.`);
    } else {
      return {
        analysis: cached.analysis,
        cached: true,
        fileHash,
        analysisMode: cached.analysisMode,
      };
    }
  }

  const firstAttemptInput = chooseAnalysisInput(file);
  let analysis = await callGeminiJson({
    parts: firstAttemptInput.parts,
    schema: leaseAnalysisSchema.schema,
    temperature: 0.2,
    purpose: 'analyze-lease',
    metadata: {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
      fileHash,
      analysisMode: firstAttemptInput.mode,
      extractedTextChars: firstAttemptInput.extractedTextChars,
      extractedTextWordCount: firstAttemptInput.extractedTextWordCount,
      extractedTextLeaseSignals: firstAttemptInput.extractedTextLeaseSignals,
      extractedTextNoiseSignals: firstAttemptInput.extractedTextNoiseSignals,
      extractedTextSingleLetterRate: firstAttemptInput.extractedTextSingleLetterRate,
    },
  });

  let finalAnalysisMode = firstAttemptInput.mode;

  if (firstAttemptInput.mode === 'extracted-text' && analysisLooksGarbled(analysis)) {
    const pdfFallbackInput = {
      mode: 'pdf-inline',
      parts: [
        {
          inline_data: {
            mime_type: file.mimetype,
            data: file.buffer.toString('base64'),
          },
        },
        {
          text: createLeaseAnalysisPrompt(),
        },
      ],
      extractedTextChars: firstAttemptInput.extractedTextChars,
      extractedTextWordCount: firstAttemptInput.extractedTextWordCount,
      extractedTextLeaseSignals: firstAttemptInput.extractedTextLeaseSignals,
      extractedTextNoiseSignals: firstAttemptInput.extractedTextNoiseSignals,
    };

    console.warn(`Extracted-text analysis looked garbled for ${file.originalname}; retrying with PDF.`);
    analysis = await callGeminiJson({
      parts: pdfFallbackInput.parts,
      schema: leaseAnalysisSchema.schema,
      temperature: 0.2,
      purpose: 'analyze-lease-fallback',
      metadata: {
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        fileHash,
        analysisMode: pdfFallbackInput.mode,
        extractedTextChars: pdfFallbackInput.extractedTextChars,
        extractedTextWordCount: pdfFallbackInput.extractedTextWordCount,
        extractedTextLeaseSignals: pdfFallbackInput.extractedTextLeaseSignals,
        extractedTextNoiseSignals: pdfFallbackInput.extractedTextNoiseSignals,
        extractedTextSingleLetterRate: pdfFallbackInput.extractedTextSingleLetterRate,
        fallbackFrom: firstAttemptInput.mode,
      },
    });
    finalAnalysisMode = 'pdf-inline-fallback';
  }

  await writeAnalysisCache(fileHash, {
    cacheVersion: ANALYSIS_CACHE_VERSION,
    createdAt: new Date().toISOString(),
    model: GEMINI_MODEL,
    fileHash,
    originalFileName: file.originalname,
    fileSizeBytes: file.size,
    analysisMode: finalAnalysisMode,
    analysis,
  });

  return {
    analysis,
    cached: false,
    fileHash,
    analysisMode: finalAnalysisMode,
  };
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: GEMINI_API_KEY ? 'gemini-analysis' : 'mock-analysis'
  });
});

app.post('/api/validate-lease', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'A PDF file is required.' });
  }

  try {
    logUploadDebug('validate-lease:start', formatUploadDebug(req.file));

    if (!GEMINI_API_KEY) {
      logUploadDebug('validate-lease:bypass-no-key', formatUploadDebug(req.file));
      return res.json({
        ok: true,
        isLease: true,
        reason: 'Gemini validation is not configured, so lease validation is bypassed.',
        source: 'mock'
      });
    }

    const validation = await validateLeaseLocally(req.file);
    logUploadDebug('validate-lease:result', {
      ...formatUploadDebug(req.file),
      isLease: validation.isLease,
      documentType: validation.documentType,
      reason: validation.reason,
    });

    if (!validation.isLease) {
      return res.status(400).json({
        error: 'This does not appear to be a lease document. Please upload a residential lease or rental agreement.',
        reason: validation.reason,
        documentType: validation.documentType,
        source: 'local'
      });
    }

    return res.json({
      ok: true,
      isLease: true,
      reason: validation.reason,
      documentType: validation.documentType,
      source: 'local'
    });
  } catch (error) {
    logUploadDebug('validate-lease:error', {
      ...formatUploadDebug(req.file),
      error: error.message,
    });
    console.error('Lease validation failed:', error);
    return res.status(500).json({
      error: 'Failed to validate lease document.',
      details: error.message
    });
  }
});

app.post('/api/analyze-lease', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'A PDF file is required.' });
  }

  try {
    logUploadDebug('analyze-lease:start', formatUploadDebug(req.file));

    if (GEMINI_API_KEY) {
      const validation = await validateLeaseLocally(req.file);
      logUploadDebug('analyze-lease:validation-result', {
        ...formatUploadDebug(req.file),
        isLease: validation.isLease,
        documentType: validation.documentType,
        reason: validation.reason,
      });

      if (!validation.isLease) {
        logUploadDebug('analyze-lease:blocked-non-lease', formatUploadDebug(req.file));
        return res.status(400).json({
          error: 'This document does not appear to be a lease or rental agreement.',
          reason: validation.reason,
          documentType: validation.documentType,
          source: 'local-validation'
        });
      }
    }

    const result = GEMINI_API_KEY
      ? await analyzeLeaseWithGemini(req.file)
      : {
          analysis: sampleLeaseAnalysis,
          cached: false,
          fileHash: getFileHash(req.file.buffer),
          analysisMode: 'mock',
        };

    logUploadDebug('analyze-lease:success', {
      ...formatUploadDebug(req.file),
      source: GEMINI_API_KEY ? 'gemini' : 'mock',
      cached: result.cached,
      analysisMode: result.analysisMode,
    });

    return res.json({
      fileName: req.file.originalname,
      processedAt: new Date().toISOString(),
      analysis: result.analysis,
      source: GEMINI_API_KEY ? 'gemini' : 'mock',
      cached: result.cached,
      fileHash: result.fileHash,
      analysisMode: result.analysisMode,
    });
  } catch (error) {
    logUploadDebug('analyze-lease:error', {
      ...formatUploadDebug(req.file),
      error: error.message,
    });
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
