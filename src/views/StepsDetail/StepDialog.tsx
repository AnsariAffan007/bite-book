import FormikInput from '@/components/FormikInput'
import NodeType from '@/components/StepNode/types';
import { Add, DeleteOutline } from '@mui/icons-material';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import { FieldArray, FieldArrayRenderProps, Formik, FormikProps } from 'formik'
import React, { useMemo } from 'react'

const EMPTY_INGREDIENT = {
  name: '',
  optional: false,
  quantity: '',
  unit: null
}

interface StepDialogProps {
  open: boolean;
  step: any;
  recipeIngredients: any;
  handleClose: () => void;
  handleConfirm: (values: any, action: string, stepId: string) => void;
  nodes: NodeType[]
}

const StepDialog: React.FC<StepDialogProps> = ({ open, step, nodes, recipeIngredients, handleClose, handleConfirm }) => {

  const handleSubmit = (values: any) => {
    const action = step === null ? "ADD" : "EDIT"
    handleConfirm(
      values,
      action,
      step?.id
    )
  }

  const initialValues = useMemo(() => ({
    name: step?.data?.name || '',
    description: step?.data?.description || '',
    connection: nodes.find(n => n.id === step?.data?.connection) || null,
    ingredients: step?.data?.ingredients?.length > 0
      ? step?.data?.ingredients?.map((i: any) => ({
        name: recipeIngredients?.find((ogIngredient: any) => ogIngredient.name === i.name) || null,
        quantity: i.quantity
      }))
      : [{ name: null, quantity: '' }]
  }), [step, recipeIngredients]);

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik: FormikProps<any>) => (
        <form onSubmit={formik.handleSubmit}>
          <Dialog
            open={open}
            onClose={handleClose}
            disablePortal
            sx={{
              '& .MuiPaper-root': {
                maxWidth: 'none',
                width: { xs: '280px', sm: '600px', md: '800px' }
              }
            }}
          >
            <DialogTitle>{true ? "Add" : "Edit"}</DialogTitle>

            <DialogContent>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <FormikInput
                    inputName='name'
                    formikInstance={formik}
                    inputLabel='Name'
                    placeholder='Step name'
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormikInput
                    formikInstance={formik}
                    inputLabel='Description'
                    inputName='description'
                    placeholder='Step description'
                    outlinedInputProps={{
                      multiline: true,
                      minRows: 2,
                      maxRows: 3
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Connect To</InputLabel>
                    <Autocomplete
                      options={step ? nodes.filter(n => n.id !== step?.id) : nodes}
                      renderInput={(params) => <TextField {...params} placeholder='Name' size='small' />}
                      value={formik.values.connection}
                      onChange={(_, val) => formik.setFieldValue(`connection`, val)}
                      getOptionLabel={(option) => option.data?.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                  </Stack>
                </Grid>


                <Grid item xs={12}>
                  <Box my={2} p={2} bgcolor="#dfdfdf">
                    <Typography color="#444" fontWeight="bold" fontSize="1.1rem">Ingredients</Typography>
                  </Box>
                  <FieldArray name="ingredients">
                    {(arrayHelpers: FieldArrayRenderProps) => (
                      <Box>
                        {formik.values.ingredients?.map((ingredient: any, index: number) => (
                          <Grid key={index} container spacing={{ xs: 1, md: 2 }} mb={3}>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel>
                                  Name
                                </InputLabel>
                                <Autocomplete
                                  options={recipeIngredients}
                                  renderInput={(params) => <TextField {...params} placeholder='Name' size='small' />}
                                  value={ingredient.name || null}
                                  onChange={(_, val) => formik.setFieldValue(`ingredients.${index}.name`, val)}
                                  getOptionLabel={(option) => `${option?.name} (${option?.unit})`}
                                  isOptionEqualToValue={(option, value) => option.name === value.name}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={7} md={4}>
                              <Stack spacing={1}>
                                <InputLabel>
                                  Quantity
                                </InputLabel>
                                <OutlinedInput
                                  name={`ingredients.${index}.quantity`}
                                  value={ingredient?.quantity}
                                  onChange={formik.handleChange}
                                  placeholder='Quantity'
                                  size='small'
                                  type='number'
                                  inputProps={{
                                    step: 0.01,
                                    max: 20,
                                    min: 0
                                  }}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={5} md={2} sx={{ display: 'flex', alignItems: 'end' }}>
                              <Stack direction="row" columnGap={1} width='100%'>
                                <Button
                                  sx={{ minWidth: 'auto', width: '50%', minHeight: '40px', color: '#999' }}
                                  variant='outlined'
                                  color='inherit'
                                  size='small'
                                  onClick={() => formik.values.ingredients.length !== 1 && arrayHelpers.remove(index)}
                                >
                                  <DeleteOutline />
                                </Button>
                                {index === formik.values.ingredients.length - 1 && (
                                  <Button
                                    sx={{ minWidth: 'auto', width: '50%', minHeight: '40px', }}
                                    variant='outlined'
                                    color='primary'
                                    size='small'
                                    onClick={() => arrayHelpers.push(EMPTY_INGREDIENT)}
                                  >
                                    <Add />
                                  </Button>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button size='small' variant='outlined' disableElevation onClick={handleClose}>Cancel</Button>
              <Button size='small' variant='contained' disableElevation type='submit'>Save</Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  )
}

export default StepDialog