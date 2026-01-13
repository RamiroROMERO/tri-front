import React from 'react'
import { FilterList } from '@mui/icons-material';
import { Button, Card, CardContent, Grid } from '@mui/material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { useHeaderSection } from './useHeaderSection'

const HeaderSection = ({ t, setLoading, listYears, listWeeksWorked, listCustomers, listProjects, listEmployees, listClassifications, listCiaAccount, setTableData, setTotalRegHours, setTotalOTHours, setTotalPayment, setEnableFreeActions, setParamsFilter, screenControl, sweetAlerts }) => {

  const { formState, listWeeks, onInputChange, fnGetData } = useHeaderSection({ setLoading, listWeeksWorked, setTableData, setTotalRegHours, setTotalOTHours, setTotalPayment, setEnableFreeActions, setParamsFilter, screenControl, sweetAlerts, t });

  const { noYear, weekId, customerId, projectId, employeeId, classificationId, ciaAccountId } = formState;

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
          <Grid item xs={12} sm={6} lg={4}>
            <SearchSelect
              label={t("table.common.project")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={listProjects}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={5}>
            <SearchSelect
              label={t("table.common.employee")}
              name="employeeId"
              value={employeeId}
              onChange={onInputChange}
              optionList={listEmployees}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SearchSelect
              label={t("table.paymentHistory.column.classificationName")}
              name="classificationId"
              value={classificationId}
              onChange={onInputChange}
              optionList={listClassifications}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <SearchSelect
              label={t("table.common.employeeCIAAccount")}
              name="ciaAccountId"
              value={ciaAccountId}
              onChange={onInputChange}
              optionList={listCiaAccount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={9} textAlign={'right'}>
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