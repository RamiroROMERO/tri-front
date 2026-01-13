import { ListItemText, MenuItem } from '@mui/material'
import React from 'react'
import { EnterHoursMenuInput } from './EnterHoursMenuInput'

export const EnterHoursMenuItem = ({label='', value=0, setValue=undefined, ...rest}) => {
  const customClick = (e)=>{
    e.stopPropagation();
    e.preventDefault();
  }
  return (
    <MenuItem
      onClick={customClick}
    >
    <ListItemText>{label}</ListItemText>
    <EnterHoursMenuInput {...rest} value={value} setValue={setValue} />
    </MenuItem>
  )
}
