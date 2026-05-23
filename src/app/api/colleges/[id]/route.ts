import { NextResponse } from "next/server";
import { mockColleges } from "@/data/mockColleges";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const college = mockColleges.find((c) => c.id === id);

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  return NextResponse.json(college);
}
