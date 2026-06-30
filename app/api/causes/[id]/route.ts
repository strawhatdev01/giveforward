import { NextResponse } from "next/server";
import { getCause } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cause = await getCause(id);
  if (!cause) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  return NextResponse.json(cause);
}
