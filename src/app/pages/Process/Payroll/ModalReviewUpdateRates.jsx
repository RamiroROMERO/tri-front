import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Card, CardContent } from '@mui/material'
import { ExitToApp, Update } from '@mui/icons-material'
// import UpdateIcon from '@mui/icons-material/Update';
import { XDataGrid } from 'app/components/XDataGrid';
import useModalReviewUpdateRates from './useModalReviewUpdateRates';

const ModalReviewUpdateRates = ({ setOpen, data, t }) => {
  const { customerId, weekId, projectSelected, enableUpdate, sweetAlerts, setLoading, fnGetPayroll } = data;
  const { table, fnUpdateRates } = useModalReviewUpdateRates({ customerId, weekId, projectSelected, t, enableUpdate, sweetAlerts, setOpen, setLoading, fnGetPayroll });

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <XDataGrid {...table} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Update />} onClick={fnUpdateRates} color='primary' variant='contained'>
          {t('button.update')}
        </Button>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalReviewUpdateRates;