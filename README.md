# resume-os

Drop a job description into Claude Code → get a fully tailored, single-page resume PDF.

**resume-os** is a Claude Code-powered resume tailoring system. It parses job descriptions, maps your experience to requirements, and generates print-ready PDFs — all in one shot.

## Quick Start

```bash
git clone https://github.com/ahmadelswify/resume-os.git
cd resume-os/generator
npm install
```

Add [Roboto](https://fonts.google.com/specimen/Roboto) font files to `generator/public/fonts/`:
- `Roboto-Regular.ttf`
- `Roboto-Bold.ttf`

Then open the project in Claude Code:

```bash
cd resume-os
claude
```

That's it. The agent will onboard you from there.

## How It Works

### First time: The agent builds your knowledge base

You don't need to fill in any files manually. When you first open the project, the agent asks what you have available:

- **Paste your current resume** (text, PDF, or screenshot)
- **Link a repo or portfolio** the agent can read
- **Share your LinkedIn** or any professional context
- **Just describe your experience** in plain text

From whatever you provide, the agent builds your knowledge base — a detailed profile, a library of quantified achievements, and positioning strategies by role type. It also creates your base resume JSON and generates a PDF to confirm everything looks right.

### Every time after: Drop a JD

Once your knowledge base exists, just paste a job description. The agent automatically:

1. **Parses the JD** — role, requirements, keywords, themes
2. **Researches the company** — culture, values, recent news
3. **Maps your experience** — finds the best achievement for each requirement
4. **Drafts a full resume** — rewrites every section, tailored to the role
5. **Presents it for review** — with a mapping table and gap analysis

You approve (or tweak), and the agent saves the JSON and generates the PDF.

## Project Structure

```
resume-os/
├── CLAUDE.md                 # Agent instructions (the brain)
├── knowledge/
│   ├── profile.md            # Your professional background
│   ├── impact-brief.md       # Quantified achievements library
│   └── role-positioning.md   # Positioning strategy by role type
├── resumes/
│   ├── base/
│   │   └── resume.json       # General-purpose base resume
│   ├── tailored/             # One JSON per application
│   └── pdf/                  # Generated PDFs
├── generator/
│   ├── generate-pdf.js       # PDF renderer
│   ├── package.json
│   └── public/fonts/         # Roboto TTF files
└── examples/
    └── workflow.md           # Detailed process documentation
```

### What the agent builds for you

| File | Purpose |
|------|---------|
| `knowledge/profile.md` | Comprehensive professional background — more detailed than a resume |
| `knowledge/impact-brief.md` | Every quantifiable achievement, organized by role with tags for matching |
| `knowledge/role-positioning.md` | How to frame your experience for different role types |
| `resumes/base/resume.json` | Your general-purpose resume (starting template for all tailored versions) |

## PDF Generator CLI

The agent runs this automatically, but you can also use it directly:

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
      "descriptions": ["Achievement bullet with metrics..."]
    }
  ],
  "projects": [
    {
      "project": "Name",
      "date": "2023",
      "descriptions": ["What you built and the impact..."]
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
