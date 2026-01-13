import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp, useJumboLayoutSidebar } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "../../components/loading";
import { LAYOUT_NAMES } from "../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import Home from './Home';
import { SIDEBAR_VARIANTS } from '@jumbo/utils/constants';

const HomePage = (props) => {
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  document.title = "GC Staffing - Home"
  const dispatch = useDispatch();
  const { sweetAlerts } = ToastAlert();

  useEffect(() => {
    dispatch(onTitleEdit('home'));
    dispatch(onBreadcrumbEdit(['home']))
    if (sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY) setSidebarOptions({ open: false })
  }, [])

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <Loading show={isLoading} />
      <Home setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default HomePage;