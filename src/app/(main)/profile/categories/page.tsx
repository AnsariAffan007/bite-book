"use client";

import Table from '@/components/Table'
import { getShade } from '@/styles/shader'
import { Add, Search } from '@mui/icons-material'
import { Box, Button, InputAdornment, OutlinedInput, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import ActionCell from '@/components/Table/ActionCell';
import useEditableRows from '@/hooks/useEditableRows';
import { FormikProps } from 'formik';
import * as Yup from 'yup';
import useAddState from '@/hooks/useAddState';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

export interface Category {
  id: number,
  name: string;
  description: string;
  recipesCount: number;
}

const ProfileCategories = () => {

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  // #region FETCHER
  const fetchCategories = useCallback(async (
    search: string,
  ) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/categories?search=${search}`);
      setCategories(res?.data?.data)
    }
    catch (e) {
      enqueueSnackbar(
        e?.respones?.data?.message || "Could not fetch categories. Please contact admin",
        { variant: 'success' }
      )
      console.log("Error fetcing categories: ", e)
    }
    setAddState(false)
    setLoading(false);
  }, [])
  useEffect(() => {
    fetchCategories('');
  }, [fetchCategories])

  const { editableRows, changeEditableRow } = useEditableRows()

  // #region Validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .max(15, 'Maximum 15 characters')
      .required('Required!'),
    description: Yup.string()
      .max(400, 'Max 300 characters')
      .required('Required!'),
  });

  // Handle Addition
  const { addState, setAddState, enableAddState, disableAddState } = useAddState(setCategories, {
    name: "",
    description: "",
    numberOfRecipes: 0
  });
  const handleAddClick = useCallback((currentAddState: boolean) => {
    if (currentAddState) return disableAddState()
    else if (!currentAddState) enableAddState()
  }, [])
  useEffect(() => {
    if (addState) changeEditableRow(0, true);
    else changeEditableRow(0, false);
  }, [addState])

  // Handle Add or Edit submit
  // #region Add / Edit
  const onEditSubmit = useCallback(async (row: any, rowIndex: number, values: Category) => {
    const payload = {
      name: values?.name,
      description: values?.description
    }

    const previousRow = categories.find(c => c.id === row.id);
    setCategories(prev => prev.map((c: any, i: number) => (
      i === rowIndex ? { ...c, name: values?.name, description: values?.description } : { ...c }
    )))
    changeEditableRow(rowIndex, false)

    try {
      setLoading(true);
      const res = addState
        ? await axios.post('/api/categories', { ...payload })
        : await axios.put(`/api/categories/${row.id}`, { ...payload })
      enqueueSnackbar(
        res?.data?.message || "Category operation successful",
        { variant: 'success' }
      )
      fetchCategories('')
    }
    catch (e) {
      console.log("Error adding/editing category: ", e)
      enqueueSnackbar(
        e?.response?.data?.message || "Category operation failed",
        { variant: 'error' }
      )
      setCategories(prev => prev.map((c: any, i: number) => (
        i === rowIndex ? { ...previousRow } : { ...c }
      )))
      changeEditableRow(rowIndex, true)
    }
    finally {
      setLoading(false);
    }
  }, [addState, changeEditableRow, setCategories])

  return (
    <Box sx={{ backgroundColor: getShade(255, 0.2) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={{ xs: 1, md: 3 }}>
        <OutlinedInput
          size='small'
          placeholder='Search'
          startAdornment={
            <InputAdornment position='start'>
              <Search sx={{ fontSize: '1rem' }} />
            </InputAdornment>
          }
        />
        <Button
          variant='contained'
          color='primary'
          size='small'
          startIcon={<Add />}
          disableElevation
          disableRipple
          onClick={() => handleAddClick(addState)}
        >
          Add
        </Button>
      </Stack>

      <Table
        columns={[
          {
            accessor: "name",
            header: "Name",
            cell: (row: Category) => <>{row.name}</>,
            thProps: { sx: { minWidth: '200px', width: '200px' } },
            editable: true
          },
          {
            accessor: "description",
            header: "Description",
            cell: (row: Category) => <>{row.description}</>,
            editable: true,
            inputProps: {
              multiline: true,
              maxRows: 3
            }
          },
          {
            accessor: "numberOfRecipes",
            header: "Number of Recipes",
            cell: (row: Category) => <>{row.recipesCount}</>,
            thProps: { sx: { minWidth: '200px', width: '200px' } }
          },
          {
            accessor: "actions",
            header: () => <Typography fontSize="0.9rem" fontWeight={500} color={getShade(0, 0.6)} textAlign="center">Actions</Typography>,
            cell: (row: Category, rowIndex: number, formik?: FormikProps<Category>, loading?: boolean) => (
              <ActionCell
                editState={editableRows[rowIndex]}
                onEditHandler={() => { changeEditableRow(rowIndex, true) }}
                onDeleteHandler={() => { console.log(`${row.name} CLicked Delete`) }}
                onCancelEditHandler={() => {
                  formik?.resetForm()
                  if (addState && rowIndex === 0) {
                    disableAddState();
                  }
                  else {
                    changeEditableRow(rowIndex, false)
                  }
                }}
                onSubmitHandler={() => formik?.submitForm()}
                loading={loading}
              />
            ),
            thProps: { sx: { width: '150px' } }
          },
        ]}
        data={categories}
        editableRows={editableRows}
        changeEditableRows={changeEditableRow}
        validationSchema={validationSchema}
        onEditSubmit={onEditSubmit}
        loading={loading}
      />
    </Box>
  )
}

export default ProfileCategories