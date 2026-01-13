import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { CheckOutlined, ClearOutlined } from '@mui/icons-material'
import { useModalSelectWeek } from './useModalSelectWeek';
import { InputBox, SearchSelect, SimpleSelect } from 'app/components';

export const ModalSelectWeek = ({ setOpen, data, t }) => {
  const { currentItem, sweetAlerts, listYears, listWeeks } = data;
  const customerName = currentItem.customerName ? currentItem.customerName : '';
  const projectCode = currentItem.code ? currentItem.code : '';
  const projectName = currentItem.name ? currentItem.name : '';

  const { formState, formValidation, isFormValid, sendForm, filterWeeksYear, onInputChange, onYearChange, onWeekChange, fnViewEnterHours } = useModalSelectWeek({ t, sweetAlerts, listWeeks, currentItem });

  const { year, weekId, startDate, endDate } = formState;

  const { yearValid, weekIdValid } = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={5}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{`${customerName}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.projects.column.name')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{`${projectCode} | ${projectName}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <SimpleSelect
              label={t("table.common.year")}
              name="year"
              value={year}
              onChange={onYearChange}
              optionList={listYears}
              error={(sendForm && yearValid) ? true : false}
              helperText={(sendForm && !isFormValid) && yearValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <SearchSelect
              label={t("modal.select.selectWeek")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={filterWeeksYear}
              error={(sendForm && weekIdValid) ? true : false}
              helperText={(sendForm && !isFormValid) && weekIdValid}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputBox
              label={t('modal.input.initDate')}
              name='startDate'
              value={startDate}
              onChange={onInputChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputBox
              label={t('modal.input.endDate')}
              name='endDate'
              value={endDate}
              onChange={onInputChange}
              disabled
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ClearOutlined />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.cancel')}
        </Button>
        <Button startIcon={<CheckOutlined />} onClick={fnViewEnterHours} color='primary' variant='contained'>
          {t('button.accept')}
        </Button>
      </DialogActions>
    </>
  )
}