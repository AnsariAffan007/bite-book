import { Box, Grid } from '@mui/material'
import axios from 'axios'
import React from 'react'
import Card from './Card'
import { headers } from 'next/headers'

const getIngredients = async (recipeId: any) => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = axios.get(`${baseUrl}/api/recipes/${recipeId}/ingredient`)
    return res;
  }
  catch (e) {
    return null;
  }
}

const Page = async ({ params }: any) => {

  const res = await getIngredients(params.id)

  return (
    <Box sx={{ my: 4, mx: 2 }}>
      <Grid container spacing={1}>
        {res?.data?.data?.map((ing: any, index: number) => (
          <Grid key={index} item xs={6} sm={4} md={3}>
            <Card
              name={ing.name}
              optional={ing.optional}
              quantity={ing.quantity}
              type={ing.type}
              unit={ing.unit}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Page