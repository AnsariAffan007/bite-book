"use client";

import { Box, Button, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import axios from "axios";
import { FormikProps, FormikValues, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from 'yup';

interface FormValues {
  username: string,
  email: string
}

const errorColor = '#D2665A'

const ForgotPassword = () => {

  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(15, 'Name must be at most 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .max(40, 'Email must be at most 40 characters')
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik: FormikProps<FormValues> = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values: FormikValues) => {
      setLoading(true)
      try {
        const res = await axios.post('/api/auth/forgot-password', { ...values })
        enqueueSnackbar(res?.data?.message || 'Success! Please check email', { variant: 'success' })
      }
      catch (e) {
        console.log("Error in forgot password post: ", e)
        enqueueSnackbar(e?.response?.data?.message || 'Error sending reset password link!', { variant: 'error' })
      }
      setLoading(false)
    }
  })

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={formik.handleSubmit}>

        <Stack spacing={5} p={3} minWidth="50vh" boxShadow="0 0 8px #ccc" borderRadius={2}>

          <Box textAlign="center">
            <Typography color="primary" variant="h4" fontWeight={600}>Forgot Password</Typography>

            <Typography variant="subtitle2">
              Enter the email that you used to sign up, to get a reset password link
            </Typography>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Stack spacing={1}>
                <InputLabel sx={{ color: formik.errors.username ? errorColor : 'inherit' }}>
                  {formik.errors.username || "Username"}
                </InputLabel>
                <OutlinedInput
                  name="username"
                  placeholder="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  size="small"
                  error={Boolean(formik.errors.username)}
                />
              </Stack>
            </Box>
            <Box>
              <Stack spacing={1}>
                <InputLabel sx={{ color: formik.errors.email ? errorColor : 'inherit' }}>
                  {formik.errors.email || "Email"}
                </InputLabel>
                <OutlinedInput
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  size="small"
                  error={Boolean(formik.errors.email)}
                />
              </Stack>
            </Box>
          </Stack>

          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 1, width: '100%' }}
              disableElevation
              type="submit"
              disabled={loading}
            >
              Get Link
            </Button>
          </Box>

        </Stack>

      </form>
    </Box>
  )
}

export default ForgotPassword;