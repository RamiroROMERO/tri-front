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
  const { formState, onInputChange, fnLogin, loginError, companyList, moduleList, fnOnChangeCompanyId, employeeData, table, propsModalForEmployeeLogin, hasLoading } = useLogin();
  const { userName, userPass, userRemember, companyId, moduleId } = formState;
  const [activeTab, setActiveTab] = useState("1");

  // const onChangeActiveTab = (e, newValue) => {
  //   setActiveTab(newValue);
  // }

  return (
    <Div sx={{
      width: 800,
      maxWidth: '100%',
      margin: 'auto',
      p: 4
    }}>
      {/* <TabContext value={activeTab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={onChangeActiveTab}>
            <Tab label="Users" value="1" />
            <Tab disabled={true} label="Employees" value="2" />
          </TabList>
      </Box>
      <TabPanel value="1"> */}
      <form>
        <Card
          sx={{
            display: 'flex',
            minWidth: '300px',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <CardContent
            sx={{
              flex: '0 1 300px',
              position: 'relative',
              background: `#023c63 url(${getAssetPath(`${ASSET_IMAGES}/widgets/background-div-2.jpg`, "640x428")}) no-repeat center`,
              backgroundSize: 'cover',

              '&::after': {
                display: 'inline-block',
                position: 'absolute',
                content: `''`,
                inset: 0,
                backgroundColor: alpha('#023c63', .30)
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
                zIndex: 1,
                height: '100%'
              }}
            >
              <Div sx={{ mb: 2 }}>
                <Typography variant={"h3"} color={"inherit"} fontWeight={500} mb={3}>{t("login.title")}</Typography>
                <Typography variant={"body1"} mb={2}>
                  {t("login.message")}
                </Typography>
              </Div>

              <Div sx={{ mt: 'auto' }}>
                <Link href="https://galpaconstruction.com/" underline="none" sx={{ display: 'inline-flex' }}>
                  <img src={`${ASSET_IMAGES}/logos/GC Staffing.png`} height='60px' alt="GC Staffing" />
                </Link>
                <hr />
                {/* <SocialMedia t={t} /> */}
              </Div>
            </Div>
          </CardContent>
          <CardContent sx={{ flex: 1, p: 4 }}
          >
            {/* Tab Panel for Login Users */}
            {/* <Div sx={{ mt: 1, mb: 3 }}>
              <SimpleSelect
                label={t("login.companyName")}
                name="companyId"
                value={companyId}
                onChange={fnOnChangeCompanyId}
                optionList={companyList}
              />
            </Div> */}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
                onKeyDown={(e) => {
                  if (e.key === 13) fnLogin(e)
                }}
              />
            </Div>
            <Div sx={{ mb: 2 }}>
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

            {/* <Button type='submit' onClick={fnLogin} variant="contained" sx={{ mb: 2 }}>{t("login.btn.signIn")}</Button> */}
            {loginError && (<Alert severity="error">{t(loginError)}</Alert>)}
            {/* TABPANEL FOR EMPLOYEE LOGIN */}
          </CardContent>
        </Card>
      </form>
      {/* </TabPanel> */}
      {/* <TabPanel value="2" disable={true}>
          <Card>
            <CardContent>
              <XDataGrid {...table} />
            </CardContent>
          </Card>
        </TabPanel> */}
      {/* </TabContext> */}
      <Modal {...propsModalForEmployeeLogin} />
    </Div>
  );
}

export default Login;
