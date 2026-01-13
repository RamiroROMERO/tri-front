import React, { useEffect, useState } from 'react'
import { ExitToApp, Save } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { CheckBox } from 'app/components/Checkbox';
import { validInt } from 'app/utils/helpers';

const ModalNewPrivilege = ({setOpen, t, data}) => {
  const {listPrivileges, moduleName, typePrivilege, formStatePriv, onInputChangePriv, filterListPrivileges, onPrivilegeChange, fnSavePrivileges, setFilterListPrivileges, fnChangePrivilegesSel, onStatusGenChange, disableChecks} = data;

  const {id, optCreate, optUpdate, optDelete, status} = formStatePriv;
  const [showOptions, setShowOptions] = useState('block');
  const [showPrivileges, setShowPrivileges] = useState('block');

  useEffect(()=>{
    if(typePrivilege === validInt(0)){
      setShowOptions('block');
    }else{
      setShowOptions('none');
    }

    if(id>0){
      setShowPrivileges('none');
    }else{
      setShowPrivileges('block');
    }

    const filterPrivType = listPrivileges.filter((item) =>{
      return item.type === validInt(typePrivilege);
    });
    setFilterListPrivileges(filterPrivType);
    fnChangePrivilegesSel(filterPrivType);
  },[]);

  return (
    <>
    <DialogContent dividers>
      <Grid container spacing={2} direction='row'>
        <Grid item xs={7} sm={8}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('dialog.addPrivileges.subtitle.module')}</Typography>
          <Typography variant={"h5"} mb={2.25}>{`${moduleName}`}</Typography>
        </Grid>
        <Grid item xs={6} sm={4}>
          <CheckBox
            label={t('table.users.detail.status')}
            name="status"
            value={status}
            onChange={onStatusGenChange}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} direction='row'>
        <Grid item xs={12} style={{display: showPrivileges}}>
          <ContainerWithLabel label={t('dialog.addPrivileges.subtitle.privileges')}>
            <Grid container direction='row' sx={{marginTop: '-13px'}}>
              {
                filterListPrivileges.map((item)=>{
                  return(
                    <Grid item xs={6} key={item.id}>
                      <CheckBox
                        id={`${item.id}`}
                        label={item.name}
                        name={item.name}
                        value={item.checked}
                        onChange={onPrivilegeChange}
                      />
                    </Grid>
                  )
                })
              }
            </Grid>
          </ContainerWithLabel>
        </Grid>
        <Grid item xs={12} style={{display: showOptions}}>
          <ContainerWithLabel label={t('dialog.addPrivileges.subtitle.options')}>
            <Grid container direction='row' sx={{marginTop: '-13px'}}>
              <Grid item xs={6} sm={4}>
                <CheckBox
                  label={t('table.users.detail.optCreate')}
                  name="optCreate"
                  value={optCreate}
                  onChange={onInputChangePriv}
                  disabled={disableChecks}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CheckBox
                  label={t('table.users.detail.optUpdate')}
                  name="optUpdate"
                  value={optUpdate}
                  onChange={onInputChangePriv}
                  disabled={disableChecks}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CheckBox
                  label={t('table.users.detail.optDelete')}
                  name="optDelete"
                  value={optDelete}
                  onChange={onInputChangePriv}
                  disabled={disableChecks}
                />
              </Grid>
            </Grid>
          </ContainerWithLabel>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
      <Button startIcon={<Save />} onClick={fnSavePrivileges} color='primary' variant='contained'>
        {t("button.save")}
      </Button>
    </DialogActions>
    </>
  )
}

export default ModalNewPrivilege