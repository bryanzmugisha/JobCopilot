"use client";
import { useEffect, useState } from "react";

const empty = { fullName: "", email: "", phone: "", location: "", github: "", linkedin: "", cvFacts: "", baseSummary: "" };

export default function ProfilePage() {
  const [p, setP] = useState<any>(empty);
  const [answers, setAnswers] = useState<any[]>([]);
  const [na, setNa] = useState({ label: "", question: "", content: "" });
  const [saved, setSaved] = useState(false);

  async function load() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (data) { setP({ ...empty, ...data }); setAnswers(data.answers || []); }
  }
  useEffect(() => { load(); }, []);

  const up = (k: string) => (e: any) => setP({ ...p, [k]: e.target.value });

  async function save() {
    await fetch("/api/profile", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
    setSaved(true); setTimeout(() => setSaved(false), 1500); load();
  }
  async function addAnswer() {
    if (!na.label || !na.content) return;
    await fetch("/api/answers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(na) });
    setNa({ label: "", question: "", content: "" }); load();
  }
  async function delAnswer(id: string) {
    await fetch("/api/answers", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div>
      <h1>Your profile</h1>
      <p className="muted">This is the single source of truth the tailoring engine pulls from. Fill it in once.</p>

      <div className="card">
        <div className="grid2">
          <div><label>Full name</label><input value={p.fullName} onChange={up("fullName")} /></div>
          <div><label>Email</label><input value={p.email} onChange={up("email")} /></div>
          <div><label>Phone</label><input value={p.phone} onChange={up("phone")} /></div>
          <div><label>Location</label><input value={p.location} onChange={up("location")} /></div>
          <div><label>GitHub</label><input value={p.github} onChange={up("github")} /></div>
          <div><label>LinkedIn</label><input value={p.linkedin} onChange={up("linkedin")} /></div>
        </div>
        <label>Base summary</label>
        <textarea value={p.baseSummary} onChange={up("baseSummary")} />
        <label>CV facts (paste everything: experience, skills, education, achievements)</label>
        <textarea value={p.cvFacts} onChange={up("cvFacts")} style={{ minHeight: 200 }} />
        <div className="row" style={{ marginTop: 12 }}>
          <button onClick={save}>{saved ? "Saved!" : "Save profile"}</button>
        </div>
      </div>

      <h2>Reusable answers</h2>
      <p className="muted">Save your stock answers to common screening questions once, then paste them in seconds.</p>
      {answers.map((a) => (
        <div key={a.id} className="card">
          <div className="row"><strong>{a.label}</strong><div className="spacer" />
            <button className="ghost" style={{ fontSize: 12, padding: "3px 8px" }} onClick={() => navigator.clipboard.writeText(a.content)}>Copy</button>
            <button className="ghost" style={{ fontSize: 12, padding: "3px 8px" }} onClick={() => delAnswer(a.id)}>Delete</button>
          </div>
          {a.question && <div className="muted" style={{ marginTop: 4 }}>{a.question}</div>}
          <div className="pre" style={{ marginTop: 6 }}>{a.content}</div>
        </div>
      ))}
      <div className="card">
        <label>Label</label><input value={na.label} onChange={(e) => setNa({ ...na, label: e.target.value })} placeholder="Careful data entry" />
        <label>Question (optional)</label><input value={na.question} onChange={(e) => setNa({ ...na, question: e.target.value })} />
        <label>Answer</label><textarea value={na.content} onChange={(e) => setNa({ ...na, content: e.target.value })} />
        <div className="row" style={{ marginTop: 12 }}><button onClick={addAnswer}>Add answer</button></div>
      </div>
    </div>
  );
}
