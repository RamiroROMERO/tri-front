import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp } from "@jumbo/hooks";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import { getPrivilegeData } from 'app/utils/helpers';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import SpeedDialButton from 'app/components/SpeedDialButton';
import Content from './Content';

const Payroll = (props) => {
  document.title = "Techmasys - Payroll"
  const dispatch = useDispatch();
  const {activeLayout, setActiveLayout } = useJumboApp();
  const [isLoading, setLoading] = useState(false);
  const [actions, setActions] = useState([]);
  const {sweetAlerts} = ToastAlert();

  const PRIVILEGE_ID = 7;
  const screenControl = getPrivilegeData(PRIVILEGE_ID);

  if(activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT){
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(()=>{
    dispatch(onTitleEdit('payroll'));
    dispatch(onBreadcrumbEdit(['process', 'payroll']));
  },[]);

  return (
    <>
      <Loading show={isLoading} />
      <Content screenControl={screenControl} setLoading={setLoading} sweetAlerts={sweetAlerts} setActions={setActions} {...props} />
      <SpeedDialButton actions={actions}/>
    </>
  )
}

export default Payroll