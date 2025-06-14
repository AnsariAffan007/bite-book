import { getShade } from '@/styles/shader';
import RecipeDetailTabs from '@/views/Public/Recipe/Tabs';
import { AccessTimeOutlined, EmojiEventsOutlined, Person2Outlined } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material'
import axios from 'axios';
import { headers } from 'next/headers';
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

const primaryColor = 'FF7D29';

const Layout = async ({ children, params }: any) => {

  const details = await getRecipeDetails(params.id)
  const recipe = details?.data?.data

  return (
    <Box
      sx={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px', mt: 3, px: 3 }}
    >
      <Box position="relative" height={350} display="flex" alignItems="center">
        <img
          src='/images/food/sandwich.png'
          width='100%'
          height='100%'
          style={{
            objectFit: 'cover',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            position: 'absolute'
          }}
        />
        <Box pl={2} pt={3} pb={4} position="relative" bgcolor={getShade(0, 0.5)} width={400} sx={{ borderTopRightRadius: '20px', borderLeft: `5px solid #${primaryColor}` }}>
          <Box px={2} bgcolor="white" border={`2px solid #${primaryColor}`} borderRadius="20px" width="fit-content">
            <Typography fontSize="0.8rem">
              {recipe?.recipes?.categories?.name}
            </Typography>
          </Box>
          <Stack my={1}>
            <Typography fontSize="1.8rem" color="#fff">Sandwich</Typography>
            <Typography fontSize="0.95rem" color="#ddd">By {recipe?.users?.username}</Typography>
          </Stack>
          <Box display="flex" alignItems="center" columnGap={2}>
            <Box display="flex" alignItems="center" columnGap={0.5} color="white">
              <AccessTimeOutlined sx={{ fontSize: '1.15rem' }} />
              <Typography fontSize="0.8rem" sx={{ fontFamily: 'inherit' }}>{recipe?.recipes?.prepTime} hrs</Typography>
            </Box>
            <Box display="flex" alignItems="center" columnGap={0.5} color="white">
              <EmojiEventsOutlined sx={{ fontSize: '1.15rem' }} />
              <Typography fontSize="0.8rem" sx={{ fontFamily: 'inherit' }}>{recipe?.recipes?.difficulty}</Typography>
            </Box>
            <Box display="flex" alignItems="center" columnGap={0.5} color="white">
              <Person2Outlined sx={{ fontSize: '1.15rem' }} />
              <Typography fontSize="0.8rem" sx={{ fontFamily: 'inherit' }}>{recipe?.recipes?.idealServings}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          border: '1px solid #ccc',
          position: 'relative',
        }}
      >
        <RecipeDetailTabs recipeId={params.id} />
        {children}
      </Box>

    </Box>
  )
}

export default Layout