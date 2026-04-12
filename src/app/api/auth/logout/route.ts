import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST() {
  const session = await getSession();

  if (session.accessToken) {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
    }).catch(() => {});
  }

  session.destroy();

  return NextResponse.json({ success: true });
}
