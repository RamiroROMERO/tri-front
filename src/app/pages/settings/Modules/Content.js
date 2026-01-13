import React from 'react'
import ModuleCard from './ModuleCard/ModuleCard'
import { Grid } from '@mui/material'
import { Modal } from 'app/components/Modal';
import { useModule } from './useModule'
import ModalNew from './ModalNew'
import ModalAddPrivileges from './ModalAddPrivileges';
import ModalAssignPrivileges from './ModalAssignPrivileges';

const Content = ({setLoading, sweetAlerts, setActions, controlAdmin}) => {

  const {dataModules, fnEditModule, fnDetailModule, fnChangePrivileges, openModalNew, setOpenModalNew, openModalAddPrivilege, setOpenModalAddPrivilege, listTypes, openModalAssignPrivileges, setOpenModalAssignPrivileges, currentItem, fnGetData, titleModalNew} = useModule({setLoading, sweetAlerts, setActions, controlAdmin});

  const propsToModalNew = {
    title: titleModalNew,
    DialogContent: ModalNew,
    open: openModalNew,
    setOpen: setOpenModalNew,
    maxWidth: "xs",
    data:{
      sweetAlerts,
      setLoading,
      fnGetData,
      currentItem
    }
  }

  const propsToModalAddPrivileges = {
    title: 'dialog.addPrivileges.title',
    DialogContent: ModalAddPrivileges,
    open: openModalAddPrivilege,
    setOpen: setOpenModalAddPrivilege,
    maxWidth: "md",
    data:{
      moduleName: currentItem.name,
      moduleId: currentItem.id,
      listTypes,
      setLoading,
      sweetAlerts
    }
  }

  const propsToModalAssignPrivileges = {
    title: 'dialog.assignPrivileges.title',
    DialogContent: ModalAssignPrivileges,
    open: openModalAssignPrivileges,
    setOpen: setOpenModalAssignPrivileges,
    maxWidth: "md",
    data:{
      moduleName: currentItem.name,
      moduleId: currentItem.id,
      setLoading,
      sweetAlerts
    }
  }

  return (
    <>
      <Grid container spacing={3}>
      {
        dataModules.map((module, key)=>(
        <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
          <ModuleCard module={module} fnEdit={fnEditModule} fnDetail={fnDetailModule} fnChangePrivileges={fnChangePrivileges}/>
        </Grid>
        ))
      }
      </Grid>
      <Modal {...propsToModalNew}/>
      <Modal {...propsToModalAddPrivileges}/>
      <Modal {...propsToModalAssignPrivileges}/>
    </>
  )
}

export default Content