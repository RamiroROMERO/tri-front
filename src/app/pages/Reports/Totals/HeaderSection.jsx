import React from 'react'
import { Button, Card, CardContent, Grid } from '@mui/material';
import { FilterAlt, FilterList } from '@mui/icons-material';
import { Modal, SearchSelect, SimpleSelect } from 'app/components';
import { useHeaderSection } from './useHeaderSection'
import { ModalFilterByProject } from './ModalFilterByProject';

const HeaderSection = ({ t, setLoading, sweetAlerts, listYears, listWeeksWorked, listCustomers, listProjects, setTableData, setTotalsData, setEnableFreeActions, setParamsFilter, screenControl }) => {

  const { formState, formValidation, isFormValid, sendForm, listWeeks, openModalFilterByProject, setOpenModalFilterByProject, onInputChange, fnGetData, fnGetDataByProject } = useHeaderSection({ t, setLoading, sweetAlerts, listWeeksWorked, setTableData, setTotalsData, setEnableFreeActions, setParamsFilter, screenControl });

  const { noYear, weekId } = formState;

  const { noYearValid, weekIdValid } = formValidation;

  const propsToModalFilterByProject = {
    title: 'dialog.totals.viewForProject',
    DialogContent: ModalFilterByProject,
    open: openModalFilterByProject,
    setOpen: setOpenModalFilterByProject,
    maxWidth: 'lg',
    data: {
      setLoading,
      sweetAlerts,
      listYears,
      listCustomers,
      listProjects
    }
  };

  return (
    <>
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
                error={(sendForm && noYearValid) ? true : false}
                helperText={(sendForm && !isFormValid) && noYearValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={9} md={5}>
              <SearchSelect
                label={t("table.common.week")}
                name="weekId"
                value={weekId}
                onChange={onInputChange}
                optionList={listWeeks}
                error={(sendForm && weekIdValid) ? true : false}
                helperText={(sendForm && !isFormValid) && weekIdValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5} textAlign={'right'}>
              <Button sx={{ marginRight: '10px' }} startIcon={<FilterList />} onClick={fnGetData} color='primary' variant='contained'>
                {t("action.filter")}
              </Button>
              <Button startIcon={<FilterAlt />} onClick={fnGetDataByProject} color='secondary' variant='contained'>
                {t("button.searchByProject")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Modal {...propsToModalFilterByProject} />
    </>
  )
}

export default HeaderSection