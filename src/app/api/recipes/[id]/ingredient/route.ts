import { db } from "@/db"
import { ingredientsTable } from "@/db/schemas/ingredients"
import { authenticateSession } from "@/utils/sessions"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: { id: any } }) {
  try {
    const recipeId = params.id

    const ingredients = await db
      .select()
      .from(ingredientsTable)
      .where(eq(ingredientsTable.recipeId, recipeId))

    return NextResponse.json({ message: "Successfully retrieved ingredients", data: [...ingredients] }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: "Could not retrieve recipes! Please contact admin", error: e }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const body = await req.json()
    await db
      .insert(ingredientsTable)
      .values({
        recipeId: body.recipeId,
        name: body.name,
        quantity: body.quantity,
        type: body.type,
        unit: body.unit,
        optional: body.optional
      })

    return NextResponse.json({ message: 'Ingredient added successfully' }, { status: 201 })
  }
  catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Internal Server Error, please contact admin', error: e }, { status: 500 })
  }
}