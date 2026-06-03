import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.profile.findFirst();
  if (existing) { console.log("Profile already exists — skipping seed."); return; }

  const profile = await prisma.profile.create({
    data: {
      fullName: "Brian Mugisha",
      email: "bryanzmugisha@gmail.com",
      phone: "+256 706 379 914",
      location: "Kampala, Uganda",
      github: "https://github.com/bryanzmugisha",
      linkedin: "https://www.linkedin.com/in/brian-mugisha-0487778a",
      baseSummary:
        "Aspiring software developer who builds and deploys full-stack web apps with React, Next.js and TypeScript, currently pursuing a BSc in Software Engineering, and bringing 4+ years of professional finance and operations experience with strong analytical and accuracy habits.",
      cvFacts: [
        "PROJECTS:",
        "- Sentinel Guardian: real-time endpoint monitoring dashboard (TanStack Start, React 19, TypeScript, server functions, HTTP ingest API, telemetry agent, Radix UI, Tailwind, Recharts). Deployed on Vercel.",
        "- RestoPOS: full-stack restaurant POS (Next.js 14, Prisma, PostgreSQL, NextAuth, bcrypt, Socket.IO real-time, Zustand, Zod, Recharts). Deployed on Vercel.",
        "- Java suite: Vehicle Auction System, Student Registration, Grading System, plus algorithm exercises.",
        "- Cuvette Engineering website: responsive multi-page site (HTML/CSS/JS).",
        "SKILLS: TypeScript, JavaScript, Java, HTML, CSS, SQL, React, Next.js, Prisma, PostgreSQL, Node.js, Git, Vercel. Also: advanced Excel, ERP systems (SAP Business One, SUN System, QuickBooks, Tally), data analysis.",
        "EXPERIENCE:",
        "- Accountant (part-time), Cuvette Engineering (U) Ltd, Jul 2025–present. Also built their website.",
        "- Accounts Assistant, PSFU, Feb 2023–Jun 2025. Managed 6 donor-funded projects (>UGX 5bn), 100% reporting compliance, zero audit findings, ~10% cost savings, cut month-end closing 20%, resolved UGX 50m discrepancies.",
        "- Finance Trainee, PSFU, Apr 2022–Jan 2023.",
        "- Sales & Marketing Executive, Glen Credit Ltd, 2019–2020.",
        "EDUCATION: BSc Software Engineering (in progress), Victoria University, 2025–present. BSc Accounting & Finance, Kyambogo University, 2018–2022. CPA Level 2 in progress (ICPAU).",
        "LANGUAGES: English (fluent), Rufumbira (native), Luganda & Runyankole (conversational).",
      ].join("\n"),
      answers: {
        create: [
          {
            label: "Careful data entry",
            question: "Tell us about a time you had to enter data very carefully.",
            content:
              "In my accounting role I entered financial figures where one wrong digit could break a reconciliation. I worked from the source document, entered the data, then checked it back against the source before saving, verifying totals matched. I paced myself on long sessions because accuracy drops when you rush — the result was zero audit findings across multiple cycles.",
          },
          {
            label: "File organization",
            question: "How do you keep digital files organized?",
            content:
              "Clear folder structures by project, then category and date, with predictable file names (date, type, reference) so anything is findable without opening it. I save files to the right place immediately, keep backups, and never leave files untracked — the goal is that anyone could find any file, anytime.",
          },
        ],
      },
    },
  });
  console.log("Seeded profile:", profile.fullName);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
