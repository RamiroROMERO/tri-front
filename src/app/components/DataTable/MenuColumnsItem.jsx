import { ListItemText, MenuItem, Switch } from '@mui/material'
import React from 'react'

export const MenuColumnsItem = ({ idx, label, field, onChange, checked }) => {
  return (
    <MenuItem key={idx}>
      <ListItemText id={`switch-list-${field}`} primary={label} />
      <Switch
        edge="end"
        onChange={onChange}
        checked={checked}
        inputProps={{
          'aria-labelledby': 'switch-list-' + field,
        }}
      />
    </MenuItem>
  )
}
