"use client";

import { RemoveRedEyeOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { Box, Button, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import axios from "axios";
import { FormikProps, FormikValues, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from 'yup';

interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const errorColor = '#D2665A'

const SignUp = () => {

  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const [showPass, setShowPass] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(15, 'Name must be at most 50 characters')
      .required('Name is required'),

    email: Yup.string()
      .max(40, 'Email must be at most 20 characters')
      .email('Invalid email address')
      .required('Email is required'),

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
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values: FormikValues) => {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password
      }
      try {
        const res = await axios.post('/api/auth/signup', payload)
        enqueueSnackbar(res.data.message, { variant: 'success' })
        router.push('/login/')
      }
      catch (e) {
        console.log("Error signing up!: ", e)
        enqueueSnackbar(e?.response?.data?.message || "Something went wrong", { variant: 'error' })
      }
    },
    validateOnChange: false
  })

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={formik.handleSubmit}>

        <Stack spacing={5} p={3} minWidth="50vh" boxShadow="0 0 8px #ccc" borderRadius={2}>

          <Box textAlign="center">
            <Typography color="primary" variant="h4" fontWeight={600}>Sign Up</Typography>
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
                  type={showPass ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        disableElevation
                        disableRipple
                        onClick={() => setShowPass(prev => !prev)}
                      >
                        {showPass
                          ? <VisibilityOffOutlined />
                          : <RemoveRedEyeOutlined />
                        }
                      </Button>
                    </InputAdornment>
                  }
                  sx={{
                    '&.MuiInputBase-root': {
                      pr: 0
                    }
                  }}
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
                  type="password"
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
              Sign Up
            </Button>
          </Box>

        </Stack>

      </form>
    </Box>
  )
}

export default SignUp;