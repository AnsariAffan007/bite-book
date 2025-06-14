"use client";

import { theme } from "@/themes/theme";
import { RemoveRedEyeOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { Box, Button, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";
import axios from "axios";
import { FormikProps, FormikValues, useFormik } from "formik";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from 'yup';

interface FormValues {
  username: string;
  password: string;
}

const errorColor = '#D2665A'
const linkStyles: React.CSSProperties = {
  textDecoration: 'underline',
  textDecorationColor: theme.palette.primary.main,
  textUnderlineOffset: 4,
  textDecorationThickness: '2px'
}

const Login = () => {

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(15, 'Name must be at most 50 characters')
      .required('Name is required'),

    password: Yup.string()
      .max(20, 'Password must be at most 20 characters')
      .required('Password is required'),
  });

  const formik: FormikProps<FormValues> = useFormik<FormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: FormikValues) => {
      setLoading(true)
      const payload = {
        username: values.username,
        password: values.password
      }
      try {
        const res = await axios.post('/api/auth/login', payload)
        enqueueSnackbar(res.data.message, { variant: 'success' })
        window.location.pathname = '/'
      }
      catch (e) {
        console.log("Error logging in!: ", e)
        enqueueSnackbar(e?.response?.data?.message || "Something went wrong", { variant: 'error' })
      }
      setLoading(false);
    }
  })

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={formik.handleSubmit}>

        <Stack spacing={5} p={3} minWidth="50vh" boxShadow="0 0 8px #ccc" borderRadius={2}>

          <Box textAlign="center">
            <Typography color="primary" variant="h4" fontWeight={600}>Login</Typography>

            <Typography variant="subtitle2">
              Don't have an account? <Link href="/signup" style={linkStyles}>Sign up</Link>
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
                <Typography variant="subtitle2" textAlign="right">
                  <Link href="/forgot-password" style={linkStyles}>Forgot password?</Link>
                </Typography>
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
              Login
            </Button>
          </Box>

        </Stack>

      </form>
    </Box>
  )
}

export default Login;