import RecipeInput from '@/views/RecipeInput'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <RecipeInput />
    </Suspense>
  )
}

export default page