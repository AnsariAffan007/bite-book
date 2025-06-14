"use client";

import { getShade } from '@/styles/shader'
import { theme } from '@/themes/theme'
import { Box, SxProps, Typography } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

const primaryColor = theme.palette.primary.main

const activeLinkStyle: SxProps = {
  color: primaryColor,
  borderBottom: `2px solid ${primaryColor}`,
}

const linkStyle: SxProps = {
  color: getShade(0, 0.8),
}

const TABS = {
  DETAILS: 1,
  RECIPES: 2,
  CATEGORIES: 3,
}

const ProfileLayout = ({ children }: any) => {

  const pathname = usePathname()
  const activeTab = useMemo(() => {
    if (pathname === '/profile/details/') return TABS.DETAILS
    else if (pathname.includes('/recipes')) return TABS.RECIPES
    else if (pathname.includes('/categories')) return TABS.CATEGORIES
  }, [pathname])

  return (
    <>
      <Box
        sx={{
          mt: 3,
          mb: 2,
          mx: 3,
          borderBottom: '1px solid #d6d6d6',
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          columnGap: 2,
        }}
      >
        <Link href="/profile/details/">
          <Box sx={activeTab === TABS.DETAILS ? activeLinkStyle : linkStyle}>
            <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Details</Typography>
          </Box>
        </Link>
        <Link href="/profile/recipes/">
          <Box sx={activeTab === TABS.RECIPES ? activeLinkStyle : linkStyle}>
            <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Recipes</Typography>
          </Box>
        </Link>
        <Link href="/profile/categories/">
          <Box sx={activeTab === TABS.CATEGORIES ? activeLinkStyle : linkStyle}>
            <Typography variant='subtitle1' fontSize={{ xs: '0.85rem', md: '1rem' }}>Categories</Typography>
          </Box>
        </Link>
      </Box>
      {children}
    </>
  )
}

export default ProfileLayout