import { db } from "@/db";
import { categoriesTable } from "@/db/schemas/categories";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id: any = params.id; // Get ID from URL
    const body = await req.json(); // Parse request body

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