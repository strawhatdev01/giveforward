import { NextRequest, NextResponse } from "next/server";
import { createCause, getCauses } from "@/lib/data";

export async function GET() {
  const causes = await getCauses();
  return NextResponse.json(causes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, org, category, emoji, goal, daysLeft, story, accountNumber, bankName } = body;

  if (!title || !org || !goal || !story) {
    return NextResponse.json({ error: "title, org, goal, and story are required" }, { status: 400 });
  }

  const cause = await createCause({
    title, org, category: category ?? "Other", emoji: emoji ?? "❤️",
    goal: Number(goal), daysLeft: Number(daysLeft ?? 30),
    story, accountNumber: accountNumber ?? "", bankName: bankName ?? "",
  });

  return NextResponse.json(cause, { status: 201 });
}
