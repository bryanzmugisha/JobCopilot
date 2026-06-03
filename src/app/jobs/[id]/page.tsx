"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STATUSES = ["SAVED", "TAILORED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED", "ARCHIVED"];

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch(`/api/jobs/${id}`);
    if (res.ok) setJob(await res.json());
  }
  useEffect(() => { load(); }, [id]);

  async function patch(data: any) {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH", headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  }

  async function tailor() {
    setBusy(true); setErr("");
    const res = await fetch("/api/tailor", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });
    if (!res.ok) setErr((await res.json()).error || "Tailoring failed");
    await load(); setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this job?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    router.push("/");
  }

  if (!job) return <p className="muted">Loading…</p>;

  const summary = job.docs?.find((d: any) => d.type === "SUMMARY");
  const cover = job.docs?.find((d: any) => d.type === "COVER_LETTER");

  return (
    <div>
      <div className="row">
        <h1 style={{ margin: 0 }}>{job.title}</h1>
        <div className="spacer" />
        <span className="tag">{job.status}</span>
      </div>
      <p className="muted">
        {job.company}{job.location ? ` · ${job.location}` : ""}
        {job.url ? <> · <a href={job.url} target="_blank" rel="noreferrer">listing ↗</a></> : null}
      </p>

      <div className="card">
        <div className="row">
          <button onClick={tailor} disabled={busy}>
            {busy ? "Tailoring…" : "✨ Tailor CV summary + cover letter"}
          </button>
          <label style={{ margin: 0 }}>Status:</label>
          <select value={job.status} onChange={(e) => patch({ status: e.target.value })} style={{ width: "auto" }}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="spacer" />
          <button className="ghost" onClick={remove}>Delete</button>
        </div>
        {err && <p style={{ color: "#b00" }}>{err}</p>}
      </div>

      {summary && (
        <>
          <h2>Tailored summary <CopyBtn text={summary.content} /></h2>
          <div className="pre">{summary.content}</div>
        </>
      )}
      {cover && (
        <>
          <h2>Cover letter <CopyBtn text={cover.content} /></h2>
          <div className="pre">{cover.content}</div>
        </>
      )}

      <h2>Notes</h2>
      <textarea
        defaultValue={job.notes || ""}
        onBlur={(e) => patch({ notes: e.target.value })}
        placeholder="Recruiter name, salary, follow-up reminders…"
      />

      <h2>Job description</h2>
      <div className="pre">{job.description}</div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button className="ghost" style={{ fontSize: 12, padding: "3px 8px", marginLeft: 8 }}
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500); }}>
      {done ? "Copied!" : "Copy"}
    </button>
  );
}
