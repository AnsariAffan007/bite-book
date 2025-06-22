import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { recipesTable } from "@/db/schemas/recipes";
import { authenticateSession } from "@/utils/sessions";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const id: any = params.id;
    const body = await req.json();

    await db
      .update(categoriesTable)
      .set({
        name: body.name,
        description: body.description
      })
      .where(eq(categoriesTable.id, id))

    return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong", error: error }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message, userId } = await authenticateSession(sessionId)
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const categoryId: any = params.id
    const categoryToBeDeleted = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .limit(1)
    if (categoryToBeDeleted[0].userId !== userId) {
      return NextResponse.json({ message: "You cannot delete a category which wasn't created by you", error: null }, { status: 400 });
    }

    const recipesWithCategory = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.categoryId, categoryId));
    if (recipesWithCategory.length > 0) {
      return NextResponse.json({ message: "Category currently in use by some recipe", error: null }, { status: 409 });
    }

    await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId))

    return new Response(null, { status: 204 });
  }
  catch (error) {
    return NextResponse.json({ message: "Something went wrong. Please contact admin", error: error }, { status: 500 });
  }
}