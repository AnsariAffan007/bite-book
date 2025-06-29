'use client';

import { AppBar, Box, Button, Divider, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { theme } from "@/themes/theme";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useRef, useState } from "react";
import { getShade } from "@/styles/shader";
import RecipeCard from "@/components/Recipe/RecipeCard";
import { KeyboardArrowDownRounded, LunchDiningRounded, Menu } from "@mui/icons-material";
import NoRecipe from "@/components/NoRecipe";

const Home: React.FC<any> = ({ success, message, response }) => {

  const [drawer, setDrawer] = useState(false)

  const trendingContainerRef = useRef<any>(null);

  return (
    <>
      <div
        style={{
          height: "100svh",
          background: `linear-gradient(${getShade(0, 0.4)}, ${getShade(0, 0.4)}), url('/images/lander.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <AppBar
          position="absolute"
          sx={{
            boxShadow: "none",
            background: "transparent",
            color: theme.palette.primary.dark,
            position: "absolute",
            top: 0,
          }}
        >
          <Toolbar sx={{ color: theme.palette.primary.contrastText }}>
            <Box flexGrow={1} display="flex" alignItems="center">
              <LunchDiningRounded sx={{ fontSize: "1.5rem" }} />
              <Typography variant="h6" component="div" fontWeight={600}>Bite</Typography>
              <Typography variant="h6" component="div" fontWeight={600}>Book</Typography>
            </Box>
            <IconButton
              size="small"
              edge="start"
              color="inherit"
              aria-label="menu"
              disableRipple
              sx={{ mr: 2, display: "flex", alignItems: "center", columnGap: 1, }}
              onClick={() => setDrawer(true)}
            >
              <Menu sx={{ py: 1 }} />
              <Typography>MENU</Typography>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Sidebar
          open={drawer}
          toggleDrawer={setDrawer}
        />
        <Box>
          <Typography variant="h2" fontWeight={500} color="primary.contrastText" sx={{ textAlign: 'center' }}>
            Explore and Share Recipes
          </Typography>
          <Box mt={4} display="flex" columnGap={2} justifyContent="center">
            <Button disableElevation variant="outlined" color="secondary">Join Community</Button>
            <Link href='/recipes'>
              <Button disableElevation variant="contained">Explore Recipes</Button>
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <IconButton
            size="large"
            sx={{
              color: theme.palette.primary.main,
              bgcolor: theme.palette.secondary.light,
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
              }
            }}
            onClick={() => trendingContainerRef.current.scrollIntoView({ behavior: 'smooth' })}
          >
            <KeyboardArrowDownRounded />
          </IconButton>
        </Box>
      </div>

      <Box ref={trendingContainerRef} paddingBlock="40px" marginInline="24px">
        <Box textAlign="center">
          <Typography variant="h4" fontWeight={500}>Trending</Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>
        <Box mt={4}>
          {success && response?.data?.length > 0 ? (
            <Grid container spacing={3}>
              {response?.data?.map((r: any, i: number) => (
                <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                  <Link href={`/recipes/${r.id}/details`} style={{ textDecoration: "none" }}>
                    <RecipeCard
                      recipeName={r.name}
                      userName={r.userName}
                      description={r.description}
                      categoryName={r.categoryName}
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
      </Box>
    </>
  );
}

export default Home;