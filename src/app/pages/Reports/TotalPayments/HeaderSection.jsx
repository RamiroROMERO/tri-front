import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { useHeaderSection } from './useHeaderSection'
import AccordionCheck from 'app/components/AccordionCheck/AccordionCheck';

const HeaderSection = ({ t, setLoading, sweetAlerts, listCustomers, setTableData, setEnableFreeActions, setParamsFilter, screenControl }) => {

  const { formState, formValidation, isFormValid, sendForm, listWeeks, listYears, listProjects, setListProjects, onInputChange, onCustomerChange, onYearChange, fnGetData, projectSelected, setProjectSelected, fnProjectsChange, onWeekChange } = useHeaderSection({ t, setLoading, sweetAlerts, setTableData, setEnableFreeActions, setParamsFilter, screenControl });

  const { customerId, noYear, weekId, projectId } = formState;

  const { customerIdValid, noYearValid, weekIdValid, projectIdValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={8} md={4} lg={4}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
              error={(sendForm && customerIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && customerIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2} lg={1}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onYearChange}
              optionList={listYears}
              error={(sendForm && noYearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && noYearValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={listWeeks}
              error={(sendForm && weekIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && weekIdValid}
              required
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={5} lg={4}>
            <SearchSelect
              label={t("table.common.project")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={listProjects}
              error={(sendForm&&projectIdValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&projectIdValid}
              required
            />
          </Grid> */}
        </Grid>
        <Grid container spacing={3} direction={'row'} sx={{ mt: 1 }}>
          <Grid item sx={12} sm={12} md={10} lg={10}>
            <AccordionCheck
              list={listProjects}
              listSelected={projectSelected}
              setList={setListProjects}
              setListSelected={setProjectSelected}
              fnOptionsChange={fnProjectsChange}
              title={t("table.common.projects")}
              t={t}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} textAlign={'right'}>
            <Button sx={{ marginRight: '10px' }} startIcon={<FilterList />} onClick={fnGetData} color='primary' variant='contained'>
              {t("action.filter")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection