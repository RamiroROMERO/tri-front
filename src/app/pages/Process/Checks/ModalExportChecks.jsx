import React from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { ExitToApp, ImportExport } from '@mui/icons-material'
import { CheckBox } from 'app/components';
import { useModalExportChecks } from './useModalExportChecks';

export const ModalExportChecks = ({ setOpen, data, t }) => {
  const { rowsSelected, detailData, columnsExportList } = data;

  const {list, fnExportChecks, onCheckChange} = useModalExportChecks(rowsSelected, detailData, columnsExportList);
  
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
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<ImportExport />} onClick={fnExportChecks} color='primary' variant='contained' >
          {t('button.export')}
        </Button>
      </DialogActions>
    </>
  )
}