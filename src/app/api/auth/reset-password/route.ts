import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { db } from "@/db";
import { resetPassTokensTable } from "@/db/schemas/resetPassTokens";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schemas/users";
import { sessionTable } from "@/db/schemas/sessions";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If no token provided
    if (!body.token) {
      return NextResponse.json({ message: 'Reset link is missing!' }, { status: 400 })
    }

    // DB lookup
    const allTokens = await db
      .select()
      .from(resetPassTokensTable)
    let tokenRow = null;
    for (const t of allTokens) {
      const isMatch = await bcrypt.compare(body.token, t.token)
      if (isMatch) {
        tokenRow = t;
        break;
      }
    }

    // If no token found
    if (!tokenRow) {
      return NextResponse.json({ message: 'Invalid token provided!' }, { status: 401 })
    }

    // If token is expired
    if (tokenRow.expiresAt < new Date()) {
      await db
        .delete(resetPassTokensTable)
        .where(eq(resetPassTokensTable.userId, tokenRow.userId))
      return NextResponse.json({ message: 'Link has expired! Please generate new link again' }, { status: 401 })
    }

    const newHashedPassword = await bcrypt.hash(body.password, 10)
    // Reset and delete token in a transaction
    await db.transaction(async tx => {
      await tx
        .delete(sessionTable)
        .where(eq(sessionTable.userId, tokenRow.userId))

      // Reset Pass
      await tx
        .update(usersTable)
        .set({
          password: newHashedPassword
        })
        .where(eq(usersTable.id, tokenRow.userId))

      // Delete token
      await tx
        .delete(resetPassTokensTable)
        .where(eq(resetPassTokensTable.userId, tokenRow.userId))
    })

    const headers = new Headers();
    headers.append('Set-Cookie', `session_id=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);

    return NextResponse.json({ message: "Password was reset successfully! Please login again" }, { status: 200 })

  }
  catch (e) {
    console.log("Error resetting password: ", e);
    return NextResponse.json({ message: 'Error resetting your password! Please contact admin', error: e }, { status: 500 })
  }
}