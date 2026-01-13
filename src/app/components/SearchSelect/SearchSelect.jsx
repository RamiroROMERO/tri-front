import { Autocomplete, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react'

export const SearchSelect = ({ label, name, value, onChange, optionList=[], error=undefined, helperText=undefined, required=undefined, ...rest }) => {

  const selectOne = [{value: 0, label: 'Seleccione...'}];
  const options = [...selectOne, ...optionList];
  const [selectedValue, setSelectedValue] = useState(options.find(elem=>elem.value===value) || options[0]);
  const [inputValue, setInputValue] = useState('');

  useEffect(()=>{
    if(selectedValue){
      onChange({target:{name, value: selectedValue.value}});
    }else{
      setSelectedValue(options[0]);
      onChange({target:name, value: options[0]?.value});
    }
  }, [selectedValue]);

  useEffect(()=>{
    setSelectedValue(options.find(elem=>elem.value===value) || options[0]);
  }, [value])

  return (
    <Autocomplete
      id={`auto-complete-${name}`}
      name={`auto-complete-${name}`}
      value={selectedValue||null}
      inputValue={inputValue}
      options={options}
      defaultValue={0}
      onChange={(e, newValue) => {
        setSelectedValue(newValue);
      }}
      onInputChange={(e, newInputValue) => {
        setInputValue(newInputValue);
      }}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} variant="standard" label={label} error={error} helperText={helperText} required={required}
      />}
      fullWidth
      blurOnSelect
      {...rest}
    />
  )
}
