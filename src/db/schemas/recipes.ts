import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, doublePrecision, pgEnum, text, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { categoriesTable } from "./categories";

export const difficultyEnum = pgEnum("difficulty", ["Easy", "Medium", "Hard", "Extreme"]);
// export const mealTimeEnum = pgEnum("meal_time", ["Breakfast", "Brunch", "Lunch", "Snacks", "Dinner", "Other"]);

export const recipesTable = pgTable(
  "recipes",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 40 }).notNull(),
    categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
    image: varchar(),
    description: varchar("description", { length: 500 }),
    prepTime: doublePrecision("prep_time").notNull(),
    difficulty: difficultyEnum().notNull(),
    mealTime: text("meal_time").array().notNull(),
    idealServings: integer("ideal_servings").notNull()
  },
  (table) => (
    [
      sql`CHECK (${table.idealServings} <= 50)`,
      unique().on(table.userId, table.name),
    ]
  )
);