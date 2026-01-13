import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material'
import React from 'react'

export const SimpleSelect = ({ label, name, value, onChange, optionList = [], error = undefined, helperText = undefined, required = undefined, fullWidth = true, ...rest }) => {
  return (
    <FormControl required={required} fullWidth={fullWidth} error={error} size='small'>
      {label && <InputLabel id={`simple-select-gc-${name}`}>{label}</InputLabel>}
      <Select
        labelId={`simple-select-gc-${name}`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        autoWidth={false}
        {...rest}
      >
        {optionList.map(elem => {
          return <MenuItem key={`${name}-${elem.value}`} value={elem.value}>{elem.label}</MenuItem>
        })}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}
