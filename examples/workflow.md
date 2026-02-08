# Resume Tailoring Workflow

This documents the end-to-end process that the Claude Code agent follows when you drop a job description.

## Quick Start

```bash
# 1. Open the project in Claude Code
cd ~/projects/resume-os && claude

# 2. Paste a job description
# The agent will automatically:
#   - Parse the JD
#   - Research the company
#   - Map your experience to requirements
#   - Draft a full tailored resume
#   - Present it for your review

# 3. Review and approve
# Make any requested changes, then the agent saves JSON and generates PDF
```

## What the Agent Does

### Automatic Phase (no user input)

1. **Parse JD** — Extracts role, company, responsibilities, qualifications, ATS keywords, themes
2. **Research company** — Web searches for values, culture, recent news
3. **Map experience** — Cross-references JD against your `knowledge/impact-brief.md`
4. **Consult positioning** — Reads `knowledge/role-positioning.md` for framing strategy
5. **Draft resume JSON** — Rewrites all sections starting from `resumes/base/resume.json`
6. **Present mapping table** — Shows which JD requirement maps to which bullet
7. **Present full draft** — All sections at once for review

### Interactive Phase (user reviews)

8. User reviews and requests changes (or approves)
9. Agent saves JSON to `resumes/tailored/{company-role}.json`
10. Agent generates PDF via `node generator/generate-pdf.js`
11. Shows PDF path for final approval

## PDF Generator CLI

```bash
cd generator

# Generate from base resume
node generate-pdf.js

# Generate from a tailored resume
node generate-pdf.js --input company-role.json --output Company-Role

# Tight fit (reclaim header space)
node generate-pdf.js --input company-role.json --output Company-Role --top 12 --contact-gap 2
```

### Arguments

| Flag | Default | Description |
|------|---------|-------------|
| `--input` | `resume.json` | JSON filename or path. Bare names check `tailored/` then `base/` |
| `--output` | `""` | PDF suffix. `--output Google-SWE` → `YourName-Resume-Google-SWE.pdf` |
| `--padding` | `20` | Horizontal padding in pt |
| `--top` | `18` | Top padding in pt |
| `--contact-gap` | `5` | Gap between name and contact row in pt |

### Page Fit Strategy

The resume must fit on a single page. If it spills:

1. First try `--top 12 --contact-gap 2` to reclaim header space
2. If still spilling, tighten bullet text (shorter wording)
3. Never go below `--top 10` or `--contact-gap 1`

## Tailored Versions

| Company | JSON | PDF Suffix |
|---------|------|------------|
| _(base)_ | `resumes/base/resume.json` | _(none)_ |

<!-- The agent updates this table after each new tailored version -->

## Formatting Rules

- All black text, no accent colors
- Roboto font, 9.5pt base
- 20pt horizontal margins
- Single page maximum
- Section order: Skills → Experience → Projects → Education
- First-person summary voice
- Education at bottom, no dates
