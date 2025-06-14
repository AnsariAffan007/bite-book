"use client"

import StepNode from '@/components/StepNode'
import useInitialSteps from '@/views/StepsDetail/useInitialSteps'
import { Box } from '@mui/material'
import { Background, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import React from 'react'

const Page = ({ params }: any) => {

  const [nodes, setNodes] = useNodesState<any>([]);
  const [edges, setEdges] = useEdgesState<any>([]);

  useInitialSteps(() => { }, params.id, setNodes, setEdges)

  return (
    <Box my={2} width='100%' height='70vh' borderTop="1px solid #aaa" position="relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
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