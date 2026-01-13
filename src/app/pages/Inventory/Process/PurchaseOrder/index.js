import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { useJumboApp } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "app/components/loading";
import { LAYOUT_NAMES } from "app/layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import Content from './Content';

const PurchaseOrder = (props) => {
  const {t} = useTranslation();
  document.title = "GC Staffing - Purchase Orders"
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const [isLoading, setLoading] = useState(false);
  const {sweetAlerts} = ToastAlert();

  if(activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT){
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }

  useEffect(()=>{
    dispatch(onTitleEdit('purchaseOrders'));
    dispatch(onBreadcrumbEdit(['inventory', 'process', 'purchaseOrders']));
  },[dispatch]);

  return(
    <>
      <Loading show={isLoading} />
      <Content setLoading={setLoading} sweetAlerts={sweetAlerts} t={t} {...props} />
    </>
  )
}

export default PurchaseOrder