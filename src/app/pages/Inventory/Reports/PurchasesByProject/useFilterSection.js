import React, { useEffect, useState } from 'react';
import { useForm } from 'app/hooks';
import { validInt } from 'app/utils/helpers';

export const useFilterSection = ({t, setLoading, sweetAlerts, listProjects}) => {
  const [sendForm, setSendForm] = useState(false);
  const [listProjectFilter, setListProjectFilter] = useState([]);

  const formValidations = {
    customerId: [(val) => validInt(val) !== 0, t("alertMessages.warning.customerId")],
    projectId: [(val) => validInt(val) !== 0, t("alertMessages.warning.projectId")],
    dateInit: [val=>val!=="",t("alertMessages.warning.dateInit")],
    dateEnd: [val=>val!=="",t("alertMessages.warning.dateEnd")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    customerId: 0,
    projectId: 0,
    dateInit: '',
    dateEnd: ''
  }, formValidations);

  const {customerId} = formState;

  const fnGetReport = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }
  }

  useEffect(()=>{
    onBulkForm({projectId: 0});

    const filter = listProjects.filter(item=>item.customerId===customerId);
    setListProjectFilter(filter);
  },[listProjects, customerId]);

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      listProjectFilter,
      onInputChange,
      fnGetReport
    }
  )
}
