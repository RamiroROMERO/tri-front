import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const useModule = ({setLoading, sweetAlerts, setActions, controlAdmin}) => {
  const {t} = useTranslation();
  const [dataModules, setDataModules] = useState([]);
  const [listTypes, setListTypes] = useState([]);
  const [openModalNew, setOpenModalNew] = useState(false);
  const [openModalAddPrivilege, setOpenModalAddPrivilege] = useState(false);
  const [openModalAssignPrivileges, setOpenModalAssignPrivileges] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [titleModalNew, setTitleModalNew] = useState('');

  const fnGetData = ()=>{
    setLoading(true);
    request.GET('/modules', (resp)=>{
      const {modules} = resp;
      setDataModules(modules);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnNewModule = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem({});
    setTitleModalNew("dialog.addModules.title");
    setOpenModalNew(true);
  }

  const fnEditModule = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setTitleModalNew("dialog.editModules.title");
    setOpenModalNew(true);
  }

  const fnDetailModule = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenModalAddPrivilege(true);
  }

  const fnChangePrivileges = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setCurrentItem(item);
    setOpenModalAssignPrivileges(true);
  }

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>add</Icon>, name: 'button.add', onClick: fnNewModule }
    ];
    setActions(actions)
  }

  useEffect(()=>{
    fnGetData();
    fnMenuOptions();
    setListTypes([
      {value: 0, label: "General"},
      {value: 1, label: "Administrative"}
    ]);
  },[]);

  return (
    {
      dataModules,
      fnEditModule,
      fnChangePrivileges,
      fnDetailModule,
      openModalNew,
      setOpenModalNew,
      openModalAddPrivilege,
      setOpenModalAddPrivilege,
      listTypes,
      openModalAssignPrivileges,
      setOpenModalAssignPrivileges,
      currentItem,
      fnGetData,
      titleModalNew
    }
  )
}
