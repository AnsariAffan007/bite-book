import { getShade } from '@/styles/shader'
import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

const CategoryCard = ({ name, description }: any) => {
  return (
    <Card elevation={0} sx={{ backgroundColor: getShade(0, 0.03), minHeight: 200 }}>
      <CardContent>
        <Typography variant='h6' gutterBottom sx={{ color: '#FF7D29', fontWeight: 700 }}>
          {name}
        </Typography>
        <Typography>{description}</Typography>
      </CardContent>
    </Card>
  )
}

export default CategoryCard