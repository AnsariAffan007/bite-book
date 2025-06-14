"use client";

import Table, { HeaderCell } from '@/components/Table'
import { getShade } from '@/styles/shader'
import { Add, EditOutlined, Search } from '@mui/icons-material'
import { Box, Button, InputAdornment, OutlinedInput, Stack } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ActionCell from '@/components/Table/ActionCell';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export interface Recipe {
  id: number
  name: string,
  categoryId: string,
  mealTime: string[],
  prepTime: string,
  difficulty: string,
  idealServings: string,
  class: string,
  stepsExist: boolean,
}

const ProfileRecipes = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [recipes, setRecipes] = useState<any>([])
  // #region FETCHER
  // <-------------------- FETCHING RECIPES ----------------------->
  const fetchRecipes = useCallback(async (
    search: string
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/recipes?search=${search}`);
      setRecipes(res?.data?.data)
    }
    catch (e) {
      enqueueSnackbar(
        e?.respones?.data?.message || "Could not fetch recipes. Please contact admin",
        { variant: 'success' }
      )
      console.log("Error fetcing recipes: ", e)
    }
    setLoading(false);
  }, [])
  useEffect(() => {
    fetchRecipes('')
  }, [fetchRecipes])

  // #region CATEGORIES
  const [categories, setCategories] = useState<any>([]);
  // <-------------------- FETCHING CATEGORIES ----------------------->
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('/api/categories?get=all');
        setCategories(res?.data?.data || [])
      }
      catch (e) {
        console.log("Error fetching categories: ", e)
      }
    }
    fetchCategories()
  }, [])

  const handleAddClick = () => {
    router.push('/profile/recipes/create')
  }
  const handleEditClick = (recipeId: number) => {
    router.push(`/profile/recipes/${recipeId}`)
  }

  const handleDelete = useCallback(async (rowId: number) => {
    setLoading(true)
    try {
      await axios.delete(`/api/recipes/${rowId}`, {});
      enqueueSnackbar('Recipe deleted successfully', { variant: 'success' })
      return fetchRecipes('')
    }
    catch (e) {
      console.log("Error deleting recipe: ", e);
      enqueueSnackbar(e?.response?.data?.message || 'Error deleting Recipe', { variant: 'error' })
    }
    setLoading(false)
  }, [])

  // #region JSX Start
  return (
    <Box sx={{ backgroundColor: getShade(255, 0.2) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={{ xs: 1, md: 3 }}>
        <OutlinedInput
          size='small'
          placeholder='Search by Name'
          inputProps={{ type: 'search' }}
          startAdornment={
            <InputAdornment position='start'>
              <Search sx={{ fontSize: '1rem' }} />
            </InputAdornment>
          }
        // sx={{
        //   '& input::-webkit-search-cancel-button': {
        //     '-webkit-appearance': 'none',
        //     backgroundImage: 'url("/images/cancel-button.png")',
        //     backgroundSize: 'cover'
        //   }
        // }}
        />
        <Button
          variant='contained'
          color='primary'
          size='small'
          startIcon={<Add />}
          disableElevation
          disableRipple
          onClick={handleAddClick}
        >
          Add
        </Button>
      </Stack>

      <Table
        columns={[
          {
            accessor: "name",
            header: "Name",
            cell: (row: Recipe) => <>{row.name}</>
          },
          {
            accessor: "category",
            header: "Category",
            cell: (row: Recipe) => <>{categories.find((c: any) => c.id === row.categoryId)?.name}</>
          },
          {
            accessor: "mealTime",
            header: "Meal Time",
            cell: (row: Recipe) => <>{row.mealTime.join(', ')}</>
          },
          {
            accessor: "prepTime",
            header: "Prep Time",
            cell: (row: Recipe) => <>{`${row.prepTime} Hour(s)`}</>
          },
          {
            accessor: "difficultyLevel",
            header: "Difficulty Level",
            cell: (row: Recipe) => <>{row.difficulty}</>
          },
          {
            accessor: "idealServings",
            header: "Ideal Servings",
            cell: (row: Recipe) => <>{row.idealServings}</>
          },
          {
            accessor: "class",
            header: "Class",
            cell: (row: Recipe) => <>{row.class}</>
          },
          {
            accessor: "steps",
            header: () => <HeaderCell text='Steps' sx={{ textAlign: 'center' }} />,
            cell: (row: Recipe) => (
              <Box display="flex" justifyContent="center">
                <Button
                  variant='outlined'
                  size='small'
                  disableElevation
                  disableRipple
                  startIcon={row.stepsExist ? <EditOutlined /> : <Add />}
                  onClick={() => router.push(`/profile/recipes/${row.id}/steps/`)}
                >
                  {row.stepsExist ? "Edit" : "Add"}
                </Button>
              </Box>
            )
          },
          {
            accessor: "actions",
            header: () => <HeaderCell text='Actions' sx={{ textAlign: 'center' }} />,
            cell: (row: Recipe) => (
              <ActionCell
                editState={false}
                onEditHandler={() => handleEditClick(row.id)}
                onDeleteHandler={() => handleDelete(row.id)}
                loading={loading}
              />
            ),
            thProps: { sx: { width: '150px' } }
          },
        ]}
        data={recipes}
      />
    </Box>
  )
}

export default ProfileRecipes