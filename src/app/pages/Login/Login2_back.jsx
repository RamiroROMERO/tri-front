import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Alert, Card, CardContent, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
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

const Login = () => {
  document.title = "Login - GC Staffing"

  const { t } = useTranslation();
  const { formState, onInputChange, fnLogin, loginError, companyList, moduleList, fnOnChangeCompanyId, employeeData, table, propsModalForEmployeeLogin, hasLoading, onUserNameChange, onUserPasswordChange } = useLogin();
  const { userName, userPass, userRemember, companyId, moduleId } = formState;
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Div sx={{
      width: '100%',
      mb: '0',
      mt: 0,
      margin: 'auto',
      height: '100%',
      background: `#0267a0 url(${getAssetPath(`${ASSET_IMAGES}/widgets/back-login2.jpg`, "640x428")}) no-repeat center`,
      backgroundSize: 'cover',
      backgroundColor: alpha('#0267a0', 0.30)
    }}>
      <Card
        sx={{ height: '100%', width: '30%', minWidth: '350px', borderRadius: 0 }}
      >
        <CardContent
          sx={{
            mb: 0,
            flex: '0 1 300px',
            position: 'relative',
            background: `#0267a0 url(${getAssetPath(`${ASSET_IMAGES}/widgets/background-div-2.jpeg`, "1024x768")}) no-repeat center`,
            backgroundSize: 'cover',

            '&::after': {
              display: 'inline-block',
              position: 'absolute',
              content: `''`,
              inset: 0,
              backgroundColor: alpha('#0267a0', .30)
            }
          }}
        >
          <Div
            sx={{
              display: 'flex',
              minWidth: 0,
              flex: 1,
              flexDirection: 'column',
              color: 'common.white',
              position: 'relative',
              zIndex: 1
            }}
          >
            <Div sx={{ mb: 2 }}>
              <Typography variant={"h2"} color={"inherit"} fontWeight={500} mb={3}>{t("login.title")}</Typography>
            </Div>

            <Div sx={{ mt: 'auto' }}>
              <Link href="https://techsource-group.com" underline="none" sx={{ display: 'inline-flex' }}>
                <img src={`${ASSET_IMAGES}/logos/GC Staffing.png`} height='60px' alt="GC Staffing" />
              </Link>
              <hr />
            </Div>
          </Div>
        </CardContent>
        <CardContent sx={{ flex: 1, p: 4 }}
        >
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
        </CardContent>
      </Card>
      <Modal {...propsModalForEmployeeLogin} />
    </Div >
  );
}

export default Login;
