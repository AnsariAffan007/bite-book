"use client";

import { Box, Grid } from '@mui/material';
import React from 'react'
import RecipeCard from '@/components/Recipe/RecipeCard';
import Link from 'next/link';

const RecipeListing = ({ recipes }: any) => {

  return (
    <>
      <Box sx={{ mt: 3, px: 3 }}>
        <Grid container spacing={2}>
          {recipes.map((recipe: any, index: number) => (
            <Grid key={index} item xs={6} sm={4}>
              <Link
                href={`/recipes/${recipe.id}/details`}
                style={{ textDecoration: "none" }}
              // onClick={() => setState(recipe.id)}
              >
                <RecipeCard
                  recipeName={recipe.name}
                  userName={recipe.userName}
                  description={recipe.description}
                  categories={recipe.categories}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}

export default RecipeListing