import { DeleteOutline } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'

const primaryColor = '#FF7D29';

interface IngredientCardInterface {
  name: string,
  type: string,
  quantity: number,
  unit: string,
  optional: boolean,
  onClick?: (ingredient: any) => void,
  handleDelete?: () => void,
  loading?: boolean
}

const IngredientCard: React.FC<IngredientCardInterface> = ({
  name,
  type,
  quantity,
  unit,
  optional,
  onClick = () => { },
  handleDelete = () => { },
  loading = false
}) => {
  
  return (
    <Box
      p={1}
      sx={{ border: `1px solid #dadada`, bgcolor: '#ececec', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
      onClick={() => onClick({ name, type, quantity, unit, optional })}
    >
      <IconButton
        size='small'
        color='error'
        sx={{
          position: 'absolute',
          top: "-10px",
          right: '-10px',
          backgroundColor: '#eee',
          border: '1px solid #ddd',
          borderRadius: '50%',
          width: '30px',
          height: '30px'
        }}
        onClick={(e) => {
          handleDelete()
          e.stopPropagation()
        }}
        disabled={loading}
      >
        <DeleteOutline sx={{ fontSize: '1.1rem' }} />
        {/* <CircularProgress sx={{ width: '15px !important', height: 'auto !important' }} /> */}
      </IconButton>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', columnGap: 1 }}>
        <Stack>
          {/* <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Name</Typography> */}
          <Typography fontSize="1.2rem">{name}</Typography>
        </Stack>
        {optional && (
          <Typography
            component="span"
            sx={{ fontSize: '0.8rem', px: 0.6, py: 0.2, border: '1px solid', borderColor: `${primaryColor}`, borderRadius: '14px' }}
            color="primary"
          >
            Optional
          </Typography>
        )}
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography fontSize="0.9rem" sx={{ flexBasis: '40%' }} color="#666">Type</Typography>
        <Typography fontSize="0.9rem">{type}</Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography fontSize="0.9rem" sx={{ flexBasis: '40%' }} color="#666">Quantity</Typography>
        <Typography fontSize="0.9rem">{`${quantity} ${unit}(s)`}</Typography>
      </Box>

    </Box>
  )
}

export default IngredientCard