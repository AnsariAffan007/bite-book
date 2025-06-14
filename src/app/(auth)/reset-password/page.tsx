"use client";

import { Box, Button, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import { FormikProps, FormikValues, useFormik } from "formik";
import * as Yup from 'yup';

interface FormValues {
  password: string;
  confirmPassword: string;
}

const errorColor = '#D2665A'

const ResetPassword = () => {

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be at most 20 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password')
  });

  const formik: FormikProps<FormValues> = useFormik<FormValues>({
    initialValues: {
      password: "",
      confirmPassword: ""
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
            <Typography color="primary" variant="h4" fontWeight={600}>Reset Password</Typography>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Stack spacing={1}>
                <InputLabel sx={{ color: formik.errors.password ? errorColor : 'inherit' }}>
                  {formik.errors.password || "Password"}
                </InputLabel>
                <OutlinedInput
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  size="small"
                  error={Boolean(formik.errors.password)}
                />
              </Stack>
            </Box>
            <Box>
              <Stack spacing={1}>
                <InputLabel sx={{ color: formik.errors.confirmPassword ? errorColor : 'inherit' }}>
                  {formik.errors.confirmPassword || "Confirm Password"}
                </InputLabel>
                <OutlinedInput
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  size="small"
                  error={Boolean(formik.errors.confirmPassword)}
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
              Confirm
            </Button>
          </Box>

        </Stack>

      </form>
    </Box>
  )
}

export default ResetPassword;