import React from 'react'
import { FormControlLabel, Checkbox } from '@mui/material'
import { validInt } from 'app/utils/helpers'

export const CheckBox = ({ label, name, value, onChange, ...rest }) => {

  if (typeof value !== 'boolean') {
    value = validInt(value);
    value = value == 1 ? true : false
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={onChange}
          name={name}
          id={name}
          {...rest}
        />
      }
      label={label}
    />
  )
}
