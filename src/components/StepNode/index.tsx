import { Handle, NodeProps, Position } from '@xyflow/react'
import React from 'react'
import NodeType, { IngredientType } from './types'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'

const sourceHandleStyles: React.CSSProperties = {
  backgroundColor: 'transparent',
  width: '30px',
  height: '30px',
  border: 'none',
  outline: '3px solid #666',
  outlineOffset: '-17px',
}

const targetHandleStyles: React.CSSProperties = {
  zIndex: -1,
  backgroundColor: 'transparent',
  pointerEvents: 'none',
  width: '30px',
  height: '30px',
  border: 'none',
  outline: '3px solid #666',
  outlineOffset: '-17px',
}

const StepNode: React.FC<NodeProps<NodeType>> = (props) => {
  
  const { name, description, ingredients, onEdit } = props.data

  return (
    <>
      <Box
        p={3}
        bgcolor="white"
        border="1px solid #888"
        minWidth="300px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize="1.2rem">{name}</Typography>
          <Tooltip
            placement='right-start'
            title={(
              <Box>
                <Typography fontSize="0.8rem" color="white">{description}</Typography>
              </Box>
            )}
          >
            <InfoOutlined sx={{ fontSize: '1rem' }} />
          </Tooltip>
        </Box>

        <Stack my={2}>
          {ingredients?.map((i: IngredientType, index: number) => (
            <Box key={index} display="flex" alignItems="center" justifyContent="space-between">
              <Typography fontSize="0.9rem" color="#555">{`${i?.name} ${i.optional ? " (Optional)" : ""}`}</Typography>
              <Typography fontSize="0.9rem" color="#555">{`${i?.quantity} ${i?.unit}(s)`}</Typography>
            </Box>
          ))}
          {/* <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontSize="0.9rem" color="#555">Onion</Typography>
            <Typography fontSize="0.9rem" color="#555">3 Pieces</Typography>
          </Box> */}
        </Stack>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontSize="1rem" color="#555">Estimated Time</Typography>
          <Typography fontSize="1rem" color="#555">5 mins</Typography>
        </Box>

        <Box mt={1} display="flex" justifyContent="space-between" alignItems="center" columnGap={1}>
          <Button size='small' sx={{ width: '50%' }} variant='outlined' disableElevation>Delete</Button>
          <Button size='small' sx={{ width: '50%' }} variant='contained' disableElevation onClick={() => onEdit(props)}>Edit</Button>
        </Box>
      </Box>

      <Handle type="source" id="source-top-1" position={Position.Top} style={{ left: '50%', ...sourceHandleStyles }} />
      <Handle type="target" id="target-top-1" position={Position.Top} style={{ left: '50%', ...targetHandleStyles }} />

      <Handle type="source" id="source-right-2" position={Position.Right} style={{ top: '50%', ...sourceHandleStyles }} />
      <Handle type="target" id="target-right-2" position={Position.Right} style={{ top: '50%', ...targetHandleStyles }} />

      <Handle type="source" id="source-bottom-3" position={Position.Bottom} style={{ left: '50%', ...sourceHandleStyles }} />
      <Handle type="target" id="target-bottom-3" position={Position.Bottom} style={{ left: '50%', ...targetHandleStyles }} />

      <Handle type="source" id="source-left-4" position={Position.Left} style={{ top: '50%', ...sourceHandleStyles }} />
      <Handle type="target" id="target-left-4" position={Position.Left} style={{ top: '50%', ...targetHandleStyles }} />
    </>
  )
}

export default StepNode