import { boolean, doublePrecision, integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { recipesTable } from "./recipes";

export const quantityUnitEnum = pgEnum(
  'ingredient_units',
  [
    "Grams",
    "Kilograms",
    "Milliliters",
    "Liters",
    "Teaspoon",
    "Tablespoon",
    "Cup",
    "Ounces",
    "Pounds",
    "Piece",
    "Pinch",
    "Slice"
  ]
);

export const ingredientTypeEnum = pgEnum(
  'ingredient_types',
  [
    "Vegetable",
    "Fruit",
    "Meat",
    "Seafood",
    "Dairy",
    "Grain",
    "Spice",
    "Herb",
    "Condiment",
    "Legume",
    "Nut",
    "Sweetener",
    "Beverage",
    "Oil",
    "Other",
  ]
);


export const ingredientsTable = pgTable('ingredients', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recipeId: integer('recipe_id').notNull().references(() => recipesTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 30 }),
  optional: boolean().notNull(),
  quantity: doublePrecision().notNull(),
  unit: quantityUnitEnum().notNull(),
  type: ingredientTypeEnum().notNull()
})