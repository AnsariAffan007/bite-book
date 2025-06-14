import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { recipesTable } from "@/db/schemas/recipes";
import { usersTable } from "@/db/schemas/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recipes = await db
      .select({
        id: recipesTable.id,
        userName: usersTable.username,
        name: recipesTable.name,
        categoryName: categoriesTable.name,
        image: recipesTable.image,
        description: recipesTable.description,
        prepTime: recipesTable.prepTime,
        difficulty: recipesTable.difficulty,
        mealTime: recipesTable.mealTime,
        idealServings: recipesTable.idealServings,
      })
      .from(recipesTable)
      .leftJoin(usersTable, eq(recipesTable.userId, usersTable.id))
      .leftJoin(categoriesTable, eq(recipesTable.categoryId, categoriesTable.id))

    return NextResponse.json({ message: "Successfully retrieved recipes", data: [...recipes] }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: "Could not retrieve recipes! Please contact admin", error: e }, { status: 500 })
  }
}