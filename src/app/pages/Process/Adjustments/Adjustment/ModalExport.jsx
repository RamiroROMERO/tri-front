import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, ImportExport } from '@mui/icons-material'
import { SearchSelect, SimpleSelect } from 'app/components';
import { useModalExport } from './useModalExport';

export const ModalExport = ({ setOpen, data, t }) => {
  const { typeId, setLoading, listCustomers, listYears, listWeeksWorked } = data;

  const { formState, onInputChange, onCustomerChange, onYearChange, fnExport, listProjects, listWeeks } = useModalExport({ setLoading, listWeeksWorked, typeId });

  const { noYear, noWeek, customerId, projectId } = formState;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12} sm={3}>
            <SimpleSelect
              label={t("table.common.year")}
              name="noYear"
              value={noYear}
              onChange={onYearChange}
              optionList={listYears}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <SearchSelect
              label={t("table.common.week")}
              name="noWeek"
              value={noWeek}
              onChange={onInputChange}
              optionList={listWeeks}
            />
          </Grid>
          <Grid item xs={12}>
            <SearchSelect
              label={t("table.common.customer")}
              name="customerId"
              value={customerId}
              onChange={onCustomerChange}
              optionList={listCustomers}
            />
          </Grid>
          <Grid item xs={12}>
            <SearchSelect
              label={t("table.common.project")}
              name="projectId"
              value={projectId}
              onChange={onInputChange}
              optionList={listProjects}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<ImportExport />} onClick={fnExport} color='primary' variant='contained'>
          {t('button.export')}
        </Button>
      </DialogActions>
    </>
  )
}