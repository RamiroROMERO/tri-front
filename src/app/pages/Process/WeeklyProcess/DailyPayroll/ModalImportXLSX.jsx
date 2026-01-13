import React from 'react'
import { DialogActions, DialogContent, Button, Grid, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, Typography, Chip } from '@mui/material'
import { ExitToApp, SettingsInputComponent, Send } from '@mui/icons-material'
// import SettingsInputComponentIcon from '@mui/icons-material/';
import { useModalImportXLSX } from './useModalImportXLSX';
import { ImportXLSX } from 'app/components/ImportXLSX';
import { ModalFormatImportData } from './ModalFormatImportData';
import { Modal } from 'app/components/Modal';
import { formatNumber, validFloat } from 'app/utils/helpers';

export const ModalImportXLSX = ({ setOpen, data, t }) => {
  const { setLoading, sweetAlerts } = data;

  const { headersForTable, dataForTable, setDataForTable, setHeadersForTable, openModalFormatImportData, setOpenModalFormatImportData, colNameEmployee,
    setColNameEmployee,
    colClassEmployee,
    setColClassEmployee,
    columnsToData,
    setColumnsToData,
    fnProcessImportData,
    hasProcessData,
    setHasProcessData,
    employeeSearchType,
    setEmployeeSearchType } = useModalImportXLSX({ t, setLoading, sweetAlerts, setOpen, data });

  const propsToModalFormatData = {
    title: "dialog.enterHours.formatImportData",
    DialogContent: ModalFormatImportData,
    open: openModalFormatImportData,
    setOpen: setOpenModalFormatImportData,
    maxWidth: 'sm',
    data: {
      headersForTable,
      colNameEmployee,
      setColNameEmployee,
      colClassEmployee,
      setColClassEmployee,
      columnsToData,
      setColumnsToData,
      fnProcessImportData,
      setLoading,
      setHasProcessData,
      employeeSearchType,
      setEmployeeSearchType
    }
  };

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={6}>
            <ImportXLSX setData={setDataForTable} setHeaders={setHeadersForTable} />
          </Grid>
          <Grid item xs={6}>
            <Grid sx={{ mt: 1, mr: 1 }} container spacing={3} direction={'row'} justifyContent={'flex-end'}>
              <Button startIcon={<SettingsInputComponent />} disabled={dataForTable.length <= 0} variant='contained' onClick={() => setOpenModalFormatImportData(true)}>Config Data</Button>
            </Grid>
          </Grid>
        </Grid>
        {!hasProcessData && (
          <Grid sx={{ mt: 2 }} container spacing={3} direction={'row'}>
            <Grid item xs={12}>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 350 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {headersForTable.map(elem => {
                          return <TableCell> {elem}</TableCell>
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataForTable.map(item => {
                        return <TableRow>
                          {Object.values(item).map(elem => {
                            return <TableCell> {elem} </TableCell>
                          })}
                        </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
        {hasProcessData && (
          <Grid sx={{ mt: 2 }} container spacing={3} direction={'row'}>
            <Grid item xs={12}>
              <Typography variant='h3' component='h3'>Data Validated</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name Employee</TableCell>
                    <TableCell>Classification</TableCell>
                    <TableCell>Sunday</TableCell>
                    <TableCell>Sun OT</TableCell>
                    <TableCell>Monday</TableCell>
                    <TableCell>Mon OT</TableCell>
                    <TableCell>Tuesday</TableCell>
                    <TableCell>Tu OT</TableCell>
                    <TableCell>Wednesday</TableCell>
                    <TableCell>Wed OT</TableCell>
                    <TableCell>Thursday</TableCell>
                    <TableCell>Thu OT</TableCell>
                    <TableCell>Friday</TableCell>
                    <TableCell>Fri OT</TableCell>
                    <TableCell>Saturday</TableCell>
                    <TableCell>Sat OT</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataForTable.map(elem => {
                    return (
                      <TableRow>
                        <TableCell>{elem.code === '' ? <Chip variant='outlined' color='warning' label='New'></Chip> : elem.code}</TableCell>
                        <TableCell>{elem[colNameEmployee]}</TableCell>
                        <TableCell>{elem.classificationName}</TableCell>
                        {columnsToData.filter(item => item.showNormalize).map(({ field }) => {
                          return (<TableCell> {formatNumber(validFloat(elem[field]), '', 4)} </TableCell>)
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button startIcon={<Send />} disabled={!hasProcessData} onClick={() => setOpen(false)} color='primary' variant='contained'>
          {t('button.save')}
        </Button>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
      </DialogActions>
      {/* <ModalConfirm {...propsToModalConfirm}/> */}
      <Modal {...propsToModalFormatData} />
    </>
  )
}