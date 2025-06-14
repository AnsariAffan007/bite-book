import { Cancel, Check, Delete, Edit } from '@mui/icons-material';
import { Button, Stack } from '@mui/material'
import React from 'react'

interface ActionCellProps {
  editState: boolean;
  onEditHandler: () => void;
  onDeleteHandler: () => void;
  onCancelEditHandler?: () => void;
  onSubmitHandler?: () => void;
  loading?: boolean;
}

const ActionCell: React.FC<ActionCellProps> = ({ editState, onEditHandler, onDeleteHandler, onCancelEditHandler, onSubmitHandler, loading }) => {
  return (
    !editState
      ? (
        <Stack direction="row" width="100%" justifyContent="center" columnGap={1}>
          <Button disabled={loading} sx={{ minWidth: 'auto' }} onClick={() => onEditHandler()}>
            <Edit sx={{ fontSize: '1.15rem' }} />
          </Button>
          <Button disabled={loading} sx={{ minWidth: 'auto' }} onClick={() => onDeleteHandler()}>
            <Delete sx={{ fontSize: '1.15rem' }} />
          </Button>
        </Stack>
      )
      : (
        <Stack direction="row" width="100%" justifyContent="center" columnGap={1}>
          <Button disabled={loading} sx={{ minWidth: 'auto' }} onClick={() => onCancelEditHandler?.()}>
            <Cancel sx={{ fontSize: '1.15rem' }} />
          </Button>
          <Button disabled={loading} sx={{ minWidth: 'auto' }} onClick={() => onSubmitHandler?.()}>
            <Check sx={{ fontSize: '1.15rem' }} />
          </Button>
        </Stack>
      )
  )
}

export default ActionCell