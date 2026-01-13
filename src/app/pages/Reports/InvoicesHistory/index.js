import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "../../../components/loading";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import Content from './Content';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const HomePage = (props) => {
  document.title = "GC Staffing - Invoices History"
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const dispatch = useDispatch();
  const { sweetAlerts } = ToastAlert();

  useState(() => {
    dispatch(onTitleEdit('invoicesHistory'));
    dispatch(onBreadcrumbEdit(['reports', 'invoicesHistory']));
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, []);

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <Loading show={isLoading} />
      <Content setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default HomePage;