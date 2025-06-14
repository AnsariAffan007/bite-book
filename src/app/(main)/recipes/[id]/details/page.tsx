import { Box, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { headers } from 'next/headers'
import React from 'react'

const getRecipeDetails = async (recipeId: any) => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = axios.get(`${baseUrl}/api/recipes/${recipeId}`)
    return res;
  }
  catch (e) {
    return null;
  }
}

const Page = async ({ params }: any) => {

  const details = await getRecipeDetails(params.id)
  const recipe = details?.data?.data

  return (
    <Box my={4}>
      <Stack spacing={1} mb={3}>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Meal Time</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Box>
            <Typography fontSize="0.9rem">
              {recipe?.recipes?.mealTime?.map((m: string) => `${m}`)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Preparation Time</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">{recipe?.recipes?.prepTime} Hours</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Difficulty</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">{recipe?.recipes?.difficulty}</Typography>
        </Box>
        <Box display="flex" alignItems="center" columnGap={2}>
          <Typography fontSize="0.9rem" sx={{ flexBasis: '10%' }} color="#666">Ideal Servings</Typography>
          <Typography fontSize="0.9rem" color="#666">-</Typography>
          <Typography fontSize="0.9rem">{recipe?.recipes?.idealServings} Adults</Typography>
        </Box>
      </Stack>
      <Typography color="#666">
        {recipe?.recipes?.description}
      </Typography>
    </Box>
  )
}

export default Page