import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { useHeaderSection } from './useHeaderSection'

const HeaderSection = ({ t, setLoading, listYears, listWeeksWorked, listCustomers, listProjects, listLocations, setTableData, screenControl, sweetAlerts }) => {

  const { formState, listWeeks, onInputChange, fnGetData } = useHeaderSection({ setLoading, listWeeksWorked, setTableData, screenControl, sweetAlerts, t });

  const { noYear, weekId, projectId, customerId, locationId } = formState;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={3} md={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onInputChange}
              optionList={listYears}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={5}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onInputChange}
              optionList={listWeeks}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onInputChange}
              optionList={listCustomers}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <SearchSelect
              label={t("table.common.project")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={listProjects}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <SearchSelect
              label={t("table.common.location")}
              name="locationId"
              value={locationId}
              onChange={onInputChange}
              optionList={listLocations}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2} textAlign={'right'}>
            <Button startIcon={<FilterList />} onClick={fnGetData} color='primary' variant='contained'>
              {t("action.filter")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection