import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { sessionTable } from "@/db/schemas/sessions";
import { authenticateSession } from "@/utils/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// #region GET
export async function GET(req: Request) {

  const sessionId = cookies().get('session_id')?.value;
  const { authenticated, expired, message, userId }: any = await authenticateSession(sessionId)

  if (authenticated && expired) {
    return NextResponse.json({ message: message }, { status: 401 })
  }

  const url = new URL(req.url)
  const isGetAll = url.searchParams.get('get') === 'all';

  try {
    let categoriesToReturn: any = []
    if (!authenticated) {
      categoriesToReturn = await db.select().from(categoriesTable)
    }
    else if (authenticated && !expired) {
      let query = db.select().from(categoriesTable);
      categoriesToReturn = !isGetAll
        ? await query.where(eq(categoriesTable.userId, userId))
        : await query;
    }

    return NextResponse.json({ message: "Successfully retrieved categories", data: [...categoriesToReturn] }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: "Could not retrieve categories! Please contact admin", error: e }, { status: 500 })
  }
}

// #region POST
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sessionId = cookies().get('session_id')?.value
    // Getting user id through the session table
    const session = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.sessionId, sessionId || ""))
    const userId = session[0].userId;

    await db.insert(categoriesTable).values({
      name: body.name,
      description: body.description,
      recipesCount: 0,
      userId: userId
    })

    return NextResponse.json({ message: 'Category successfully created' }, { status: 201 })
  }
  catch (e) {
    return NextResponse.json({ message: 'Internal Server Error, please contact admin', error: e }, { status: 500 })
  }
}