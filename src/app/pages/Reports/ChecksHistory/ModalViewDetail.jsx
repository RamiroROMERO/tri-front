import React, { useEffect } from 'react'
import { DialogActions, DialogContent, Button, Grid, Avatar, Icon, Typography, Divider, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Table, FormControl, OutlinedInput, InputAdornment } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { currentDate, formatNumber } from 'app/utils/helpers';
import moment from 'moment';

export const ModalViewDetail = ({ setOpen, data, t }) => {
  const { currentItem } = data;

  // var actualDate = currentDate();

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={1}>
            <Avatar>
              <Icon>account_balance</Icon>
            </Avatar>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.check.column.bankName')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{currentItem.bankName}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.checks.detail.name')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{currentItem.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.checks.detail.date')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{moment(currentItem.dateEnd, 'YYYY-MM-DD').format('MM/DD/YYYY')}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant={"h5"} mb={1.25}>{t('table.checks.detail.subTitle')}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ backgroundColor: '#252525', color: '#ffffff' }}> {t("table.checks.detail.description")} </TableCell>
                    <TableCell style={{ backgroundColor: '#252525', color: '#ffffff' }}> {t("table.checks.detail.amount")} </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItem.linesCheck.lines.map((row, key) => {
                    return (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {row.Description ? row.Description : row.description}
                        </TableCell>
                        <TableCell align="right">{row.Amount ? formatNumber(row.Amount, '$. ', 2) : formatNumber(row.value, '$. ', 2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 2 }} container direction="row" justifyContent="flex-end" alignItems="center">
          <Typography component={'h5'} variant='h5'>
            {formatNumber(currentItem.totalPayment, '$. ', 2)}
          </Typography>
        </Grid>
      </DialogContent >
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
      </DialogActions>
    </>
  )
}