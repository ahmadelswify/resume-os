# resume-os

Drop a job description into [Claude Code](https://docs.anthropic.com/en/docs/claude-code) → get a fully tailored, single-page resume PDF.

Build your knowledge base once. Apply to as many jobs as you want — each one gets a custom-tailored resume in minutes, not hours.

## How It Works

### First time: share your background

Open the project in Claude Code and share whatever you have — a current resume, a LinkedIn profile, a GitHub repo, or just a plain-text description of your experience. The agent builds your entire knowledge base from it.

```
You:   Here's my current resume [paste/upload]
Agent: I've built your knowledge base and base resume.
       Check resumes/pdf/Your-Name-Resume.pdf — does everything look right?
```

### Every time after: drop a JD

Paste a job description. The agent does the rest.

```
You:   [pastes job description for Senior PM at Stripe]
Agent: Here's your tailored resume:

       Mapping table:
       | JD Requirement              | Your Bullet                        | Strength |
       | Cross-functional leadership  | Led 3 teams across eng + design... | Strong   |
       | Data-driven decisions        | Built analytics pipeline that...   | Strong   |
       | Payments experience          | (gap — framed via fintech work)    | Stretch  |

       Full draft: [all sections — summary, skills, experience, projects, education]

       Ready to generate the PDF?
```

You review, tweak if needed, and the agent saves the JSON and generates a single-page PDF.

**That's the whole workflow.** One knowledge base, unlimited tailored resumes.

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+
- Internet connection (for font download and company research)

## Quick Start

**1. Clone and install**

```bash
git clone https://github.com/ahmadelswify/resume-os.git
cd resume-os/generator && npm install
```

**2. Start**

```bash
cd resume-os
claude
```

The agent will download the required fonts, ask about your background, and take it from there.

---

## Reference

<details>
<summary>Project structure</summary>

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
    └── workflow.md           # Detailed process docs
```

The agent creates and manages the knowledge files and resume JSONs for you. You never need to edit them manually.

</details>

<details>
<summary>PDF generator CLI</summary>

The agent runs this automatically, but you can use it directly:

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

</details>

<details>
<summary>Resume JSON schema</summary>

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

</details>

## License

MIT
