import React from 'react';
import { Button, DialogActions, DialogContent, Grid, IconButton, InputAdornment, Typography } from '@mui/material'
import { ExitToApp, Save, Visibility, VisibilityOff } from '@mui/icons-material'
import { InputBox } from 'app/components';
import { useChangePass } from './useChangePass';

const ModalChangePass = ({setOpen, data, t}) => {
  const {sweetAlerts, setLoading, currentItem} = data;
  const idUser = currentItem.id;

  const {showPassword, onClickShowPassword, onMouseDownPassword, fnSavePass, formState, onInputChange, formValidation, isFormValid, sendForm} = useChangePass({idUser, t, sweetAlerts, setOpen, setLoading});

  const {pass, oldPass, confirmPass} = formState;

  const {passValid, confirmPassValid} = formValidation;

  return (
    <>
      <DialogContent dividers>
        <Typography variant={"h6"} color="text.secondary" mb={.5}>{t('dialog.editPass.label.name')}</Typography>
        <Typography variant={"h5"} mb={1.25}>{`${currentItem.name?currentItem.name:''}`}</Typography>
        <Grid container spacing={3} direction='row'>
          <Grid item xs={12}>
            <InputBox
              label={t('page.profile.input.oldPassword')}
              name='oldPass'
              value={oldPass}
              onChange={onInputChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onClickShowPassword}
                      onMouseDown={onMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputBox
              label={t('dialog.input.newPassword')}
              name='pass'
              value={pass}
              onChange={onInputChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onClickShowPassword}
                      onMouseDown={onMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
              }}
              error={(sendForm&&passValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&passValid}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <InputBox
              label={t('table.users.column.confirmPass')}
              name='confirmPass'
              value={confirmPass}
              onChange={onInputChange}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onClickShowPassword}
                      onMouseDown={onMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
              }}
              error={(sendForm&&confirmPassValid)?true:false}
              helperText={(sendForm &&!isFormValid)&&confirmPassValid}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
        </Button>
        <Button startIcon={<Save />} onClick={fnSavePass} color='primary' variant='contained'>
          {t("button.save")}
        </Button>
      </DialogActions>
    </>
  )
}

export default ModalChangePass