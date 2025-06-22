import React from 'react'

interface NoRecipeInterface {
  message?: string
}

const NoRecipe: React.FC<NoRecipeInterface> = ({ message }) => {
  return (
    <div style={{ textAlign: 'center', paddingBlock: '120px' }}>
      <img
        src="/images/no-recipe.png"
        alt=""
        width={'280px'}

      />
      <p>{message || "No Data Found"}</p>
    </div>
  )
}

export default NoRecipe