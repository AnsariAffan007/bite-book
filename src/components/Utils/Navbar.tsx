'use client';

import { theme } from '@/themes/theme'
import { Menu } from '@mui/icons-material'
import { Box, Breadcrumbs, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import routeBreadcrumbMap from '@/data/RouteBreadcrumbsMap'

const Navbar = (props: any) => {

  const [drawer, setDrawer] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // extracting recipe id from router and recipe name from props. 
  // Will be undefined if not on recipe page.
  const query = searchParams.get('id');
  const { name } = props.recipe || {}

  const routes = pathname.split("/").filter(route => route.length !== 0)

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
          position: "relative"
        }}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ padding: "8px 24px" }}>
          <Link
            color="inherit"
            href="/"
          >
            <Typography sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>Home</Typography>
          </Link>
          {routes.map((route, index) => (
            <Link
              key={index}
              color="inherit"
              href={`/${route}`}
            >
              {index === routes.length - 1
                ?
                <Typography color="primary.main" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                  {query
                    ? name
                    : routeBreadcrumbMap[route]}
                </Typography>
                : <Typography sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>{routeBreadcrumbMap[route]}</Typography>
              }
            </Link>
          ))
          }
        </Breadcrumbs>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          aria-label="menu"
          disableRipple
          sx={{
            borderRadius: "24px 0 24px 20px",
            height: "60px",
            width: "60px",
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            position: "absolute",
            right: 0,
            top: 0
          }}
          onClick={() => setDrawer(true)}
        >
          <Menu sx={{ py: 1 }} />
        </IconButton>
      </Box>
      <Sidebar
        open={drawer}
        toggleDrawer={setDrawer}
      />
    </>
  )
}

export default Navbar