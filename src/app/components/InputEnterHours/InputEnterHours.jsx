import { Menu, TextField } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { EnterHoursMenuItem } from './EnterHoursMenuItem';

export const InputEnterHours = ({ name, value, valueOvertime, onChange, fieldName, currentRow, customColumns, enableFocused=false, colorInput = "secondary" }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const setQtyPayrollRH = (val) => {
    val = isNaN(val) ? 0 : val
    onChange(val, fieldName, currentRow, customColumns, false);
  };

  const setQtyPayrollOT = (val) => {
    val = isNaN(val) ? 0 : val;
    onChange(val, fieldName, currentRow, customColumns, true);
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };
  return (
    <>
      <TextField
        size="small"
        variant="outlined"
        className="inputEnterHour"
        aria-haspopup="true"
        name={name}
        autoComplete='off'
        id={`enter-hours-input-${name}`}
        aria-controls={open ? `enter-hours-menu-${name}` : undefined}
        aria-expanded={open ? 'true' : undefined}
        // onContextMenu={handleClick}
        onDoubleClick={handleClick}
        onClick={(e) => {
          e.target.selectionStart = 0
        }}
        value={value}
        onChange={({ target }) => setQtyPayrollRH(target.value)}
        color={colorInput}
        focused={enableFocused}
      >
      </TextField>

      <Menu
        id={`enter-hours-menu-${name}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        color='red'
      >
        <EnterHoursMenuItem
          label='RH'
          value={value}
          setValue={setQtyPayrollRH}
        />
        <EnterHoursMenuItem
          autoFocus={true}
          label='OT'
          value={valueOvertime}
          setValue={setQtyPayrollOT}
        />
      </Menu>
    </>
  )
}