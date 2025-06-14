import { db } from "@/db";
import { ingredientsTable } from "@/db/schemas/ingredients";
import { recipesTable } from "@/db/schemas/recipes";
import { authenticateSession } from "@/utils/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// #region GET
export async function GET() {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message, userId }: any = await authenticateSession(sessionId)

    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    let recipesToReturn: any = []

    if (!authenticated) {
      recipesToReturn = await db.select().from(recipesTable)
    }
    else if (authenticated && !expired) {
      recipesToReturn = await db
        .select()
        .from(recipesTable)
        .where(eq(recipesTable.userId, userId))
    }

    return NextResponse.json({ message: "Successfully retrieved recipes", data: [...recipesToReturn] }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: "Could not retrieve recipes! Please contact admin", error: e }, { status: 500 })
  }
}

// #region POST
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sessionId = cookies().get('session_id')?.value
    const { authenticated, expired, message, userId }: any = await authenticateSession(sessionId)

    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    await db.transaction(async (tx) => {
      const recipeInsertResult = await tx
        .insert(recipesTable)
        .values({
          name: body?.name,
          userId: userId,
          categoryId: body?.category,
          description: body?.description,
          prepTime: body?.preptime,
          difficulty: body?.difficulty,
          mealTime: body?.mealtime,
          idealServings: body?.servings,
        })
        .returning({ id: recipesTable.id })

      const recipeId = recipeInsertResult[0].id;

      await tx
        .insert(ingredientsTable)
        .values(body?.ingredients?.map(
          (i: any) => ({
            recipeId: recipeId,
            name: i.name,
            optional: i.optional,
            quantity: i.quantity,
            unit: i.unit,
            type: i.type,
          })
        ))
    })

    return NextResponse.json({ message: 'Recipe successfully created' }, { status: 201 })
  }
  catch (e) {
    if (e.code === '23505' && e.constraint === 'recipes_user_id_name_unique') {
      return NextResponse.json({ message: 'You already have a recipe with this name.', error: e }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error, please contact admin', error: e }, { status: 500 })
  }
}