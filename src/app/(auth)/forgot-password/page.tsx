"use client";

import { Box, Button, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import { FormikProps, FormikValues, useFormik } from "formik";
import * as Yup from 'yup';

interface FormValues {
  email: string
}

const errorColor = '#D2665A'

const ForgotPassword = () => {

  const validationSchema = Yup.object({
    email: Yup.string()
      .max(20, 'Email must be at most 20 characters')
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik: FormikProps<FormValues> = useFormik<FormValues>({
    initialValues: {
      email: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormikValues) => {
      console.log(values);
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