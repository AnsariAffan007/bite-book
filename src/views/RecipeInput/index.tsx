"use client";

import FormikInput from '@/components/FormikInput';
import { DIFFICULTY_LEVELS, MEAL_TIMES } from '@/data/RecipeFields';
import { getShade } from '@/styles/shader';
import { AddOutlined, UploadOutlined } from '@mui/icons-material';
import { Autocomplete, Box, Button, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import validationSchema from './validation';
import { enqueueSnackbar } from 'notistack';
import { usePathname, useRouter } from 'next/navigation';
import IngredientCard from '@/components/Recipe/IngredientCard';
import IngredientDialog from './IngredientDialog';

const errorColor = '#D2665A'

const RecipeInput = () => {

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // #region CATEGORIES
  const [categories, setCategories] = useState([]);
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

  const [initialValues, setInitialValues] = useState({
    name: "",
    category: null,
    description: "",
    preptime: '',
    difficulty: null,
    mealtime: null,
    servings: ''
  })

  // #region Fetching
  const pathname = usePathname();
  const recipeId = useMemo(() => {
    const pathArray = pathname.split('/');
    const recipesPathIndex = pathArray.indexOf('recipes');
    return pathArray[recipesPathIndex + 1]
  }, [pathname])

  async function fetchRecipe() {
    setLoading(true)
    try {
      const res = await axios.get(`/api/recipes/${recipeId}`);
      if (res?.data?.data) {
        setInitialValues({
          name: res?.data?.data?.name,
          category: categories?.find((c: any) => c.id === res?.data?.data?.categoryId) || null,
          description: res?.data?.data?.description || '',
          preptime: res?.data?.data?.prepTime || '',
          difficulty: res?.data?.data?.difficulty || null,
          mealtime: res?.data?.data?.mealTime || [],
          servings: res?.data?.data?.idealServings || ''
        })
        setIngredients(res?.data?.data?.ingredients || [])
      }
    }
    catch (e) {
      console.log("Error fetching recipe!")
    }
    setLoading(false)
  }
  useEffect(() => {
    if (recipeId === 'create') return;
    fetchRecipe()
  }, [recipeId, categories])

  // #region Submission
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const res = recipeId === 'create'
        ? await axios.post(
          '/api/recipes',
          { ...values, category: values.category.id, ingredients: ingredients }
        )
        : await axios.put(
          `/api/recipes/${recipeId}`,
          { ...values, category: values.category.id }
        )
      enqueueSnackbar(
        res?.data?.message || "Recipe successfully created",
        { variant: 'success' }
      )
    }
    catch (e) {
      console.log("Error submitting recipe: ", e)
      enqueueSnackbar(
        e?.response?.data?.message || "Something went wrong. Please contact admin",
        { variant: 'error' }
      )
    }
    setLoading(false)
  }

  const handleCancelClick = useCallback(() => {
    router.back();
  }, [])

  // #region Ing ADD
  const [ingredientDialog, setIngredientDialog] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredients, setIngredients] = useState<any[]>([])

  const addIngredient = useCallback(async (ingredient: any, ingredients: any[], index?: number) => {
    if (index === undefined && ingredients.find((i: any) => i.name === ingredient.name)) {
      enqueueSnackbar('Ingredient already added with this name!', { variant: 'error' })
      return;
    }

    if (recipeId !== 'create') {
      setLoading(true)
      try {
        const res = index !== undefined && ingredient.id
          ? await axios.put(`/api/recipes/${recipeId}/ingredient/${ingredient.id}`, { ...ingredient, recipeId: recipeId })
          : await axios.post(`/api/recipes/${recipeId}/ingredient`, { ...ingredient, recipeId: recipeId });
        enqueueSnackbar(res?.data?.message || 'Ingredient updated successfully', { variant: 'success' })
        fetchRecipe()
      }
      catch (e) {
        console.log("Error updating ingredient: ", e);
        enqueueSnackbar(
          e?.response?.data?.message || "Something went wrong. Please contact admin",
          { variant: 'error' }
        )
      }
      setLoading(false)
    }
    else {
      if (index !== undefined) {
        setIngredients(prev => prev.map((ing, ind) => ind === index ? { ...ingredient } : { ...ing }))
      }
      else {
        setIngredients(prev => [...prev, { ...ingredient }])
      }
    }
    setSelectedIngredient(null)
    setIngredientDialog(false)
  }, [recipeId])

  // #region Ing Delete
  const deleteIngredient = useCallback(async (ingredientId: number, ingredientName: string) => {
    if (recipeId !== 'create') {
      setLoading(true)
      try {
        const res = await axios.delete(`/api/recipes/${recipeId}/ingredient/${ingredientId}`, {});
        enqueueSnackbar(res?.data?.message || 'Ingredient deleted successfully', { variant: 'success' })
        return fetchRecipe()
      }
      catch (e) {
        console.log("Error deleting ingredient: ", e);
        enqueueSnackbar(
          e?.response?.data?.message || "Something went wrong. Please contact admin",
          { variant: 'error' }
        )
      }
      setLoading(false)
    }
    else {
      setIngredients(prev => prev.filter(p => p.name !== ingredientName))
    }
  }, [recipeId])

  // #region JSX Start
  return (
    <Box sx={{ backgroundColor: getShade(255, 0.2), pb: 16 }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        enableReinitialize
      >
        {(formik: FormikProps<any>) => (
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ px: 3, py: 2 }}>
              <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize="1.2rem" color="#444">
                  Creating new Recipe
                </Typography>
                <Box display="flex" alignItems="center" columnGap={2}>
                  <Button disableElevation size='medium' variant='outlined' onClick={handleCancelClick}>Cancel</Button>
                  <Button disableElevation size='medium' variant='contained' type='submit' disabled={loading}>Submit</Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1} height="100%">
                    <InputLabel>Recipe Image</InputLabel>
                    <Button
                      color='inherit'
                      sx={{ flex: 1, width: '100%', borderColor: '#aaa' }}
                      variant='outlined'
                      disableElevation
                      disableRipple
                      startIcon={<UploadOutlined />}
                    >
                      Upload image
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={4}>
                    <FormikInput
                      formikInstance={formik}
                      inputLabel='Name'
                      inputName='name'
                      placeholder='Recipe Name'
                    />
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: formik.errors?.category && errorColor }}>
                        {formik.errors?.category as string || "Category"}
                      </InputLabel>
                      <Autocomplete
                        value={formik.values['category'] || null}
                        onChange={(_, val) => formik.setFieldValue('category', val)}
                        options={categories}
                        renderInput={(params) => <TextField {...params} placeholder='Select a Category' size='small' error={Boolean(formik.errors?.category)} />}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container rowSpacing={2} columnSpacing={3} mt={2}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ color: formik.errors?.description && errorColor }}>
                      {formik.errors?.description as string || "Description"}
                    </InputLabel>
                    <OutlinedInput
                      value={formik.values['description']}
                      onChange={formik.handleChange}
                      name='description'
                      error={Boolean(formik.errors?.['description'])}
                      size='small'
                      placeholder='Enter recipe description'
                      multiline
                      maxRows={4}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormikInput
                    formikInstance={formik}
                    inputName='preptime'
                    inputLabel='Preparation Time'
                    placeholder='Enter preparation time (Hours)'
                    type='number'
                    outlinedInputProps={{
                      inputProps: {
                        step: '0.01',
                        max: 10,
                        min: 0
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ color: formik.errors?.difficulty && errorColor }}>
                      {formik.errors?.difficulty as string || "Difficulty"}
                    </InputLabel>
                    <Autocomplete
                      options={DIFFICULTY_LEVELS}
                      renderInput={(params) => <TextField {...params} placeholder='Select difficulty' size='small' error={Boolean(formik.errors?.difficulty)} />}
                      value={formik.values['difficulty'] || null}
                      onChange={(_, val) => formik.setFieldValue('difficulty', val)}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <InputLabel sx={{ color: formik.errors?.mealtime && errorColor }}>
                      {formik.errors?.mealtime as string || "Meal Time"}
                    </InputLabel>
                    <Autocomplete
                      multiple
                      options={MEAL_TIMES}
                      renderInput={(params) => <TextField {...params} placeholder='Select meal times' size='small' error={Boolean(formik.errors?.mealtime)} />}
                      sx={{
                        '& .MuiButtonBase-root.MuiChip-root': {
                          height: 'auto'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '18pxF'
                        }
                      }}
                      value={formik.values.mealtime || []}
                      onChange={(_, v) => formik.setFieldValue('mealtime', v)}
                      isOptionEqualToValue={(option, value) => option === value}
                      getOptionLabel={(option) => option}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormikInput
                    formikInstance={formik}
                    inputLabel='Ideal Servings'
                    inputName='servings'
                    placeholder='Enter number of servings'
                    type='number'
                    outlinedInputProps={{
                      inputProps: {
                        max: 20,
                        min: 0
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {recipeId !== 'create' && (
              <Box
                sx={{
                  mr: 3,
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  columnGap: 2
                }}
              >
                <Button disableElevation size='large' variant='outlined' onClick={handleCancelClick}>Cancel</Button>
                <Button disableElevation size='large' variant='contained' type='submit' disabled={loading}>Submit</Button>
              </Box>
            )}

            <Box sx={{ my: 3, px: 3, py: 1, backgroundColor: "#dfdfdf" }}>
              <Typography>Ingredients</Typography>
            </Box>

            <Box sx={{ mx: 3 }}>
              <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {ingredients.map((ingredient, i) => (
                  <Grid key={i} item xs={2}>
                    <IngredientCard
                      name={ingredient.name}
                      type={ingredient.type}
                      quantity={ingredient.quantity}
                      unit={ingredient.unit}
                      optional={ingredient.optional}
                      onClick={(ing: any) => {
                        setSelectedIngredient({ ...ing, id: ingredient.id, index: i })
                        setIngredientDialog(true)
                      }}
                      handleDelete={() => {
                        deleteIngredient(ingredient?.id, ingredient?.name)
                      }}
                      loading={loading}
                    />
                  </Grid>
                ))}
                <Grid item xs={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      '&:hover': { backgroundColor: getShade(0, 0.025) },
                      height: '100%',
                      border: `1px solid #dadada`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      minHeight: '80px'
                    }}
                    onClick={() => setIngredientDialog(true)}
                  >
                    <AddOutlined />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {recipeId === 'create' && (
              <Box
                sx={{
                  mr: 3,
                  mt: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  columnGap: 2
                }}
              >
                <Button disableElevation size='large' variant='outlined' onClick={handleCancelClick}>Cancel</Button>
                <Button disableElevation size='large' variant='contained' type='submit' disabled={loading}>Submit</Button>
              </Box>
            )}

            <IngredientDialog
              open={ingredientDialog}
              handleClose={() => {
                setIngredientDialog(false)
                setSelectedIngredient(null)
              }}
              handleSubmit={(values, index) => addIngredient(values, ingredients, index)}
              ingredient={selectedIngredient}
              loading={loading}
            />
          </form>
        )}


      </Formik>
    </Box >
  )
}

export default RecipeInput