import React from 'react'
import { Button, DialogActions, DialogContent, Grid } from '@mui/material'
import { CheckBox } from 'app/components'
import { ExitToApp, PictureAsPdf, SimCardDownload } from '@mui/icons-material'
import { useModalExportPayroll } from './useModalExportPayroll'

const ModalExportPayroll = ({ setOpen, data, t }) => {
  const {columnsTable, startDate, endDate, customerId, weekId, projectSelected, customerName, numWeek, noYear, locationsName, ciaAccount, setLoading, showPrintPayroll, listProjects} = data;

  const {exportByCiaAccount, selectAllOptions, list, onCheckChange, onCheckAllChange, onCheckByCiaAccountChange, fnExportXLSXDocument, fnPrintDocument} = useModalExportPayroll({columnsTable, startDate, endDate, customerId, weekId, projectSelected, customerName, numWeek, noYear, locationsName, ciaAccount, setLoading, listProjects});

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'} style={{ marginTop: '0px' }}>
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
        <CheckBox label={t('checkbox.all')} name="selectAllOptions" value={selectAllOptions} onChange={onCheckAllChange}/>
        <CheckBox label={t('checkbox.exportByCiaAccount')} name="exportByCiaAccount" value={exportByCiaAccount} onChange={onCheckByCiaAccountChange} disabled={showPrintPayroll?true:false}/>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<SimCardDownload />} onClick={fnExportXLSXDocument} color='primary' variant='contained' style={{display: showPrintPayroll?'none':'flex'}}>
          {t('button.generate')}
        </Button>
        <Button startIcon={<PictureAsPdf />} onClick={fnPrintDocument} color='primary' variant='contained' style={{display: showPrintPayroll?'flex':'none'}}>
          {t('button.generate')}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalExportPayroll