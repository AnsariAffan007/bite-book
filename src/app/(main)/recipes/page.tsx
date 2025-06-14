import RecipeCard from '@/components/Recipe/RecipeCard';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

const getRecipes = async () => {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    const res = axios.get(`${baseUrl}/api/recipes/public`)
    return res;
  }
  catch (e) {
    return null;
  }
}

const RecipesPage = async () => {

  const recipes = await getRecipes();

  return (
    <Suspense>
      <Box sx={{ mt: 3, px: 3 }}>
        <Grid container spacing={2}>
          {recipes?.data?.data?.map((recipe: any, index: number) => (
            <Grid key={index} item xs={6} sm={4}>
              <Link
                href={`/recipes/${recipe.id}/details`}
                style={{ textDecoration: "none" }}
              >
                <RecipeCard
                  recipeName={recipe.name}
                  userName={recipe.userName}
                  description={recipe.description}
                  categoryName={recipe.categoryName}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Suspense>
  )
}

export default RecipesPage