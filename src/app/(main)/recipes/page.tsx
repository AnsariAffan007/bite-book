import NoRecipe from '@/components/NoRecipe';
import RecipeCard from '@/components/Recipe/RecipeCard';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic'

const getRecipes = async () => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = await axios.get(`${baseUrl}/api/recipes/public`)
    return { success: true, error: null, response: res, message: res?.data?.message };
  }
  catch (e) {
    return { success: false, error: e, response: null, message: e?.response?.data?.message };
  }
}

const RecipesPage = async () => {

  const { success, message, response } = await getRecipes();

  return (
    <Suspense>
      <Box sx={{ mt: 3, px: 3 }}>
        {success && response?.data?.data?.length > 0 ? (
          <Grid container spacing={2}>
            {response?.data?.data?.map((recipe: any, index: number) => (
              <Grid key={index} item xs={6} sm={4}>
                <Link
                  href={`/recipes/${recipe.id}/details`}
                  style={{ textDecoration: "none" }}
                >
                  <RecipeCard
                    image={recipe.image}
                    recipeName={recipe.name}
                    userName={recipe.userName}
                    description={recipe.description}
                    categoryName={recipe.categoryName}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <NoRecipe
            message={message}
          />
        )}
      </Box>
    </Suspense>
  )
}

export default RecipesPage