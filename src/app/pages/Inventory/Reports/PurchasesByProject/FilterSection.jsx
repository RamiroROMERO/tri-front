import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect, XDatePicker } from 'app/components';
import { useFilterSection } from './useFilterSection'
import { YoutubeSearchedFor } from '@mui/icons-material';

const FilterSection = ({t, listCustomers, listProjects, setLoading, sweetAlerts}) => {
  const {formState, formValidation, isFormValid, sendForm, listProjectFilter, onInputChange, fnGetReport} = useFilterSection({t, setLoading, sweetAlerts, listProjects});

  const {customerId, projectId, dateInit, dateEnd} = formState;

  const {customerIdValid, projectIdValid, dateInitValid, dateEndValid} = formValidation;

  return (
    <Card sx={{marginBottom: '20px'}}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={7} md={7}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onInputChange}
              optionList={listCustomers}
              error={(sendForm&&customerIdValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&customerIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5} md={5}>
            <SearchSelect
              label={t("table.common.project")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={listProjectFilter}
              error={(sendForm&&projectIdValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&projectIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <XDatePicker
              label={t('table.common.dateFrom')}
              name='dateInit'
              value={dateInit}
              onChange={onInputChange}
              error={(sendForm&&dateInitValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&dateInitValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <XDatePicker
              label={t('table.common.dateTo')}
              name='dateEnd'
              value={dateEnd}
              onChange={onInputChange}
              error={(sendForm&&dateEndValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&dateEndValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} textAlign={'right'}>
            <Button startIcon={<YoutubeSearchedFor />} onClick={fnGetReport} color='primary' variant='contained'>
              {t("button.generate")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterSection