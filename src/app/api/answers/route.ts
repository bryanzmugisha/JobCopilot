// Run at request time, never during the build (these touch the DB).
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const b = await req.json();
  const profile = await prisma.profile.findFirst();
  if (!profile) return NextResponse.json({ error: "Create a profile first" }, { status: 400 });
  const answer = await prisma.answer.create({
    data: { label: b.label, question: b.question, content: b.content, profileId: profile.id },
  });
  return NextResponse.json(answer, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.answer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}