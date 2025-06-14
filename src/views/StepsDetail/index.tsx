"use client";

import { Box, Button } from '@mui/material'
import { addEdge, Background, Edge, MarkerType, ReactFlow, reconnectEdge, useEdgesState, useNodesState } from '@xyflow/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@xyflow/react/dist/style.css';
import StepNode from '@/components/StepNode';
import StepDialog from './StepDialog';
import { Add, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import useSave from './useSave';
import useInitialSteps from './useInitialSteps';
import { usePathname } from 'next/navigation';
import axios from 'axios';

const StepsDetail = () => {

  const [dialog, setDialog] = useState({
    open: false,
    step: null
  });

  const pathname = usePathname()
  const recipeId = useMemo(() => {
    const pathArray = pathname.split('/').filter(Boolean);
    return pathArray[pathArray.length - 2]
  }, [pathname])

  // #region Ingredients
  const [ingredients, setIngredients] = useState([])
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await axios.get(`/api/recipes/${recipeId}`);
        if (res?.data?.data?.ingredients) setIngredients(res?.data?.data?.ingredients)
      }
      catch (e) {
        console.log("Error fetching ingredients: ", e)
      }
    }
    fetchIngredients()
  }, [])

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  useInitialSteps(setDialog, recipeId, setNodes, setEdges)

  const onConnect = useCallback(
    (params: any) => {
      if (edges.find(e => e.source === params.source)) return;
      setEdges((eds: any) => addEdge({
        ...params,
        // type: 'bidirectional',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      }, eds))
      setNodes(prev => prev
        .map(p => p.id === params.source
          ? { ...p, data: { ...p.data, connection: params.target } }
          : { ...p }
        )
      )
    },
    [setEdges, edges],
  );

  // #region Node Update
  const handleConfirm = (values: any, action: string, stepId?: string) => {
    const nodeData = {
      name: values.name,
      description: values.description,
      connection: values.connection?.id,
      ingredients: values.ingredients?.map((i: any) => ({ id: i.name.id, name: i.name.name, optional: i.name.optional, quantity: i.quantity, unit: i.name.unit })),
      onEdit: (step: any) => setDialog({ open: true, step: step }),
    };

    if (action === "ADD") {
      setNodes((nds) => [
        ...nds,
        {
          id: `s${nds.length + 1}`,
          position: { x: 10, y: 10 },
          data: {
            name: values.name,
            description: values.description,
            connection: values.connection?.id,
            ingredients: values.ingredients?.map((i: any) => ({ id: i.name.id, name: i.name.name, optional: i.name.optional, quantity: i.quantity, unit: i.name.unit })),
            onEdit: (step: any) => setDialog({ open: true, step: step }),
          },
          type: 'myNode'
        },
      ]);
      updateEdges(`s${nodes.length + 1}`, values.connection?.id)
    }

    else if (action === "EDIT") {
      setNodes((prev) => prev.map((n: any) => n.id === stepId ? ({ ...n, data: { ...nodeData } }) : { ...n }))

      const nodeToUpdate = nodes.find(n => n.id === stepId)
      updateEdges(nodeToUpdate!.id, values.connection?.id)
    }
    setDialog({ open: false, step: null })
  }

  // #region Edge Update
  const updateEdges = (sourceNodeId: string, targetNodeId: string) => {
    const existingConnection = edges
      .find(e =>
        (e.source === sourceNodeId && e.target === targetNodeId)
        ||
        (e.source === sourceNodeId && e.target === targetNodeId)
      )
    if (existingConnection) return;

    // If target node does not exist, remove any existing connection edge from source
    if (!targetNodeId) {
      setEdges(prev => prev.filter(p => p.source !== sourceNodeId))
    }
    else {
      setEdges(prev => {
        const sourceEdgeRemoved = prev.filter(e => e.source !== sourceNodeId)
        return ([
          ...sourceEdgeRemoved,
          {
            id: `${sourceNodeId}-${targetNodeId}`,
            source: sourceNodeId,
            target: targetNodeId,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
            sourceHandle: 'source-bottom-3',
            targetHandle: 'target-top-1'
          }
        ])
      })
    }
  }

  // #region Reconnection
  // <-------------------------Re-connection ------------------------->
  const edgeReconnectSuccessful = useRef(true);
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      // Set connection property in source node to null, if edge is being removed
      setNodes(prev => prev.map(p => p.id === edge.source ? { ...p, data: { ...p.data, connection: null } } : { ...p }))
    }

    edgeReconnectSuccessful.current = true;
  }, []);

  // #region SAVE & JSX
  const { handleSave, loading } = useSave(nodes, edges, recipeId)

  return (
    <>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
        }}
      >
        <Link href='/profile/recipes/' style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <ArrowBack sx={{ fontSize: '1rem' }} />
          <span style={{ marginBottom: '2px' }}>Recipes</span>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
          <Button
            variant='outlined'
            color='primary'
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: 'white' }
            }}
            startIcon={<Add />}
            disableElevation
            disableRipple
            onClick={() => setDialog({ open: true, step: null })}
          >
            Add Step
          </Button>
          <Button
            disableElevation
            variant='contained'
            onClick={() => handleSave()}
            disabled={loading}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: '80vh'
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={{
            myNode: StepNode
          }}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
        >
          <Background />
        </ReactFlow>

        {dialog.open && (
          <StepDialog
            open={dialog.open}
            step={dialog.step}
            nodes={nodes}
            recipeIngredients={ingredients}
            handleClose={() => setDialog(prev => ({ ...prev, open: false }))}
            handleConfirm={handleConfirm}
          />
        )}
      </Box>
    </>
  )
}

export default StepsDetail