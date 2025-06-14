import { db } from "@/db"
import { categoriesTable } from "@/db/schemas/categories"
import { NextResponse } from "next/server"

export async function GET() {
  try {

    const categories = await db
      .select()
      .from(categoriesTable)

    return NextResponse.json({ message: "Successfully retrieved categories", data: [...categories] }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: "Could not retrieve categories! Please contact admin", error: e }, { status: 500 })
  }
}