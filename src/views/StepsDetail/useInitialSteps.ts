import { useCallback, useEffect } from "react"
import axios from "axios"

const useInitialSteps = (setDialog: any, recipeId: string, setNodes: any, setEdges: any) => {

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await axios.get(`/api/recipes/${recipeId}/steps`)
        if (res?.data?.data?.nodes && res?.data?.data?.edges) {
          setNodes(getTransformedNodes(res.data.data.nodes, res.data.data.edges, res.data.data.stepIngredients, res.data.data.ingredients))
          setEdges(getTransformedEdges(res.data.data.edges))
        }
      }
      catch (e) {
        console.log("Error fetching steps: ", e)
      }
    }
    fetchNodes()
  }, [])

  const getTransformedNodes = useCallback((nodes: any, edges: any, stepIngredients: any, ingredients: any) => {
    return nodes?.map((n: any) => ({
      id: n.stepId,
      data: {
        name: n.name,
        description: n.description,
        connection: edges?.find((e: any) => e.sourceStepId === n.stepId)?.targetStepId,
        onEdit: (step: any) => setDialog({ open: true, step: step }),
        ingredients: stepIngredients
          ?.filter((si: any) => si.stepId === n.id)
          ?.map((si: any) => {
            const ingredientObj = ingredients?.find((i: any) => i.id === si.ingredientId)
            return {
              id: si.ingredientId,
              name: ingredientObj.name,
              optional: ingredientObj.optional,
              quantity: si.quantity,
              unit: ingredientObj.unit
            }
          })
      },
      position: {
        x: n.x,
        y: n.y
      },
      measured: {
        width: n.width,
        height: n.height
      },
      type: "myNode"
    }))
  }, [])

  const getTransformedEdges = useCallback((edges: any) => {
    return edges?.map((e: any) => ({
      id: `${e.sourceStepId}_${e.sourceHandle}-${e.targetStepId}_${e.targetHandle}`,
      markerEnd: {
        "type": "arrowclosed",
        "width": 20,
        "height": 20
      },
      source: e.sourceStepId,
      sourceHandle: e.sourceHandle,
      target: e.targetStepId,
      targetHandle: e.targetHandle
    }))
  }, [])
}

export default useInitialSteps