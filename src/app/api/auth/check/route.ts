import { authenticateSession } from "@/utils/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = cookies().get('session_id')?.value;
  const { expired, message, userId, userData } = await authenticateSession(sessionId)

  if (expired) {
    return NextResponse.json({ message: message }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ message: "Something went wrong. Please contact admin" }, { status: 500 })
  }

  return NextResponse.json({ message: "User is authenticated alright!", data: userData }, { status: 200 })
}