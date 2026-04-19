import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.accessToken) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }
  return NextResponse.json({ accessToken: session.accessToken });
}
