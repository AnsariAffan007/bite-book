import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

interface CardInterface {
  name: string,
  type: string,
  quantity: number,
  unit: string,
  optional: boolean
}

const primaryColor = '#FF7D29';

const Card: React.FC<CardInterface> = ({ name, optional, type, quantity, unit }) => {
  
  return (
    <Box
      p={1}
      sx={{ border: `1px solid #dadada`, bgcolor: '#ececec', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}
    >

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

export default Card