import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { ingredientsTable } from "@/db/schemas/ingredients";
import { recipesTable } from "@/db/schemas/recipes";
import { usersTable } from "@/db/schemas/users";
import { authenticateSession } from "@/utils/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// #region GET
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId: any = params.id;
    const recipe = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.id, recipeId))
      .leftJoin(categoriesTable, eq(recipesTable.categoryId, categoriesTable.id))
      .leftJoin(usersTable, eq(recipesTable.userId, usersTable.id))

    const ingredients = await db
      .select()
      .from(ingredientsTable)
      .where(eq(ingredientsTable.recipeId, recipeId))

    return NextResponse.json({ message: "Successfully retrieved recipe", data: { ...recipe[0], ingredients: [...ingredients] } }, { status: 200 })
  }
  catch (e) {
    console.log("Error fetching recipe: ", e)
    return NextResponse.json({ message: "Could not retrieve recipe! Please contact admin", error: e }, { status: 500 })
  }
}

// #region PUT
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const body = await req.json();
    const recipeId: any = params.id;

    // Updating recipe details
    await db
      .update(recipesTable)
      .set({
        name: body?.name,
        categoryId: body?.category,
        description: body?.description,
        prepTime: body?.preptime,
        difficulty: body?.difficulty,
        mealTime: body?.mealtime,
        idealServings: body?.servings,
      })
      .where(eq(recipesTable.id, recipeId))


    return NextResponse.json({ message: "Recipe updated successfully" }, { status: 200 });
  }
  catch (e) {
    console.log("Error: ", e)
    return NextResponse.json({ message: "Failed to update recipe.", error: e }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const recipeId: any = params.id
    await db
      .delete(recipesTable)
      .where(eq(recipesTable.id, recipeId))

    return new Response(null, { status: 204 });
  }
  catch (e) {
    console.log("Error: ", e)
    return NextResponse.json({ message: "Failed to delete recipe.", error: e }, { status: 500 })
  }
}