import React from 'react'
import { Card, CardContent, Grid } from '@mui/material';
import { SearchSelect } from 'app/components';

const FilterProjects = ({listCustomers, formState, formValidation, isFormValid, onCustomerChange, sendForm, t}) => {
  const {customerFilter} = formState;

  const {customerFilterValid} = formValidation;

  return (
    <Card sx={{marginBottom: '20px'}}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={9} md={5}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerFilter"
              value={customerFilter}
              onChange={onCustomerChange}
              optionList={listCustomers}
              error={(sendForm&&customerFilterValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&customerFilterValid}
              required
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterProjects