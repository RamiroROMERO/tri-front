import { useState, useEffect } from 'react';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';

export const XDatePicker = ({ label, name, value, onChange, error = undefined, helperText = undefined, required = undefined, ...rest }) => {

  const [localDate, setLocalDate] = useState(value !== "" ? moment(value, "YYYY/MM/DD") : "");

  useEffect(() => {
    onChange({ target: { name, value: (localDate !== "" && localDate !== null) ? localDate.format('YYYY/MM/DD') : "" } })
  }, [localDate])

  useEffect(() => {
    setLocalDate((value !== "" && value.length === 10) ? moment(value, "YYYY/MM/DD") : "")
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
      <DatePicker
        label={label}
        value={localDate}
        name={name}
        id={`date-picker-${name}`}
        onChange={(newValue) => {
          setLocalDate(newValue)
          // onChange({target:{name, value: newValue}});
        }}
        {...rest}
        renderInput={(params) => <TextField {...params} value={value} variant="outlined" size='small' error={error} helperText={helperText} required={required} fullWidth />}
      />
    </LocalizationProvider>
  );
}
