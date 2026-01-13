import React, { useState } from 'react'
import { DialogActions, DialogContent, Button, Grid, Typography } from '@mui/material'
import { ExitToApp, ToggleOff } from '@mui/icons-material'
import { XDataGrid } from 'app/components/XDataGrid';
import { request } from 'app/utils/core';
import { SearchSelect } from 'app/components/SearchSelect';

const ModalProjectsWithoutH = ({ setOpen, data, t }) => {
  const {weekId, customerId, customerName, listWeeksWorked, setLoading, setWeekId} = data;

  const [dataProjectsWithoutH, setDataProjectsWithoutH] = useState([]);

  const table = {
    title: '',
    columns: [
      {field: 'code', headerName: t('table.projects2.column.code'), flex: 0.5 },
      {field: 'name', headerName: t('table.projects2.column.name'), flex: 1 },
      {field: 'location_name', headerName: t('table.projects2.column.location'), flex: 0.8 }
    ],
    data: dataProjectsWithoutH,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  const onWeekChange = e => {
    const week = e.target.value;
    setWeekId(week);

    setLoading(true);
    request.GET(`/payroll/projectsWithoutHours?weekId=${week}&customerId=${customerId}`, (resp) => {
      setDataProjectsWithoutH(resp.data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnDisableProjects = () => {
    const data = {
      weekId,
      customerId
    };

    request.PUT('/payroll/projectsWithoutHours', data, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setOpen(false);
      setLoading(false);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  return (
    <>
      <DialogContent dividers>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12} sm={5}>
            <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('table.common.customer')}</Typography>
            <Typography variant={"h5"} mb={1.25}>{customerName}</Typography>
          </Grid>
          <Grid item xs={12} md={7}>
            <SearchSelect
              label={t("table.common.week")}
              name="weekId"
              value={weekId}
              onChange={onWeekChange}
              optionList={listWeeksWorked}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction={'row'}>
          <Grid item xs={12}>
            <XDataGrid {...table}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={() => setOpen(false)} color='secondary' variant='contained'>
          {t('button.exit')}
        </Button>
        <Button startIcon={<ToggleOff />} onClick={fnDisableProjects} color='primary' variant='contained' disabled={dataProjectsWithoutH.length===0?true:false}>
          {t('button.disableAll')}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalProjectsWithoutH