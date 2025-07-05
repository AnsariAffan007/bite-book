import { db } from "@/db";
import { usersTable } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { resetPassTokensTable } from "@/db/schemas/resetPassTokens";
import sendmail from "@/utils/sendmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Getting the user thorugh provided username
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, body.username))

    // If user wasn't found
    if (user.length === 0) {
      return NextResponse.json({ message: 'No user found with specified username!' }, { status: 404 })
    }
    // If provided email doesn't match with username
    if (user[0]?.email !== body.email) {
      return NextResponse.json({ message: "Username and email doesn't match!" }, { status: 403 })
    }

    // If token already exists
    const resetPassToken = await db
      .select()
      .from(resetPassTokensTable)
      .where(eq(resetPassTokensTable.userId, user[0].id))
    if (resetPassToken.length > 0 && resetPassToken[0]?.expiresAt > new Date()) {
      return NextResponse.json({ message: "Link has already been sent" }, { status: 409 })
    }

    // Delete existing token if any
    if (resetPassToken.length > 0 && resetPassToken[0].expiresAt < new Date()) {
      await db.delete(resetPassTokensTable).where(eq(resetPassTokensTable.userId, user[0].id))
    }

    // Token generation
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 6)

    // DB Entry
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    await db
      .insert(resetPassTokensTable)
      .values({
        userId: user[0]?.id,
        token: hashedToken,
        createdAt: new Date(),
        expiresAt: expiresAt
      })

    // Generate link
    const resetPassLink = `https://bite-book.vercel.app/reset-password?token=${token}`

    // Send email
    await sendmail(user[0].email, resetPassLink)

    return NextResponse.json({ message: "A mail has been sent to reset your password" }, { status: 200 })
  }
  catch (e) {
    console.log("Forgot Password Error: ", e)
    return NextResponse.json({ message: "Something went wrong. Please contact admin", error: e }, { status: 500 })
  }
}