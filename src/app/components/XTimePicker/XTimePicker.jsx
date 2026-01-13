import { useState, useEffect } from 'react';
import moment from 'moment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';

export const XTimePicker = ({ label, name, value, onChange, ...rest }) => {

  const [localTime, setLocalTime] = useState(moment(value, "hh:mm a") || null);

  useEffect(() => {
    onChange({ target: { name, value: localTime?.format('hh:mm a') || null } })
  }, [localTime])

  useEffect(() => {
    setLocalTime(moment(value, "hh:mm a"))
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <TimePicker
        label={label}
        value={localTime}
        name={name}
        id={`time-picker-${name}`}
        onChange={(newValue) => {
          setLocalTime(newValue)
          // onChange({target:{name, value: newValue}});
        }}
        {...rest}
        renderInput={(params) => <TextField value={value} variant="outlined" size='small' {...params} />}
      />
    </LocalizationProvider>
  );
};