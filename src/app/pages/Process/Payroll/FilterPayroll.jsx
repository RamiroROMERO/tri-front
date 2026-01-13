import React from 'react';
import { FactCheck, YoutubeSearchedFor } from '@mui/icons-material';
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect, SimpleSelect } from 'app/components';
import AccordionCheck from 'app/components/AccordionCheck/AccordionCheck';

const FilterPayroll = ({ t, listCustomers, listYears, listWeeks, listProjects, listCiaAccounts, projectSelected, listLocations, locationSelected, setListLocations, setLocationSelected, setProjectSelected, setListProjects, onInputChange, onCustomerChange, onYearChange, onWeekChange, fnLocationsChange, fnProjectsChange, fnGetPayroll, fnExportAllCustomers, customerId, yearId, weekId, ciaAccount }) => {

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={9} md={5}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearId"
              value={yearId}
              onChange={onYearChange}
              optionList={listYears}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={5}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={listWeeks}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <SearchSelect
              label={t("table.common.employeeCIAAccount")}
              name="ciaAccount"
              value={ciaAccount}
              onChange={onInputChange}
              optionList={listCiaAccounts}
            />
          </Grid>
          <Grid item xs={12}>
            <AccordionCheck
              list={listLocations}
              listSelected={locationSelected}
              setList={setListLocations}
              setListSelected={setLocationSelected}
              fnOptionsChange={fnLocationsChange}
              title={t("table.common.projectLocation")}
              t={t}
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12} textAlign={'right'}>
            <Button sx={{ marginRight: '10px' }} startIcon={<FactCheck />} onClick={fnExportAllCustomers} color='secondary' variant='contained'>
              {t("button.exportAllCustomers")}
            </Button>
            <Button startIcon={<YoutubeSearchedFor />} onClick={fnGetPayroll} color='primary' variant='contained'>
              {t("button.generate")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default FilterPayroll