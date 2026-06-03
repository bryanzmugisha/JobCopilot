"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJob() {
  const router = useRouter();
  const [f, setF] = useState({ title: "", company: "", url: "", location: "", source: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const up = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  async function save() {
    setSaving(true); setErr("");
    const res = await fetch("/api/jobs", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(f),
    });
    if (res.ok) { const j = await res.json(); router.push(`/jobs/${j.id}`); }
    else { setErr((await res.json()).error || "Something went wrong"); setSaving(false); }
  }

  return (
    <div>
      <h1>Add a job</h1>
      <p className="muted">Paste the details from a listing. The description is what the AI tailors against.</p>
      <div className="card">
        <div className="grid2">
          <div><label>Job title *</label><input value={f.title} onChange={up("title")} /></div>
          <div><label>Company *</label><input value={f.company} onChange={up("company")} /></div>
          <div><label>Location</label><input value={f.location} onChange={up("location")} placeholder="Remote" /></div>
          <div><label>Source</label><input value={f.source} onChange={up("source")} placeholder="We Work Remotely" /></div>
        </div>
        <label>Listing URL</label>
        <input value={f.url} onChange={up("url")} placeholder="https://..." />
        <label>Job description *</label>
        <textarea value={f.description} onChange={up("description")} style={{ minHeight: 180 }} />
        {err && <p style={{ color: "#b00" }}>{err}</p>}
        <div className="row" style={{ marginTop: 12 }}>
          <button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save job"}</button>
        </div>
      </div>
    </div>
  );
}
