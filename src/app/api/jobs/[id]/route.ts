// Run at request time, never during the build (these touch the DB).
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { docs: { orderBy: { createdAt: "desc" } } },
  });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json();
  const data: any = {};
  for (const f of ["status", "notes", "title", "company", "url", "location", "source", "description"]) {
    if (f in body) data[f] = body[f];
  }
  if (body.status === "APPLIED") data.appliedAt = new Date();
  if ("followUpAt" in body) data.followUpAt = body.followUpAt ? new Date(body.followUpAt) : null;
  const job = await prisma.job.update({ where: { id: params.id }, data });
  return NextResponse.json(job);
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.job.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}