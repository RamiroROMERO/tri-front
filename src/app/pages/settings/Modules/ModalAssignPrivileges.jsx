import React from 'react'
import { Button, DialogActions, DialogContent, Grid, Tab, Tabs, Typography } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import { TabPanel } from 'app/components/TabPanel';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import { XDataGrid } from 'app/components/XDataGrid';
import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import { useAssignPrivilege } from './useAssignPrivilege';
import ModalNewPrivilege from './ModalNewPrivilege';

const ModalAssignPrivileges = ({setOpen, t, data}) => {
  const {moduleName, moduleId, setLoading, sweetAlerts} = data;

  const {typePrivilege, onTypePrivilegeChange, tableGeneral, tableAdmin, openModalNewPrivilege, setOpenModalNewPrivilege, typeList, openMsgDeletePriv, setOpenMsgDeletePriv, fnOnOkDeletePrivilege, fnGetDataPrivileges, currentItem, listPrivileges, listUserTypePrivileges, titleModalNew} = useAssignPrivilege({moduleId, setLoading, sweetAlerts, t});

  const propsToModalPrivileges = {
    title: titleModalNew,
    DialogContent: ModalNewPrivilege,
    open: openModalNewPrivilege,
    setOpen: setOpenModalNewPrivilege,
    maxWidth: "xs",
    data:{
      moduleName,
      typePrivilege,
      typeList,
      sweetAlerts,
      setLoading,
      fnGetDataPrivileges,
      currentItem,
      listPrivileges,
      listUserTypePrivileges
    }
  }

  const propsToModalConfirmDelete = {
    open: openMsgDeletePriv,
    setOpen: setOpenMsgDeletePriv,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOnOkDeletePrivilege
  }

  return (
    <>
    <DialogContent dividers>
      <Grid container spacing={3} direction='row'>
        <Grid item xs={12}>
          <JumboCardQuick
            title={
              <Typography variant={"h5"} color="text.primary" mb={-0.30}>
                <b>{t("dialog.addPrivileges.subtitle.module")}</b> {moduleName}
              </Typography>
            }
            action={
              <Tabs
                value={typePrivilege}
                onChange={onTypePrivilegeChange}
                sx={{
                  marginTop: -2.25,
                  marginBottom: -2.75,

                  '& .MuiTab-root': {
                    py: 2.5
                  }
                }}>
                <Tab label={t("page.profile.title.generals")} id="tab-simple-0" />
                <Tab label={t("page.profile.title.administratives")} id="tab-simple-1" />
              </Tabs>
            }
            headerSx={{
              borderBottom: 1, borderColor: 'divider'
            }}
            children={
              <>
                <TabPanel value={typePrivilege} index={0}>
                  <XDataGrid {...tableGeneral}/>
                </TabPanel>
                <TabPanel value={typePrivilege} index={1}>
                  <XDataGrid {...tableAdmin}/>
                </TabPanel>
              </>
            }
            wrapperSx={{
              margin: -3
            }}
          >
          </JumboCardQuick>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button startIcon={<ExitToApp />} onClick={()=>setOpen(false)} color='secondary' variant='contained'>
        {t('button.exit')}
      </Button>
    </DialogActions>
    <Modal {...propsToModalPrivileges}/>
    <ModalConfirm {...propsToModalConfirmDelete}/>
    </>
  )
}

export default ModalAssignPrivileges