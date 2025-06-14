import { Node } from "@xyflow/react"

export interface IngredientType {
  id: number,
  name: string;
  optional: boolean;
  quantity: number;
  unit: string;
}

interface NodeType extends Node {
  data: {
    name: string,
    description: string,
    ingredients: IngredientType[];
    onEdit: (step: any) => void
  }
}

export default NodeType