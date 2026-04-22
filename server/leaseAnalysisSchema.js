const leaseAnalysisSchema = {
  name: 'lease_analysis_dashboard',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: [
      'overview',
      'clause_summaries',
      'key_terms',
      'top_10_things',
      'risk_flags'
    ],
    properties: {
      overview: {
        type: 'object',
        additionalProperties: false,
        required: ['tldr', 'lease_type', 'parties', 'term_summary', 'financial_summary'],
        properties: {
          tldr: { type: 'string' },
          lease_type: { type: 'string' },
          parties: {
            type: 'array',
            items: { type: 'string' }
          },
          term_summary: { type: 'string' },
          financial_summary: { type: 'string' }
        }
      },
      clause_summaries: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['title', 'summary', 'why_it_matters', 'risk_level'],
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            why_it_matters: { type: 'string' },
            risk_level: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            }
          }
        }
      },
      key_terms: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['term', 'value', 'plain_english'],
          properties: {
            term: { type: 'string' },
            value: { type: 'string' },
            plain_english: { type: 'string' }
          }
        }
      },
      top_10_things: {
        type: 'array',
        items: { type: 'string' }
      },
      risk_flags: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['flag', 'severity'],
          properties: {
            flag: { type: 'string' },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high']
            }
          }
        }
      }
    }
  }
};

module.exports = { leaseAnalysisSchema };

