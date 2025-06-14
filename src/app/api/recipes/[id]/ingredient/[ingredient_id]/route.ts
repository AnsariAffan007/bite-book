import { db } from "@/db";
import { ingredientsTable } from "@/db/schemas/ingredients";
import { authenticateSession } from "@/utils/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { ingredient_id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const ingredientId: any = params.ingredient_id
    const body = await req.json()
    await db
      .update(ingredientsTable)
      .set({
        recipeId: body.recipeId,
        name: body.name,
        quantity: body.quantity,
        type: body.type,
        unit: body.unit,
        optional: body.optional
      })
      .where(eq(ingredientsTable.id, ingredientId))

    return NextResponse.json({ message: "Ingredient updated successfully" }, { status: 200 });
  }
  catch (e) {
    console.log("Error: ", e)
    return NextResponse.json({ message: "Failed to update ingredient.", error: e }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { ingredient_id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const ingredientId: any = params.ingredient_id
    await db
      .delete(ingredientsTable)
      .where(eq(ingredientsTable.id, ingredientId))

    return new Response(null, { status: 204 });
  }
  catch (e) {
    console.log("Error: ", e)
    return NextResponse.json({ message: "Failed to update ingredient.", error: e }, { status: 500 })
  }
}