import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

const Page = () => {
  return (
    <Box my={4}>
      <Stack spacing={1} mb={3}>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Meal Time</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">Breakfast, Snacks</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Preparation Time</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">2 Hours</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Difficulty</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">Medium</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Ideal Servings</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">2 Adults</Typography>
        </Box>
      </Stack>
      <Typography color="#666">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis praesentium vero numquam, eveniet vitae aut porro ipsa iure corrupti voluptates ab sunt debitis hic repellendus at, reprehenderit totam possimus consequatur commodi nam?
      </Typography>
    </Box>
  )
}

export default Page