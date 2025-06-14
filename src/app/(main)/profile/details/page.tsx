"use client";

import { getShade } from '@/styles/shader';
import { Add } from '@mui/icons-material';
import { Box, Button, Grid, InputLabel, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'

const Profile = () => {

  const router = useRouter();
  const [userDetails, setUserDetails] = useState<any>({});
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/user/details');
        setUserDetails(res.data)
      }
      catch (e) {
        console.log("error fetching user data: ", e);
        enqueueSnackbar(e.response?.data?.message || 'Could not fetch your data', { variant: 'error' })
        if (e.response?.status === 401) router.push('/login')
      }
    }
    fetchData()
  }, [])

  return (
    <Box sx={{ px: 3, py: 2, backgroundColor: getShade(255, 0.2) }}>

      <Grid container spacing={1}>

        <Grid item xs={12} md={6}>
          <Stack spacing={1} py={1}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Username</InputLabel>
            <Typography variant='subtitle2'>{userDetails?.username}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1} py={1}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Email</InputLabel>
            <Typography variant='subtitle2'>{userDetails?.email}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1} py={1}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Recipes Added</InputLabel>
            <Typography variant='h5'>{userDetails?.recipeCount}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={1} py={1}>
            <InputLabel sx={{ fontSize: '0.9rem' }}>Categories Added</InputLabel>
            <Typography variant='h5'>{userDetails?.categoryCount}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            color='primary'
            variant='outlined'
            disableRipple
            sx={{
              borderRadius: '20px',
              width: '100%',
              bgcolor: getShade(255, 0.2),
              '&:hover': {
                bgcolor: getShade(255, 0.4),
              },
            }}
            disableElevation
            startIcon={<Add />}
          >
            Add a Recipe
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            color='primary'
            variant='outlined'
            disableRipple
            sx={{
              borderRadius: '20px',
              width: '100%',
              bgcolor: getShade(255, 0.2),
              '&:hover': {
                bgcolor: getShade(255, 0.4),
              },
            }}
            disableElevation
            startIcon={<Add />}
          >
            Add a Category
          </Button>
        </Grid>
      </Grid>

    </Box>
  )
}

export default Profile