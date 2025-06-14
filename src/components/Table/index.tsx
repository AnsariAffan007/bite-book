"use client";

import { getShade } from '@/styles/shader';
import { TableContainer, Table as MuiTable, TableHead, TableRow, TableCell, TableBody, Typography, OutlinedInput, Box, SxProps } from '@mui/material';
import React from 'react'
import { Column, TableProps } from './types';
import { Formik, FormikProps } from 'formik';

export const HeaderCell = ({ text, sx }: { text: string, sx?: SxProps }) => {
  return (
    <Typography fontSize="0.9rem" fontWeight={500} color={getShade(0, 0.6)} sx={{ ...sx }}>{text}</Typography>
  )
}

export const DataCell = ({ text, sx }: { text: string, sx?: SxProps }) => {
  return (
    <Typography fontSize="0.9rem" color={getShade(0, 0.8)} sx={{ ...sx }}>{text}</Typography>
  )
}

const Table: React.FC<TableProps> = ({ columns, data, editableRows, validationSchema, onEditSubmit, loading }) => {
  return (
    <TableContainer>
      <MuiTable>

        <TableHead sx={{ backgroundColor: getShade(0, 0.02) }}>
          <TableRow>
            {columns.map((col: Column, index: number) => (
              <TableCell key={index} {...col.thProps} sx={{ '&:first-child': { pl: 3 }, '&:last-child': { pr: 3 } }}>
                {typeof col.header === 'string'
                  ? <HeaderCell text={col.header} />
                  : col.header?.()
                }
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((row: any, index: number) => (
            Boolean(editableRows)
              ? (
                <Formik
                  key={index}
                  enableReinitialize
                  validationSchema={validationSchema}
                  initialValues={row}
                  onSubmit={(values) => onEditSubmit?.(row, index, values)}
                >
                  {(formik: FormikProps<any>) => {
                    return (
                      <TableRow key={index}>
                        {columns.map((col: Column, i: number) => (
                          <TableCell key={i} sx={{ '&:first-child': { pl: 3 }, '&:last-child': { pr: 3 } }}>
                            {Boolean(col.editable && Boolean(editableRows?.[index]))
                              ? (
                                <Box sx={{ width: '100%', position: 'relative' }}>
                                  <OutlinedInput
                                    name={col.accessor}
                                    value={formik.values[col.accessor]}
                                    onChange={formik.handleChange}
                                    size='small'
                                    error={Boolean(formik.errors[col.accessor])}
                                    sx={{ fontSize: '0.9rem', width: '100%' }}
                                    multiline={col.inputProps?.multiline}
                                    maxRows={col.inputProps?.maxRows}
                                  />
                                  {formik.errors[col.accessor] && (
                                    <Typography
                                      fontSize="0.75rem"
                                      sx={{ position: 'absolute', bottom: -20, left: 6, }}
                                      color="error"
                                    >
                                      {`${formik.errors[col.accessor]}`}
                                    </Typography>
                                  )}
                                </Box>
                              )
                              : (
                                Boolean(col.cell)
                                  ? col?.cell?.(row, index, formik, loading)
                                  : <DataCell text={row[col.accessor]} />
                              )
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  }}
                </Formik>
              )
              : (
                <TableRow key={index}>
                  {columns.map((col: Column, i: number) => (
                    <TableCell key={i} sx={{ '&:first-child': { pl: 3 }, '&:last-child': { pr: 3 } }}>
                      {Boolean(col.cell)
                        ? col?.cell?.(row, index, undefined, loading)
                        : <DataCell text={row[col.accessor]} />
                      }
                    </TableCell>
                  ))}
                </TableRow>
              )
          ))}
        </TableBody>

      </MuiTable>
    </TableContainer>
  )
}

export default Table