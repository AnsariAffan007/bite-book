import { Box, Grid } from '@mui/material'
import React from 'react'

const Page = () => {
  return (
    <Box my={4}>
      <Grid container spacing={1}>
        <Grid item xs={6} sm={4} md={3}>
          {/* <IngredientCard  /> */}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Page