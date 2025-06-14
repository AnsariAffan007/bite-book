"use client";

import { getShade } from '@/styles/shader';
import { Box, SxProps, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react'

const primaryColor = 'FF7D29';

const activeLinkStyle: SxProps = {
  color: primaryColor,
  borderBottom: `3px solid #${primaryColor}`,
  paddingBottom: '2px',
}

const linkStyle: SxProps = {
  color: getShade(0, 0.8),
  paddingBottom: '2px'
}

const TABS = {
  DETAILS: 1,
  INGREDIENTS: 2,
  STEPS: 3,
}

const RecipeDetailTabs = ({ recipeId }: any) => {

  const pathname = usePathname()
  const activeTab = useMemo(() => {
    if (pathname?.includes('details')) return TABS.DETAILS
    else if (pathname?.includes('ingredients')) return TABS.INGREDIENTS
    else if (pathname?.includes('steps')) return TABS.STEPS
  }, [pathname])

  return (
    <Box
      sx={{ p: 2, pb: 0, display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
      columnGap={2}
    >
      <Link href={`/recipes/${recipeId}/details/`}>
        <Box sx={activeTab === TABS.DETAILS ? activeLinkStyle : linkStyle}>
          <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Details</Typography>
        </Box>
      </Link>
      <Link href={`/recipes/${recipeId}/ingredients/`}>
        <Box sx={activeTab === TABS.INGREDIENTS ? activeLinkStyle : linkStyle}>
          <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Ingredients</Typography>
        </Box>
      </Link>
      <Link href={`/recipes/${recipeId}/steps/`}>
        <Box sx={activeTab === TABS.STEPS ? activeLinkStyle : linkStyle}>
          <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Steps</Typography>
        </Box>
      </Link>
    </Box>
  )
}

export default RecipeDetailTabs