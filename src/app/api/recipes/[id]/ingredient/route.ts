import { db } from "@/db"
import { ingredientsTable } from "@/db/schemas/ingredients"
import { authenticateSession } from "@/utils/sessions"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

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