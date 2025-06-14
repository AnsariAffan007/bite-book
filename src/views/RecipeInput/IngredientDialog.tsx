import { INGREDIENT_TYPES, INGREDIENT_UNITS } from '@/data/RecipeFields'
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Grid, InputLabel, OutlinedInput, Stack, Switch, TextField, Typography } from '@mui/material'
import { Formik, FormikProps } from 'formik'
import React, { useMemo, useRef } from 'react'
import { ingredientSchema } from './validation'

const errorColor = '#D2665A'

interface IngredientDialog {
  open: boolean,
  handleClose: () => void,
  handleSubmit: (values: any, index?: number) => void,
  ingredient?: any,
  loading?: boolean
}

const IngredientDialog: React.FC<IngredientDialog> = ({ open, handleClose, handleSubmit, ingredient, loading = false }) => {

  const initialValues = useMemo(() => {
    return {
      id: ingredient?.id || null,
      name: ingredient?.name || '',
      type: ingredient?.type || null,
      quantity: ingredient?.quantity || '',
      unit: ingredient?.unit || null,
      optional: ingredient?.optional || false,
    }
  }, [ingredient])

  const formikRef = useRef<FormikProps<any> | null>(null)

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>
            Ingredient
          </Typography>
          <Switch
            value={formikRef.current?.values.optional}
            onChange={(_, checked) => formikRef.current?.setFieldValue('optional', checked)}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => handleSubmit(values, ingredient?.index)}
          validationSchema={ingredientSchema}
          innerRef={formikRef}
        >
          {(formik) => {
            return (
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>

                  <Grid item xs={8}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: formik.errors?.name && errorColor }}>
                        {formik.errors?.name as string || 'Name'}
                      </InputLabel>
                      <OutlinedInput
                        name='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        size='small'
                        placeholder='Enter Ingredient Name'
                        error={Boolean(formik.errors.name)}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: formik.errors?.type && errorColor }}>
                        {formik.errors?.type as string || 'Type'}
                      </InputLabel>
                      <Autocomplete
                        options={INGREDIENT_TYPES}
                        renderInput={(params) => (
                          <TextField {...params} placeholder='Select Type' size='small' error={Boolean(formik.errors?.type)} />
                        )}
                        value={formik.values.type}
                        onChange={(_, val) => formik.setFieldValue(`type`, val)}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option === value}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: formik.errors?.quantity && errorColor }}>
                        {formik.errors?.quantity as string || 'Quantity'}
                      </InputLabel>
                      <OutlinedInput
                        name={`quantity`}
                        value={formik.values?.quantity}
                        onChange={formik.handleChange}
                        size='small'
                        type='number'
                        inputProps={{
                          step: 0.01,
                          max: 20
                        }}
                        placeholder='Enter Ingredient Quantity'
                        error={Boolean(formik.errors?.quantity)}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1}>
                      <InputLabel sx={{ color: formik.errors?.unit && errorColor }}>
                        {formik.errors?.unit as string || 'Unit'}
                      </InputLabel>
                      <Autocomplete
                        options={INGREDIENT_UNITS}
                        renderInput={(params) => (
                          <TextField {...params} placeholder='Quantity Unit' size='small' error={Boolean(formik.errors?.unit)} />
                        )}
                        value={formik.values.unit}
                        onChange={(_, val) => formik.setFieldValue(`unit`, val)}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option === value}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', columnGap: 2 }}>
                      <Button
                        disableElevation
                        variant='outlined'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        disableElevation
                        variant='contained'
                        type='submit'
                        disabled={loading}
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>

                </Grid>
              </form>
            )
          }}
        </Formik>
      </DialogContent>

    </Dialog>
  )
}

export default IngredientDialog