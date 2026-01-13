import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { FilterList, ImportExport } from '@mui/icons-material';
import { SearchSelect, SimpleSelect } from 'app/components';
import { useHeaderSection } from './useHeaderSection'

const HeaderSection = ({ t, setLoading, sweetAlerts, listEmployees, yearList, setTableData, screenControl, setTotalCheks, fnExportData }) => {

  const { formState, formValidation, isFormValid, sendForm, onInputChange, fnGetData } = useHeaderSection({ t, setLoading, sweetAlerts, setTableData, screenControl, yearList, setTotalCheks });

  const { employeeId, noYear } = formState;

  const { employeeIdValid, noYearValid } = formValidation;

  return (
    <Card sx={{ marginBottom: '20px' }}>
      <CardContent>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={3} lg={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onInputChange}
              optionList={yearList}
              error={(sendForm && noYearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && noYearValid}
            />
          </Grid>
          <Grid item xs={12} sm={9} lg={4}>
            <SearchSelect
              label={t("table.common.employee")}
              name="employeeId"
              value={employeeId}
              onChange={onInputChange}
              optionList={listEmployees}
              error={(sendForm && employeeIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && employeeIdValid}
              required
            />
          </Grid>
        </Grid>
        <Grid container >
          <Grid item xs={12} textAlign={'right'} sx={{ mt: '5px' }}>
            <Button sx={{ marginRight: '10px' }} startIcon={<FilterList />} onClick={fnGetData} color='primary' variant='contained'>
              {t("action.filter")}
            </Button>
            <Button sx={{ marginRight: '10px' }} startIcon={<ImportExport />} onClick={fnExportData} color='secondary' variant='contained'>
              {t("action.exportToExcel")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default HeaderSection