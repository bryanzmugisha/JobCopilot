// Run at request time, never during the build (these touch the DB).
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tailorSummary, tailorCoverLetter } from "@/lib/anthropic";

export async function POST(req: Request) {
  const { jobId } = await req.json();
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  const profile = await prisma.profile.findFirst({ include: { answers: true } });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (!profile) return NextResponse.json({ error: "Set up your profile first" }, { status: 400 });

  try {
    const [summary, cover] = await Promise.all([
      tailorSummary(profile, job),
      tailorCoverLetter(profile, job),
    ]);

    // Replace any previous docs for this job
    await prisma.tailoredDoc.deleteMany({ where: { jobId: job.id } });
    await prisma.tailoredDoc.createMany({
      data: [
        { jobId: job.id, type: "SUMMARY", content: summary },
        { jobId: job.id, type: "COVER_LETTER", content: cover },
      ],
    });
    if (job.status === "SAVED") {
      await prisma.job.update({ where: { id: job.id }, data: { status: "TAILORED" } });
    }
    return NextResponse.json({ summary, cover });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}