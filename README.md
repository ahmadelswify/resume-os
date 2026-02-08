# resume-os

Drop a job description into Claude Code → get a fully tailored, single-page resume PDF.

**resume-os** is a Claude Code-powered resume tailoring system. It combines your professional knowledge base with an AI agent that automatically drafts tailored resumes from job descriptions — parsing requirements, mapping your experience, and generating a print-ready PDF.

## How It Works

1. You fill in your knowledge base (profile, achievements, positioning strategy)
2. You set up your base resume JSON
3. You open the project in Claude Code and paste a job description
4. The agent automatically:
   - Parses the JD for requirements, keywords, and themes
   - Researches the company
   - Maps your experience to each requirement
   - Drafts a fully tailored resume
   - Presents it for your review
5. You approve (or tweak), and the agent generates a PDF

No back-and-forth. No manual editing. One-shot draft, then iterate.

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourname/resume-os.git
cd resume-os/generator
npm install
```

### 2. Add fonts

Download [Roboto](https://fonts.google.com/specimen/Roboto) and place in `generator/public/fonts/`:
- `Roboto-Regular.ttf`
- `Roboto-Bold.ttf`

### 3. Fill in your knowledge base

Edit these files with your information:

| File | What to include |
|------|----------------|
| `knowledge/profile.md` | Full professional background, skills, experience |
| `knowledge/impact-brief.md` | Quantified achievements with metrics (your "bullet bank") |
| `knowledge/role-positioning.md` | How to frame your experience for different role types |

### 4. Create your base resume

Edit `resumes/base/resume.json` with your general-purpose resume. This is the starting template the agent modifies for each application. See the [JSON schema](#resume-json-schema) below.

### 5. Use it

```bash
cd resume-os
claude
```

Then paste a job description. The agent takes it from there.

## Project Structure

```
resume-os/
├── CLAUDE.md                 # Agent instructions (the brain)
├── knowledge/
│   ├── profile.md            # Your professional background
│   ├── impact-brief.md       # Metrics & achievements library
│   └── role-positioning.md   # Positioning strategy by role type
├── resumes/
│   ├── base/
│   │   └── resume.json       # General-purpose base resume
│   ├── tailored/             # Tailored JSONs (one per application)
│   └── pdf/                  # Generated PDFs
├── generator/
│   ├── generate-pdf.js       # PDF renderer
│   ├── package.json
│   └── public/fonts/         # Roboto TTF files
└── examples/
    └── workflow.md           # Detailed process documentation
```

## PDF Generator CLI

You can also generate PDFs directly:

```bash
cd generator

# From base resume
node generate-pdf.js

# From a tailored resume
node generate-pdf.js --input company-role.json --output Company-Role

# Tight fit (reclaim header space)
node generate-pdf.js --input company-role.json --output Company-Role --top 12 --contact-gap 2
```

| Flag | Default | Description |
|------|---------|-------------|
| `--input` | `resume.json` | JSON filename or path. Bare names resolve `tailored/` → `base/` |
| `--output` | `""` | PDF suffix (e.g., `Google-SWE` → `YourName-Resume-Google-SWE.pdf`) |
| `--padding` | `20` | Horizontal margin in pt |
| `--top` | `18` | Top margin in pt |
| `--contact-gap` | `5` | Gap between name and contact info in pt |

## Resume JSON Schema

```json
{
  "profile": {
    "name": "Full Name",
    "email": "email@example.com",
    "location": "City, State",
    "url": "linkedin.com/in/username",
    "summary": "First-person professional summary..."
  },
  "skills": {
    "descriptions": [
      "Category: skill1, skill2, skill3"
    ]
  },
  "workExperiences": [
    {
      "company": "Company",
      "jobTitle": "Title",
      "date": "Jan 2022 - Present",
      "descriptions": ["Achievement bullets..."]
    }
  ],
  "projects": [
    {
      "project": "Name",
      "date": "2023",
      "descriptions": ["Description..."]
    }
  ],
  "educations": [
    {
      "school": "University",
      "degree": "Degree, Major",
      "date": "",
      "gpa": "",
      "descriptions": []
    }
  ]
}
```

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+
- Roboto font files (Regular + Bold TTF)

## License

MIT
