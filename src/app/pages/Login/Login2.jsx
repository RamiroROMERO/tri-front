import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Card, CardContent, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import LoadingButton from '@mui/lab/LoadingButton';
import Div from "@jumbo/shared/Div";
import { alpha } from "@mui/material/styles";
// import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ASSET_IMAGES } from "app/utils/constants/paths";
import { getAssetPath } from "app/utils/appHelpers";
import { SimpleSelect } from 'app/components';
import { Modal } from 'app/components';
import { useLogin } from './useLogin';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import './login.css';

const Login = () => {
  document.title = "Login - GC Staffing"

  const { t } = useTranslation();
  const { formState, onInputChange, fnLogin, loginError, companyList, moduleList, fnOnChangeCompanyId, employeeData, table, propsModalForEmployeeLogin, hasLoading, onUserNameChange, onUserPasswordChange } = useLogin();
  const { userName, userPass, userRemember, companyId, moduleId } = formState;

  return (
    <Div style={{ display: 'flex', minHeight: '100vh', width: '100wh' }}>
      <Div className='divBackground' style={{ padding: '30px', minHeight: '100vh', width: '70%', background: `#f8f8d6 url(${getAssetPath(`${ASSET_IMAGES}/widgets/back-login2.jpg`, "640x428")}) no-repeat center` }}>
        <Link href="https://techsource-group.com" underline="none" sx={{ display: 'inline-flex' }}>
          <img src={`${ASSET_IMAGES}/logos/GC Staffing.png`} height='100px' alt="GC Staffing" />
        </Link>
      </Div>
      <Div className='divLogin'>
        <Div style={{ display: 'block', minHeight: '100h', width: "100%", padding: '60px', alignItems: 'center' }}>
          <Typography variant="h2" component='h2' color={"inherit"} fontWeight={500} mb={3}>{t("login.title")}</Typography>
          <Typography variant='p' component='p' sx={{ mb: '50px' }} >Welcome to GC Staffing</Typography>
          <Div sx={{ mt: 1, mb: 3 }}>
            <SimpleSelect
              label={t("login.companyName")}
              name="companyId"
              value={companyId}
              onChange={fnOnChangeCompanyId}
              optionList={companyList}
            />
          </Div>
          <Div sx={{ mt: 1, mb: 3 }}>
            <SimpleSelect
              label={t("login.moduleName")}
              name="moduleId"
              value={moduleId}
              onChange={onInputChange}
              optionList={moduleList}
            />
          </Div>
          <Div sx={{ mt: 1, mb: 3 }}>
            <TextField
              variant='standard'
              fullWidth
              id="email"
              label={t("login.email")}
              value={userName}
              name="userName"
              onKeyDown={(e) => {
                if (e.key === 13) fnLogin(e)
              }}
              onChange={onUserNameChange}
            />
          </Div>
          <Div sx={{ mt: 1, mb: 2 }}>
            <TextField
              variant='standard'
              fullWidth
              id="password"
              label={t("login.password")}
              type="password"
              value={userPass}
              name="userPass"
              onChange={onUserPasswordChange}
              onKeyDown={(e) => {
                if (e.key === 13) fnLogin(e)
              }}
            />
          </Div>
          <Div sx={{ mb: 2, alignItems: 'end' }}>
            <FormControlLabel
              label={t("login.chk.rememberMe")}
              control={
                <Checkbox
                  checked={userRemember}
                  onChange={onInputChange}
                  name="userRemember"
                />
              }
            />
          </Div>
          <Div sx={{ display: 'grid', alignItems: 'flex-end' }}>
            <LoadingButton
              sx={{ mb: 2 }}
              loading={hasLoading}
              loadingPosition="start"
              startIcon={<VpnKeyIcon />}
              variant="contained"
              onClick={fnLogin}
              type='submit'
            >
              {t("login.btn.signIn")}
            </LoadingButton>
          </Div>

          {loginError && (<Alert severity="error">{t(loginError)}</Alert>)}
        </Div>
      </Div>
    </Div>
  );
}

export default Login;
