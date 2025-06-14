import { db } from "@/db";
import { ingredientsTable } from "@/db/schemas/ingredients";
import { stepConnectionsTable } from "@/db/schemas/stepConnections";
import { stepIngredientsTable } from "@/db/schemas/stepIngredients";
import { stepsTable } from "@/db/schemas/steps";
import { authenticateSession } from "@/utils/sessions";
import { eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const recipeId: any = params.id
    const nodes = await db
      .select()
      .from(stepsTable)
      .where(eq(stepsTable.recipeId, recipeId))

    const stepIngredients = await db
      .select()
      .from(stepIngredientsTable)
      .where(inArray(stepIngredientsTable.stepId, nodes.map(n => n.id)))

    const ingredients = await db
      .select()
      .from(ingredientsTable)
      .where(inArray(ingredientsTable.id, stepIngredients.map((si: any) => si.ingredientId)))

    const edges = await db.select().from(stepConnectionsTable).where(eq(stepConnectionsTable.recipeId, recipeId))

    return NextResponse.json(
      {
        message: "Successfully retrieved recipe steps",
        data: {
          nodes,
          stepIngredients,
          ingredients,
          edges
        }
      },
      { status: 200 }
    )
  }
  catch (e) {
    return NextResponse.json({ message: 'Internal Server Error, please contact admin', error: e }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    const { authenticated, expired, message }: any = await authenticateSession(sessionId)
    if (!authenticated) {
      return NextResponse.json({ message: message }, { status: 401 })
    }
    if (authenticated && expired) {
      return NextResponse.json({ message: message }, { status: 401 })
    }

    const body = await req.json();

    const recipeId: any = params.id
    await db.transaction(async (tx) => {

      let ingredientsArray: any[] = [];
      // Deleting all steps of the recipe
      await tx.delete(stepsTable).where(eq(stepsTable.recipeId, recipeId))
      // Adding new steps, along with pushing all ingredients into above declared array
      const insertedSteps = await tx
        .insert(stepsTable)
        .values(body.nodes?.map((n: any) => {
          const newIngredients = n.ingredients?.map((i: any) => ({ stepId: n.stepId, ...i }))
          ingredientsArray = [...ingredientsArray, ...newIngredients]
          return {
            recipeId: Number(recipeId),
            stepId: n.stepId,
            width: n.width,
            height: n.height,
            x: n.x,
            y: n.y,
            name: n.name,
            description: n.description,
          }
        }))
        .returning({ id: stepsTable.id, stepId: stepsTable.stepId, recipeId: stepsTable.recipeId })

      // Preparing step ingredients to insert
      const stepIngredients = ingredientsArray.map(i => ({
        ingredientId: i.ingredientId,
        quantity: i.quantity,
        stepId: insertedSteps?.find(s => s.stepId === i.stepId)!.id
      }))
      await tx
        .insert(stepIngredientsTable)
        .values(stepIngredients)

      // Deleting all step connections of the recipe 
      await tx.delete(stepConnectionsTable).where(eq(stepConnectionsTable.recipeId, recipeId))
      // Adding new step connections
      await tx
        .insert(stepConnectionsTable)
        .values(body.edges?.map((e: any) => ({
          recipeId: Number(recipeId),
          sourceStepId: e.sourceStepId,
          targetStepId: e.targetStepId,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
        })))

    })

    return NextResponse.json({ message: "Successfully saved recipe steps" }, { status: 200 })
  }
  catch (e) {
    return NextResponse.json({ message: 'Internal Server Error, please contact admin', error: e }, { status: 500 })
  }
}