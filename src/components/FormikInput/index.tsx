import { InputLabel, OutlinedInput, OutlinedInputProps, Stack } from '@mui/material'
import { FormikProps } from 'formik';
import React, { HTMLInputTypeAttribute } from 'react'

interface FormikInputProps {
  inputLabel: string;
  inputName: string;
  placeholder: string;
  formikInstance: FormikProps<any>;
  type?: HTMLInputTypeAttribute;
  outlinedInputProps?: OutlinedInputProps
}

const FormikInput: React.FC<FormikInputProps> = ({ inputLabel, inputName, placeholder, formikInstance, type, outlinedInputProps }) => {
  return (
    <Stack spacing={1} position="relative">
      <InputLabel sx={{ color: formikInstance.errors[inputName] && '#D2665A' }}>
        {formikInstance.errors?.[inputName] as string || inputLabel}
      </InputLabel>
      <OutlinedInput
        name={inputName}
        placeholder={placeholder}
        value={formikInstance.values[inputName]}
        onChange={formikInstance.handleChange}
        size="small"
        error={Boolean(formikInstance.errors?.[inputName])}
        type={type}
        {...outlinedInputProps}
      />
    </Stack>
  )
}

export default FormikInput