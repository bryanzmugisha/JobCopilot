// Run at request time, never during the build (these touch the DB).
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { updatedAt: "desc" },
    include: { docs: true },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.title || !body.company || !body.description) {
    return NextResponse.json(
      { error: "title, company and description are required" },
      { status: 400 }
    );
  }
  const job = await prisma.job.create({
    data: {
      title: body.title,
      company: body.company,
      url: body.url || null,
      location: body.location || null,
      source: body.source || null,
      description: body.description,
    },
  });
  return NextResponse.json(job, { status: 201 });
}