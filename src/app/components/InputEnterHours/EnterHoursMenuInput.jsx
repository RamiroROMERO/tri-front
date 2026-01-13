import { Input, TextField } from '@mui/material'
import React from 'react'

const styleInput = {
  maxWidth: '80px',
  marginRight: '5px',
  marginLeft: '5px',
  paddingLeft: '5px'
}

export const EnterHoursMenuInput = ({ value, setValue, ...rest }) => {

  return (
    <TextField
      variant="outlined"
      size="small"
      style={{ ...styleInput }}
      value={value}
      className="inputEnterHour"
      autoComplete='off'
      selectionStart={0}
      {...rest}
      onClick={(e) => {
        e.stopPropagation();
        e.target.selectionStart = 0
      }}
      onFocus={(e) => {
        e.stopPropagation();
        e.target.selectionStart = 0
      }}
      onChange={({ target }) => { setValue(target.value) }}
    />
  )
}