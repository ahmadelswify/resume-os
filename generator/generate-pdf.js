const React = require("react");
const {
  Document,
  Page,
  View,
  Text,
  Link,
  Font,
  StyleSheet,
  renderToFile,
} = require("@react-pdf/renderer");
const fs = require("fs");
const path = require("path");

// --- CLI args ---
// Usage: node generate-pdf.js [--input <json-path-or-filename>] [--output <suffix>] [--padding <pt>] [--top <pt>] [--contact-gap <pt>]
// Defaults: --input ../resumes/base/resume.json --output "" --padding 20 --top 18 --contact-gap 5
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf("--" + name);
  return idx > -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const RESUMES_DIR = path.resolve(__dirname, "..", "resumes");
const TAILORED_DIR = path.join(RESUMES_DIR, "tailored");
const BASE_DIR = path.join(RESUMES_DIR, "base");
const PDF_DIR = path.join(RESUMES_DIR, "pdf");

// Resolve input JSON: accept absolute path, relative path, or bare filename
// For bare filenames, check tailored/ first, then base/
function resolveInput(input) {
  // Absolute path
  if (path.isAbsolute(input)) {
    if (fs.existsSync(input)) return input;
    console.error(`File not found: ${input}`);
    process.exit(1);
  }

  // Relative path with directory separators
  if (input.includes(path.sep) || input.includes("/")) {
    const resolved = path.resolve(input);
    if (fs.existsSync(resolved)) return resolved;
    console.error(`File not found: ${resolved}`);
    process.exit(1);
  }

  // Bare filename — check tailored/ then base/
  const tailored = path.join(TAILORED_DIR, input);
  if (fs.existsSync(tailored)) return tailored;

  const base = path.join(BASE_DIR, input);
  if (fs.existsSync(base)) return base;

  console.error(
    `File not found. Checked:\n  ${tailored}\n  ${base}`
  );
  process.exit(1);
}

const inputArg = getArg("input", "resume.json");
const inputPath = resolveInput(inputArg);
const outputSuffix = getArg("output", "");
const paddingH = Number(getArg("padding", "20"));
const paddingTop = Number(getArg("top", "18"));
const contactGap = Number(getArg("contact-gap", "5"));

// --- Load resume data ---
const resume = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

// --- Ensure PDF output directory exists ---
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

// --- Output path ---
const nameSlug = resume.profile.name.replace(/\s+/g, "-");
const pdfName = outputSuffix
  ? `${nameSlug}-Resume-${outputSuffix}.pdf`
  : `${nameSlug}-Resume.pdf`;
const outputPath = path.resolve(PDF_DIR, pdfName);

