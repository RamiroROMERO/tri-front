import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material'
import { SimpleSelect } from 'app/components/SimpleSelect'
import { SearchSelect } from 'app/components/SearchSelect'
import { EventRepeat, FilterList } from '@mui/icons-material'

const FilterWeeks = ({ listYears, listCustomers, formState, formValidation, isFormValid, onInputChange, sendForm, fnFilterWeeks, fnGenerateWeeks, t }) => {

  const { yearFilter, customerFilter } = formState;

  const { yearFilterValid, customerFilterValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={3} md={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearFilter"
              value={yearFilter}
              onChange={onInputChange}
              optionList={listYears}
              error={(sendForm && yearFilterValid) ? true : false}
              helperText={(sendForm && !isFormValid) && yearFilterValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={9} md={5}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerFilter"
              value={customerFilter}
              onChange={onInputChange}
              optionList={listCustomers}
              error={(sendForm && customerFilterValid) ? true : false}
              helperText={(sendForm && !isFormValid) && customerFilterValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={5} lg={5} textAlign={'right'}>
            <Button sx={{ marginRight: '10px' }} startIcon={<FilterList />} onClick={fnFilterWeeks} color='secondary' variant='contained'>
              {t("action.filter")}
            </Button>
            <Button startIcon={<EventRepeat />} onClick={fnGenerateWeeks} color='primary' variant='contained'>
              {t("button.generateYear")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterWeeks