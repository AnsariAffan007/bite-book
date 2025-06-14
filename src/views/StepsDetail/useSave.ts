import NodeType from "@/components/StepNode/types"
import { Edge } from "@xyflow/react"
import axios from "axios"
import { enqueueSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"

const useSave = (nodes: NodeType[], edges: Edge[], recipeId: string) => {

  const nodesTransformed = useRef<any>(null);
  const edgesTransformed = useRef<any>(null);

  useEffect(() => {
    nodesTransformed.current = nodes.map(n => ({
      stepId: n.id,
      width: Math.round(n.measured?.width || 0),
      height: Math.round(n.measured?.height || 0),
      x: Math.round(n.position.x),
      y: Math.round(n.position.y),
      name: n.data.name,
      description: n.data.description,
      ingredients: n.data.ingredients?.map(i => ({ ingredientId: i.id, quantity: i.quantity }))
    }))
  }, [nodes])

  useEffect(() => {
    edgesTransformed.current = edges.map(e => ({
      sourceStepId: e.source,
      targetStepId: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    }))
  }, [edges])

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `/api/recipes/${recipeId}/steps`,
        {
          nodes: nodesTransformed.current,
          edges: edgesTransformed.current
        }
      )
      enqueueSnackbar(res.data?.message, { variant: 'success' })
    }
    catch (e) {
      console.log("Error saving recipe: ", e)
      enqueueSnackbar(e?.response?.data?.message || "Something went wrong", { variant: 'error' })
    }
    setLoading(false);
  }

  return {
    handleSave,
    loading
  }

}

export default useSave