// --- Register font ---
const fontsDir = path.resolve(__dirname, "public/fonts");
Font.register({
  family: "Roboto",
  fonts: [
    { src: path.join(fontsDir, "Roboto-Regular.ttf") },
    { src: path.join(fontsDir, "Roboto-Bold.ttf"), fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

// --- Design tokens ---
const COLORS = {
  text: "#1a1a1a",
  accent: "#1a1a1a",
  muted: "#4b5563",
  divider: "#d1d5db",
  bg: "#ffffff",
};

const e = React.createElement;

// --- Spacing helper (pt) ---
const sp = (n) => n + "pt";

// --- Styles ---
const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: sp(9.5),
    color: COLORS.text,
    paddingTop: sp(paddingTop),
    paddingBottom: sp(18),
    paddingHorizontal: sp(paddingH),
    lineHeight: 1.3,
  },
  row: { flexDirection: "row" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  col: { flexDirection: "column" },
  // Header
  name: {
    fontSize: sp(22),
    fontWeight: "bold",
    color: COLORS.accent,
    letterSpacing: sp(0.5),
  },
  summary: {
    fontSize: sp(9),
    color: COLORS.muted,
    marginTop: sp(4),
    lineHeight: 1.4,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: sp(6),
    marginTop: sp(contactGap),
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: sp(9),
    color: COLORS.text,
  },
  contactSep: {
    fontSize: sp(9),
    color: COLORS.divider,
  },
  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: sp(7),
    marginBottom: sp(3),
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.divider,
    paddingBottom: sp(2),
  },
  sectionTitle: {
    fontSize: sp(10),
    fontWeight: "bold",
    color: COLORS.accent,
    letterSpacing: sp(1.5),
    textTransform: "uppercase",
  },
  // Work
  companyName: {
    fontWeight: "bold",
    fontSize: sp(10),
  },
  jobTitle: {
    fontSize: sp(9.5),
  },
  jobTitleItalic: {
    fontSize: sp(8.5),
    color: COLORS.muted,
  },
  dateText: {
    fontSize: sp(9),
    color: COLORS.muted,
  },
  bullet: {
    fontSize: sp(9.5),
    lineHeight: 1.35,
    flexGrow: 1,
    flexBasis: 0,
  },
  bulletDot: {
    width: sp(12),
    fontSize: sp(9.5),
    lineHeight: 1.35,
  },
  // Education
  schoolName: {
    fontWeight: "bold",
    fontSize: sp(9.5),
  },
  degree: {
    fontSize: sp(9.5),
  },
  // Skills
  skillLine: {
    fontSize: sp(9.5),
    lineHeight: 1.35,
    flexGrow: 1,
    flexBasis: 0,
  },
  skillLabel: {
    fontWeight: "bold",
    fontSize: sp(9.5),
  },
});

// --- Components ---
function SectionHeading({ title }) {
  return e(
    View,
    { style: s.sectionHeader },
    e(Text, { style: s.sectionTitle }, title)
  );
}

function BulletItem({ text }) {
  return e(
    View,
    { style: { ...s.row, marginTop: sp(1) } },
    e(Text, { style: s.bulletDot }, "\u2022"),
    e(Text, { style: s.bullet }, text)
  );
}

function SkillLine({ label, text }) {
  return e(
    View,
    { style: { ...s.row, marginTop: sp(1.5) } },
    e(Text, { style: s.bulletDot }, "\u2022"),
    e(
      Text,
      { style: s.skillLine },
      e(Text, { style: s.skillLabel }, label + ": "),
      text
    )
  );
}

// --- Profile ---
function ProfileSection({ profile }) {
  const { name, email, location, url, summary } = profile;
  const contacts = [email, location, url].filter(Boolean);

  return e(
    View,
    { style: { alignItems: "center" } },
    e(Text, { style: s.name }, name),
    e(
      View,
      { style: s.contactRow },
      ...contacts.flatMap((item, idx) => {
        const els = [e(Text, { key: "c" + idx, style: s.contactItem }, item)];
        if (idx < contacts.length - 1) {
          els.push(e(Text, { key: "s" + idx, style: s.contactSep }, "  |  "));
        }
        return els;
      })
    ),
    summary && e(Text, { style: s.summary }, summary)
  );
}

// --- Skills ---
function SkillsSection({ skills }) {
  const { descriptions } = skills;
  return e(
    View,
    {},
    e(SectionHeading, { title: "Skills" }),
    ...descriptions.map((desc, idx) => {
      const colonIdx = desc.indexOf(":");
      if (colonIdx > -1) {
        const label = desc.substring(0, colonIdx);
        const rest = desc.substring(colonIdx + 1).trim();
        return e(SkillLine, { key: idx, label, text: rest });
      }
      return e(BulletItem, { key: idx, text: desc });
    })
  );
}

// --- Work Experience ---
function WorkSection({ workExperiences }) {
  return e(
    View,
    {},
    e(SectionHeading, { title: "Experience" }),
    ...workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
      // Check if first description is actually sub-titles (contains "|")
      let subTitles = null;
      let bulletDescs = descriptions;
      if (
        descriptions.length > 0 &&
        descriptions[0].includes("|") &&
        !descriptions[0].match(/^\d/) // not a metric
      ) {
        subTitles = descriptions[0];
        bulletDescs = descriptions.slice(1);
      }

      return e(
        View,
        { key: idx, style: idx !== 0 ? { marginTop: sp(6) } : {} },
        // Company + date row
        e(
          View,
          { style: s.rowBetween },
          e(Text, { style: s.companyName }, company),
          e(Text, { style: s.dateText }, date)
        ),
        // Current title
        e(
          View,
          { style: { marginTop: sp(1) } },
          e(Text, { style: s.jobTitle }, jobTitle)
        ),
        // Previous titles (stacked)
        subTitles &&
          e(
            View,
            { style: { marginTop: sp(1) } },
            e(Text, { style: s.jobTitleItalic }, subTitles)
          ),
        // Bullets
        e(
          View,
          { style: { marginTop: sp(2) } },
          ...bulletDescs.map((desc, i) =>
            e(BulletItem, { key: i, text: desc })
          )
        )
      );
    })
  );
}

// --- Education ---
function EducationSection({ educations }) {
  return e(
    View,
    {},
    e(SectionHeading, { title: "Education" }),
    ...educations.map(({ school, degree, date, gpa, descriptions }, idx) => {
      const degreeText = gpa
        ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
        : degree;
      return e(
        View,
        { key: idx, style: idx !== 0 ? { marginTop: sp(4) } : {} },
        e(
          View,
          { style: s.rowBetween },
          e(Text, { style: s.schoolName }, school),
          e(Text, { style: s.dateText }, date)
        ),
        e(
          View,
          { style: { marginTop: sp(1) } },
          e(Text, { style: s.degree }, degreeText)
        ),
        descriptions &&
          descriptions.length > 0 &&
          descriptions.join("") !== "" &&
          e(
            View,
            { style: { marginTop: sp(1) } },
            ...descriptions.map((d, i) =>
              e(BulletItem, { key: i, text: d })
            )
          )
      );
    })
  );
}

// --- Projects ---
function ProjectSection({ projects }) {
  return e(
    View,
    {},
    e(SectionHeading, { title: "Projects" }),
    ...projects.map(({ project, date, descriptions }, idx) =>
      e(
        View,
        { key: idx, style: idx !== 0 ? { marginTop: sp(4) } : {} },
        e(
          View,
          { style: s.rowBetween },
          e(Text, { style: { ...s.schoolName } }, project),
          e(Text, { style: s.dateText }, date)
        ),
        e(
          View,
          { style: { marginTop: sp(1) } },
          ...descriptions.map((d, i) => e(BulletItem, { key: i, text: d }))
        )
      )
    )
  );
}

// --- Main Document ---
// Section order: Skills -> Experience -> Projects -> Education
const ResumePDF = e(
  Document,
  { title: `${resume.profile.name} Resume`, author: resume.profile.name },
  e(
    Page,
    { size: "LETTER", style: s.page },
    e(ProfileSection, { profile: resume.profile }),
    e(SkillsSection, { skills: resume.skills }),
    e(WorkSection, { workExperiences: resume.workExperiences }),
    e(ProjectSection, { projects: resume.projects }),
    e(EducationSection, { educations: resume.educations })
  )
);

// --- Render ---
renderToFile(ResumePDF, outputPath).then(() => {
  console.log(`PDF generated: ${outputPath}`);
});
