import { db } from "@/db";
import { sessionTable } from "@/db/schemas/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {

  const sessionId = cookies().get('session_id')?.value;

  try {
    await db.delete(sessionTable).where(eq(sessionTable.sessionId, sessionId || ''))
  }
  catch (e) {
    return NextResponse.json({ message: 'Logout failed', error: e }, { status: 500 });
  }

  const headers = new Headers();
  headers.append('Set-Cookie', `session_id=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);

  return NextResponse.json({ message: 'Logout successful' }, { status: 200, headers });
}