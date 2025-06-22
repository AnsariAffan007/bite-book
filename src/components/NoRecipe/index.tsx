import React from 'react'

interface NoRecipeInterface {
  message?: string
}

const NoRecipe: React.FC<NoRecipeInterface> = ({ message }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '120px' }}>
      <img
        src="/images/no-recipe.png"
        alt=""
        width={'280px'}

      />
      <p>{message || "Recipes are cooking"}</p>
    </div>
  )
}

export default NoRecipe