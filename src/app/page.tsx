import { prisma } from "@/lib/prisma";
import Link from "next/link";

const ORDER = ["INTERVIEW", "OFFER", "APPLIED", "TAILORED", "SAVED", "REJECTED", "ARCHIVED"];

export const dynamic = "force-dynamic"; // always read fresh data

export default async function Dashboard() {
  let jobs: any[] = [];
  let dbError = false;
  try {
    jobs = await prisma.job.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="card">
        <h1>Welcome to Job Copilot</h1>
        <p className="muted">
          Couldn&rsquo;t reach the database. Make sure Postgres is running and
          you&rsquo;ve run <code>npm run db:push</code> and <code>npm run db:seed</code>.
          See the README for setup.
        </p>
      </div>
    );
  }

  const counts: Record<string, number> = {};
  jobs.forEach((j) => (counts[j.status] = (counts[j.status] || 0) + 1));

  return (
    <div>
      <div className="row">
        <h1>Your applications</h1>
        <div className="spacer" />
        <Link className="btn" href="/jobs/new">+ Add job</Link>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        {ORDER.filter((s) => counts[s]).map((s) => (
          <span key={s} className="tag">{s} · {counts[s]}</span>
        ))}
        {jobs.length === 0 && (
          <p className="muted">No jobs yet. Add your first one to get started.</p>
        )}
      </div>

      {jobs.map((j) => (
        <Link key={j.id} href={`/jobs/${j.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card jobcard">
            <div>
              <h3>{j.title}</h3>
              <div className="muted">{j.company}{j.location ? ` · ${j.location}` : ""}</div>
            </div>
            <div className="spacer" />
            <span className="tag">{j.status}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
