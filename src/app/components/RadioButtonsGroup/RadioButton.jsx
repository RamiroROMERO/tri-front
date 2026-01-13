import { FormControlLabel, Radio } from '@mui/material'
import React from 'react'

export const RadioButton = ({id, label, value}) => {
  return (
    <FormControlLabel
      id={id}
      value={value}
      control={<Radio/>}
      label={label}/>
  )
  }
