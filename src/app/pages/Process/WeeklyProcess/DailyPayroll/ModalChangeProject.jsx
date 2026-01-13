import React, { useState } from 'react'
import { DialogActions, DialogContent, Button, Grid } from '@mui/material'
import { CheckOutlined, ClearOutlined } from '@mui/icons-material'
import { SearchSelect } from 'app/components';
import { validInt } from 'app/utils/helpers';

export const ModalChangeProject = ({setOpen, data, t}) => {
  const {listProjectsCustomer, customerData, locationData, navigate, setSortGridModel} = data;

  const [projectId, setProjectId]= useState(0);

  const onProjectChange = e =>{
    setProjectId(e.target.value);
  }

  const fnSetChangeProject = ()=>{
    let projectSelected = listProjectsCustomer.find(elem=>{
      return validInt(elem.value) === validInt(projectId)
    });

    if(!projectSelected || validInt(projectSelected.id)<=0){
      return;
    }
    customerData.name = projectSelected.name;
    customerData.code = projectSelected.code;
    customerData.id = projectSelected.id;
    locationData.customerData = customerData;
    setSortGridModel([ {
      field: 'employeeName',
      sort: 'asc'
    }]);
    
    navigate(`/process/weeklyProcess/dailyPayroll`, {
      replace: false,
      state: locationData
    });
    setOpen(false);
  };

  return (
  <>
    <DialogContent dividers>
      <Grid container spacing={3} direction={'row'}>
        <Grid item xs={12}>
          <SearchSelect
            label={t("table.projects.column.location")}
            name="projectId"
            value={projectId}
            onChange={onProjectChange}
            optionList={listProjectsCustomer}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ClearOutlined />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.cancel')}
      </Button>
      <Button startIcon={<CheckOutlined />} onClick={fnSetChangeProject} color='primary' variant='contained'>
        {t('button.accept')}
      </Button>
    </DialogActions>
  </>
  )
}