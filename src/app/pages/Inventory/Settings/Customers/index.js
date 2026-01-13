import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp } from "@jumbo/hooks";
import { LAYOUT_NAMES } from 'app/layouts/layouts';
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import Content from './Content';

const Customers = (props) => {
  document.title = "GC Staffing - Customers"
  const dispatch = useDispatch();
  const {activeLayout, setActiveLayout } = useJumboApp();
  const [isLoading, setLoading] = useState(false);
  const {sweetAlerts} = ToastAlert();

  if(activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT){
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(()=>{
    dispatch(onTitleEdit('customers'));
    dispatch(onBreadcrumbEdit(['inventory','settings','customers']));
  },[]);

  return (
    <>
      <Loading show={isLoading} />
      <Content setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default Customers