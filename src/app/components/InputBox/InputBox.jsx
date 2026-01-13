import { TextField } from '@mui/material'
import React from 'react'

export const InputBox = ({ label, name, value, onChange, ...rest }) => {
  return (
    <TextField
      id={name}
      label={label}
      variant="outlined"
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      {...rest}
    />
  )
}
