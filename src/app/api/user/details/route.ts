import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { recipesTable } from "@/db/schemas/recipes";
import { usersTable } from "@/db/schemas/users";
import { authenticateSession } from "@/utils/sessions";
import { count, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {

  const sessionId = cookies().get('session_id')?.value;
  const { expired, message, userId } = await authenticateSession(sessionId)

  if (expired) {
    return NextResponse.json({ message: message }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ message: "Something went wrong. Please contact admin" }, { status: 500 })
  }

  const userData = await db
    .select({ id: usersTable.id, username: usersTable.username, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, userId))

  const recipesCount = await db
    .select({ count: count() })
    .from(recipesTable)
    .where(eq(recipesTable.userId, userData[0]?.id))

  const categoryCount = await db
    .select({ count: count() })
    .from(categoriesTable)
    .where(eq(categoriesTable.userId, userData[0]?.id))

  return NextResponse.json({
    username: userData[0]?.username,
    email: userData[0]?.email,
    recipeCount: recipesCount[0]?.count,
    categoryCount: categoryCount[0]?.count
  },
    { status: 200 }
  )
}