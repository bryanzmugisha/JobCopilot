// Run at request time, never during the build (these touch the DB).
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profile = await prisma.profile.findFirst({
    include: { answers: { orderBy: { createdAt: "asc" } } },
  });
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const b = await req.json();
  const existing = await prisma.profile.findFirst();
  const data = {
    fullName: b.fullName, email: b.email, phone: b.phone, location: b.location,
    github: b.github || null, linkedin: b.linkedin || null,
    cvFacts: b.cvFacts, baseSummary: b.baseSummary,
  };
  const profile = existing
    ? await prisma.profile.update({ where: { id: existing.id }, data })
    : await prisma.profile.create({ data });
  return NextResponse.json(profile);
}