// Server-only helper that talks to the Anthropic API.
// IMPORTANT: this file must never be imported into client components —
// it reads your secret API key from the server environment.

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.TAILOR_MODEL || "claude-sonnet-4-6";

type Profile = {
  fullName: string;
  cvFacts: string;
  baseSummary: string;
};

type Job = {
  title: string;
  company: string;
  description: string;
};

// Calls Claude once and returns the plain-text response.
async function callClaude(system: string, userPrompt: string, maxTokens = 1024) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set in your environment.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  // Collect all text blocks from the response
  return (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();
}

const HONESTY_RULES =
  "Rules: Use ONLY facts present in the candidate profile. Never invent " +
  "experience, employers, dates, metrics, or skills. If the job wants " +
  "something the candidate lacks, lean on genuine transferable experience " +
  "instead of fabricating. Write in clear, plain English and first person.";

export async function tailorSummary(profile: Profile, job: Job) {
  const system =
    "You write concise, honest professional summaries for a job seeker. " +
    HONESTY_RULES;
  const prompt =
    `CANDIDATE PROFILE\n${profile.cvFacts}\n\n` +
    `BASE SUMMARY\n${profile.baseSummary}\n\n` +
    `TARGET JOB\nTitle: ${job.title}\nCompany: ${job.company}\n` +
    `Description:\n${job.description}\n\n` +
    `TASK: Rewrite the base summary into a 60-90 word summary tailored to ` +
    `this specific role. Emphasise the most relevant real experience. ` +
    `Return only the summary text.`;
  return callClaude(system, prompt, 400);
}

export async function tailorCoverLetter(profile: Profile, job: Job) {
  const system =
    "You write short, sincere cover letters for a job seeker. " + HONESTY_RULES;
  const prompt =
    `CANDIDATE PROFILE\n${profile.cvFacts}\n\n` +
    `TARGET JOB\nTitle: ${job.title}\nCompany: ${job.company}\n` +
    `Description:\n${job.description}\n\n` +
    `TASK: Write a cover letter of about 180-220 words addressed to the ` +
    `hiring team. Open with genuine interest in THIS role, connect the ` +
    `candidate's real experience to what the job needs, and close politely. ` +
    `Use "${profile.fullName}" only in the sign-off. Return only the letter.`;
  return callClaude(system, prompt, 700);
}
