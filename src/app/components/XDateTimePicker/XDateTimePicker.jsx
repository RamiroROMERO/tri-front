import { useState, useEffect } from 'react';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export const XDateTimePicker = ({ label, name, value, onChange, ...rest }) => {

  const [localDateTime, setLocalDateTime] = useState(moment(value, "YYYY/MM/DD hh:mm") || null);

  useEffect(() => {
    onChange({ target: { name, value: localDateTime?.format('YYYY/MM/DD hh:mm a') || null } })
  }, [localDateTime])

  useEffect(() => {
    setLocalDateTime(moment(value, "YYYY/MM/DD hh:mm a"))
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
      <DateTimePicker
        label={label}
        value={localDateTime}
        name={name}
        id={`date-picker-${name}`}
        onChange={(newValue) => {
          setLocalDateTime(newValue)
        }}
        {...rest}
        renderInput={(params) => <TextField value={value} variant="outlined" size='small' {...params} />}
      />
    </LocalizationProvider>
  );
};