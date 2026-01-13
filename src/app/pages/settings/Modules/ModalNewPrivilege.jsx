import React, { useEffect, useState } from 'react'
import { ExitToApp, Save } from '@mui/icons-material'
import { Button, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import { ContainerWithLabel } from 'app/components/ContainerWithLabel';
import { CheckBox } from 'app/components/Checkbox';
import { validInt } from 'app/utils/helpers';
import { SimpleSelect } from 'app/components/SimpleSelect';
import { useModalNewPrivilege } from './useModalNewPrivilege';

const ModalNewPrivilege = ({setOpen, t, data}) => {
  const {moduleName, typePrivilege, typeList, sweetAlerts, setLoading, fnGetDataPrivileges, listPrivileges, listUserTypePrivileges, currentItem} = data;

  const {formState, filterListPrivileges, onInputChange, onPrivilegeChange, onTypeUserChange, fnSavePrivileges} = useModalNewPrivilege({t, sweetAlerts, setLoading, fnGetDataPrivileges, setOpen, currentItem, listPrivileges, listUserTypePrivileges, typePrivilege});

  const {id, optCreate, optUpdate, optDelete, userTypeId} = formState;
  const [showOptions, setShowOptions] = useState('block');
  const [showPrivileges, setShowPrivileges] = useState('block');
  const [disabledTypeUser, setDisabledTypeUser] = useState(false);

  useEffect(()=>{
    if(typePrivilege === validInt(0)){
      setShowOptions('block');
    }else{
      setShowOptions('none');
    }

    if(id>0){
      setShowPrivileges('none');
      setDisabledTypeUser(true);
    }else{
      setShowPrivileges('block');
      setDisabledTypeUser(false);
    }
  },[]);

  return (
    <>
    <DialogContent dividers>
      <Grid container spacing={2} direction='row'>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('dialog.addPrivileges.subtitle.module')}</Typography>
          <Typography variant={"h5"} mb={2.25}>{`${moduleName}`}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SimpleSelect
            label={t("table.users.column.type")}
            name="userTypeId"
            value={userTypeId}
            onChange={onTypeUserChange}
            optionList={typeList}
            disabled={disabledTypeUser}
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
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CheckBox
                  label={t('table.users.detail.optUpdate')}
                  name="optUpdate"
                  value={optUpdate}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <CheckBox
                  label={t('table.users.detail.optDelete')}
                  name="optDelete"
                  value={optDelete}
                  onChange={onInputChange}
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