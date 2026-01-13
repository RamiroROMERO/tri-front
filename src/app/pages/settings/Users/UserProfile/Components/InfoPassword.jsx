import React from 'react'
import { Button, Grid, IconButton, InputAdornment, Typography} from "@mui/material";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { InputBox } from 'app/components/InputBox';
import { useChangePass } from '../../useChangePass';
import { Clear, Save, Visibility, VisibilityOff } from '@mui/icons-material';

const InfoPassword = ({t, idUser, sweetAlerts, setLoading}) => {

  const {showPassword, onClickShowPassword, onMouseDownPassword, fnSavePass, formState, onInputChange, formValidation, isFormValid, sendForm, fnClearInputs} = useChangePass({idUser, t, sweetAlerts, setLoading});

  const {pass, oldPass, confirmPass} = formState;

  const {passValid, confirmPassValid} = formValidation;

  return (
    <JumboCardQuick
      title={
        <Typography variant={"h4"} mb={0}>{t("page.profile.title.changePass")}</Typography>
      }
      wrapperSx={{pt: 0}}
    >
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
        <Grid item xs={12} textAlign="right">
          <Button sx={{marginRight: '10px'}} startIcon={<Clear />} onClick={()=>fnClearInputs()} color='secondary' variant='contained'>
            {t('button.clear')}
          </Button>
          <Button startIcon={<Save />} onClick={fnSavePass} color='primary' variant='contained'>
            {t("button.save")}
          </Button>
        </Grid>
      </Grid>
    </JumboCardQuick>
  )
}

export default InfoPassword