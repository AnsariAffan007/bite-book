import { db } from "@/db";
import { sessionTable } from "@/db/schemas/sessions";
import { usersTable } from "@/db/schemas/users";
import { and, eq, ne } from "drizzle-orm";

export async function authenticateSession(sessionId?: string) {

  if (!sessionId) {
    return {
      authenticated: false,
      expired: true,
      message: "You are not authenticated! Please log in",
      userId: null
    }
  }
  const session = await db.select().from(sessionTable).where(eq(sessionTable.sessionId, sessionId));
  if (new Date() > session[0].expiresAt) {
    return {
      authenticated: true,
      expired: true,
      message: "Your session has expired! Please log in again",
      userId: null
    }
  }
  try {
    await db.delete(sessionTable)
      .where(
        and(
          eq(sessionTable.userId, session[0].userId),
          ne(sessionTable.sessionId, sessionId)
        )
      )
  }
  catch (e) {
    console.log("Error deleting previous sessions: ", e)
  }

  const user = await db
    .select({ username: usersTable.username, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, session[0].userId))

  return {
    authenticated: true,
    expired: false,
    message: "This guy's legit fr",
    userId: session[0].userId,
    userData: user[0]
  }
}