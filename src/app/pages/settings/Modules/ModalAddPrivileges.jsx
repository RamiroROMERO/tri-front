import React from 'react'
import { Button, Card, CardContent, DialogActions, DialogContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material';
import { InputBox } from 'app/components/InputBox';
import { useAddPrivilege } from './useAddPrivilege';
import { XDataGrid } from 'app/components/XDataGrid';

const ModalAddPrivileges = ({setOpen, data, t}) => {
  const {moduleName, moduleId, listTypes, setLoading, sweetAlerts} = data;

  const {formState, onInputChange, formValidation, isFormValid, sendForm, fnSave, fnNew, table} = useAddPrivilege({setLoading, moduleId, sweetAlerts});

  const {name, type} = formState;

  const {nameValid} = formValidation;

  return (
    <>
    <DialogContent dividers>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Grid container spacing={3} direction='row'>
            <Grid item xs={12} md={6} lg={4}>
              <InputBox
                label={t('dialog.addPrivileges.subtitle.module')}
                name='moduleName'
                value={moduleName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={5}>
              <InputBox
                label={t('table.common.name')}
                name='name'
                value={name}
                onChange={onInputChange}
                error={(sendForm&&nameValid)?true:false}
                helperText={(sendForm &&!isFormValid)&&nameValid}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth variant="standard">
                <InputLabel id='type'>{t("table.users.column.type")}</InputLabel>
                <Select
                  name='type'
                  value={type}
                  onChange={onInputChange}
                  variant="standard"
                >
                  {listTypes.map(elem => {
                    return <MenuItem key={`${type}-${elem.value}`} value={elem.value}>{elem.label}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={12} textAlign={'right'}>
              <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={fnNew} color='secondary' variant='contained'>
                {t("button.clear")}
              </Button>
              <Button startIcon={<Save />} onClick={fnSave} color='primary' variant='contained'>
                {t("button.save")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <XDataGrid {...table}/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    </>
  )
}

export default ModalAddPrivileges