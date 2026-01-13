import React from 'react'
import { FormControl, FormHelperText, FormLabel, RadioGroup } from '@mui/material'
import { RadioButton } from './RadioButton'

export const RadioButtonsGroup = ({ label, name, value, onChange, options = [], error=undefined, helperText=undefined, required=undefined,...others }) => {

  const onChangeRadioGroup = ({target})=>{
    onChange({target:{name, value:target.value}});
  }

  return (
    <FormControl required={required} error={error}>
      <FormLabel id={`label-radio-${name}`}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={`radio-group-${name}`}
        name={`radio-group-${name}`}
        value={value}
        onChange={onChangeRadioGroup}
        label={label}
        {...others}
      >
        {options.map((elem, key) => {
          return (<RadioButton
            key={key}
            value={elem.id}
            label={elem.name}
          />)
        })}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}
