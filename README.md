# Sentra

Sentra is a lightweight PSIRF-aligned incident analysis tool for NHS and private mental health providers. Staff can submit anonymised incident reports for automated triage, pattern recognition and learning response recommendations.

## Features
- Single page incident submission with file upload or free text
- GPT-4 analysis using configurable prompt templates
- Theme tagging and anonymisation confirmation
- Result report card with export to PDF, Word or clipboard
- Supabase storage of analysed incidents
- Analytics dashboard for categories, learning responses and SEIPS domains
- Editable prompt library stored in Supabase

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- OpenAI API key (GPT-4)

### Environment variables
Copy `.env.example` to `.env` and populate:

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

### Install & run
```
npm install
npm run dev
```

### Supabase setup
Create two tables:

**incidents**
| column | type |
| --- | --- |
| id | uuid | primary key |
| theme | text |
| psirf_category | text |
| system_issues | text |
| seips_domains | text |
| learning_response | text |
| risk_rating | text |
| governance_actions | text |
| summary | text |
| raw_text | text |
| created_at | timestamp | default now() |

**prompts**
| column | type |
| --- | --- |
| id | uuid | primary key |
| theme | text |
| template | text |

### Deployment
Deploy easily on Vercel:
1. Push this repository to GitHub
2. Create a new Vercel project and import the repo
3. Add environment variables in Vercel dashboard
4. Deploy

## Usage
1. Paste or upload an incident report
2. Choose a theme
3. Confirm anonymisation
4. Submit to receive analysis
5. Export report or view aggregated analytics on `/dashboard`

### Editing prompts
Visit `/config` to add or modify prompt templates stored in the Supabase `prompts` table.

## License
MIT
