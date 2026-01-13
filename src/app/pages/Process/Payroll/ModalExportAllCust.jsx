import React from 'react'
import { SimpleSelect, SearchSelect, CheckBox } from 'app/components';
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, SimCardDownload } from '@mui/icons-material'
import { useModalExportAllCust } from './useModalExportAllCust';

export const ModalExportAllCust = ({ setOpen, data, t }) => {
  const { allColumnsTable, allYearList, weeksList, sweetAlerts, currentYear, setLoading, screenControl } = data;

  const { yearId, weekId, selectAllOptions, listWeeksFilter, list, onChangeYearId, onWeekChange, onCheckChange, onCheckAllChange, fnExportXLSXDocument } = useModalExportAllCust({ currentYear, weeksList, allColumnsTable, sweetAlerts, t, setLoading, screenControl });

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={3} md={2}>
            <SimpleSelect
              label={t("table.common.year")}
              name="yearId"
              value={yearId}
              onChange={onChangeYearId}
              optionList={allYearList}
            />
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={listWeeksFilter}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'} style={{ marginTop: '10px' }}>
          {
            list.map((item, idx) => {
              return (
                <Grid item xs={6} sm={4} style={{ paddingTop: '0px' }} key={idx}>
                  <CheckBox
                    key={idx}
                    label={t(item.title)}
                    name={item.id}
                    id={item.id}
                    value={item.selected}
                    onChange={onCheckChange}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <CheckBox label={t('checkbox.all')} name="selectAllOptions" value={selectAllOptions} onChange={onCheckAllChange} />
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<SimCardDownload />} onClick={fnExportXLSXDocument} color='primary' variant='contained'>
          {t('button.generate')}
        </Button>
      </DialogActions>
    </>
  )
}