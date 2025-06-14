"use client"

import StepNode from '@/components/StepNode'
import useInitialSteps from '@/views/StepsDetail/useInitialSteps'
import { Box } from '@mui/material'
import { Background, Edge, ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import React, { useMemo } from 'react'

const Page = () => {

  const INITIAL_EDGES: Edge[] = useMemo(() => [], [])
  const { INITIAL_NODES } = useInitialSteps()

  return (
    <Box my={4} width='100%' height='70vh' border="1px solid #aaa" position="relative">
      <ReactFlow
        nodes={INITIAL_NODES}
        edges={INITIAL_EDGES}
        fitView
        nodeTypes={{
          myNode: StepNode
        }}
      >
        <Background />
      </ReactFlow>
    </Box>
  )
}

export default Page