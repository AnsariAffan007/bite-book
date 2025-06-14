"use client";

import { AppBar, Box, Button, Divider, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { theme } from "@/themes/theme";
import Link from "next/link";
import Sidebar from "@/components/Sidebar/Sidebar";
import React, { useRef, useState } from "react";
import { getShade } from "@/styles/shader";
import RecipeCard from "@/components/Recipe/RecipeCard";
import { KeyboardArrowDownRounded, LunchDiningRounded, Menu } from "@mui/icons-material";

const Home: React.FC = () => {

  const [drawer, setDrawer] = useState(false)

  const trendingContainerRef = useRef<any>(null);

  const mockDesc = "This impressive paella is a perfect party dish and a fun meal to cook together with your guests.Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests.Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests.Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests.Add 1 cup of frozen peas along with the mussels, if you like.This impressive paella is a perfect party dish and a fun meal to cook together with your guests.Add 1 cup of frozen peas along with the mussels, if you like."
  const mockCategories = ["Desert", "Ice-cream", "Waffle"]

  return (
    <>
      <Box
        sx={{
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
          <Typography variant="h2" fontWeight={500} color="primary.contrastText">
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
      </Box>

      <Box ref={trendingContainerRef} paddingBlock="40px" marginInline="24px">
        <Box textAlign="center">
          <Typography variant="h5" color="primary" fontWeight={600}>Trending</Typography>
          <Divider sx={{ mt: 1, borderColor: theme.palette.primary.main, opacity: 0.25 }} />
        </Box>
        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}>
              <Link href={`/recipes/1/details`} style={{ textDecoration: "none" }}>
                <RecipeCard
                  recipeName={"Chicken"}
                  userName={"Affan Ansari"}
                  description={mockDesc}
                  categories={mockCategories}
                />
              </Link>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Link href={`/recipes/1/details`} style={{ textDecoration: "none" }}>
                <RecipeCard
                  recipeName={"Chicken"}
                  userName={"Affan Ansari"}
                  description={mockDesc}
                  categories={mockCategories}
                />
              </Link>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Link href={`/recipes/1/details`} style={{ textDecoration: "none" }}>
                <RecipeCard
                  recipeName={"Chicken"}
                  userName={"Affan Ansari"}
                  description={mockDesc}
                  categories={mockCategories}
                />
              </Link>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Link href={`/recipes/1/details`} style={{ textDecoration: "none" }}>
                <RecipeCard
                  recipeName={"Chicken"}
                  userName={"Affan Ansari"}
                  description={mockDesc}
                  categories={mockCategories}
                />
              </Link>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default Home;