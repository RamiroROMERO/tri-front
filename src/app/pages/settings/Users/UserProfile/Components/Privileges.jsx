import React from 'react'
import Tab from "@mui/material/Tab";
import { Grid, Paper, TableContainer, Tabs } from "@mui/material";
import { TabPanel} from 'app/components/TabPanel';
import { DataTable } from 'app/components/DataTable';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import CardList from 'app/components/CardList/CardList';
import { useUserPrivileges } from '../useUserPrivileges';
import { Modal } from 'app/components/Modal';
import { ModalConfirm } from 'app/components/ModalConfirm';
import ModalNewPrivilege from '../ModalNewPrivilege';
import { XDataGrid } from 'app/components/XDataGrid';

const Privileges = ({t, listModules, moduleId, setModuleId, typePrivilege, onTypePrivilegeChange, setLoading, userId, sweetAlerts, currentItem, controlAdmin}) => {

  const {formStatePriv, moduleName, tableGeneral, tableAdmin, openModalPrivileges, setOpenModalPrivileges, listPrivileges, onInputChangePriv, onPrivilegeChange, filterListPrivileges, fnSavePrivileges, setFilterListPrivileges, fnChangePrivilegesSel, openMsgChangeStatus, setOpenMsgChangeStatus, fnOkChangeStatus, openMsgDeletePriv, setOpenMsgDeletePriv, fnOnOkDeletePrivilege, openMsgAssignAllPriv, setOpenMsgAssignAllPriv, fnOkAssignAllPrivilege, onStatusGenChange, disableChecks, titleModalNew} = useUserPrivileges({setLoading, userId, moduleId, sweetAlerts, t, currentItem, controlAdmin});

  const propsToCardList = {
    title:"Modules",
    dataList: listModules,
    selectedIndex: moduleId,
    setSelectedIndex: setModuleId
  }

  const propsToModalConfirm = {
    open: openMsgChangeStatus,
    setOpen: setOpenMsgChangeStatus,
    message: "component.sweetAlert.question.enablePrivilege",
    onSuccess: fnOkChangeStatus
  }

  const propsToModalConfirmDelete = {
    open: openMsgDeletePriv,
    setOpen: setOpenMsgDeletePriv,
    message: "dialog.confirm.text.delete",
    onSuccess: fnOnOkDeletePrivilege
  }

  const propsToModalAssignAllPriv = {
    open: openMsgAssignAllPriv,
    setOpen: setOpenMsgAssignAllPriv,
    message: "dialog.confirm.text.assignAllPrivileges",
    onSuccess: fnOkAssignAllPrivilege
  }

  const propsToModalPrivileges = {
    title: titleModalNew,
    DialogContent: ModalNewPrivilege,
    open: openModalPrivileges,
    setOpen: setOpenModalPrivileges,
    maxWidth: "xs",
    data:{
      listPrivileges,
      moduleName,
      typePrivilege,
      formStatePriv,
      onInputChangePriv,
      filterListPrivileges,
      onPrivilegeChange,
      fnSavePrivileges,
      setFilterListPrivileges,
      fnChangePrivilegesSel,
      onStatusGenChange,
      disableChecks
    }
  }

  return (
    <>
    <JumboCardQuick
      title={t("page.profile.title.privileges")}
      action={
        <Tabs
          value={typePrivilege}
          onChange={onTypePrivilegeChange}
          sx={{
            marginTop: -2.25,
            marginBottom: -2.5,

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
    >
      <Grid container spacing={1} direction="row" sx={{ mt: -4.00}}>
        <Grid item xs={12} md={3}>
          <CardList {...propsToCardList}/>
        </Grid>
        <Grid item xs={12} md={9}>
          <TabPanel value={typePrivilege} index={0}>
            <TableContainer component={Paper}>
              <XDataGrid {...tableGeneral}/>
            </TableContainer>
          </TabPanel>
          <TabPanel value={typePrivilege} index={1}>
            <TableContainer component={Paper}>
              <XDataGrid {...tableAdmin}/>
            </TableContainer>
          </TabPanel>
        </Grid>
      </Grid>
    </JumboCardQuick>
    <Modal {...propsToModalPrivileges}/>
    <ModalConfirm {...propsToModalConfirm}/>
    <ModalConfirm {...propsToModalConfirmDelete}/>
    <ModalConfirm {...propsToModalAssignAllPriv}/>
    </>
  );
}

export default Privileges