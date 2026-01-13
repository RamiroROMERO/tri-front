import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useJumboApp } from "@jumbo/hooks";
import ToastAlert from 'app/components/ToastAlert';
import Loading from "../../../components/loading";
import { LAYOUT_NAMES } from "../../../layouts/layouts";
import { onTitleEdit, onBreadcrumbEdit } from 'app/redux/actions/generalData';
import SubsequentWork from './Content';

const FormatPage = (props) => {
  document.title = "Techmasys - Subsequent Work"
  const dispatch = useDispatch();
  const { activeLayout, setActiveLayout } = useJumboApp();
  const { sweetAlerts } = ToastAlert();

  dispatch(onTitleEdit('subsequentWork'));
  dispatch(onBreadcrumbEdit(['reports', 'subsequentWork']));

  if (activeLayout !== LAYOUT_NAMES.VERTICAL_DEFAULT) {
    setActiveLayout(LAYOUT_NAMES.VERTICAL_DEFAULT);
  }
  const [isLoading, setLoading] = useState(false);
  return (
    <>
      <Loading show={isLoading} />
      <SubsequentWork setLoading={setLoading} sweetAlerts={sweetAlerts} {...props} />
    </>
  )
}

export default FormatPage;