import { useEffect, useState } from 'react';
import { useForm } from 'app/hooks';
import { formatNumber, validFloat, validInt } from 'app/utils/helpers';
import { request } from 'app/utils/core';
import moment from 'moment';

export const useHeaderSection = ({ t, setLoading, sweetAlerts, setTableData, screenControl, setTotalCheks }) => {
  const { optCreate } = screenControl;
  const [sendForm, setSendForm] = useState(false);

  const formValidations = {
    employeeId: [(val) => validInt(val) !== 0, t("alertMessages.warning.employeeId")],
    noYear: [(val) => validInt(val) !== 0, t("alertMessages.warning.noYear")]
  }

  const { formState, formValidation, isFormValid, onInputChange } = useForm({
    employeeId: 0,
    noYear: 0
  }, formValidations);

  const { employeeId, noYear } = formState;

  useEffect(() => { }
    , [])

  const fnGetData = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingParams"));
      return;
    }

    setLoading(true);
    setTotalCheks('0.00');
    request.GET(`/checks?employeeId=${employeeId}&noYear=${noYear}`, (resp) => {
      let nTotalChecks = 0;
      const data = resp.checks.map(item => {
        item.date = moment(item.date, 'YYYY-MM-DD').format('MM/DD/YYYY');
        item.employeeName = item.employee?.name || '';
        item.bankName = item.bank?.name || '';
        item.dateEndExport = moment(item.dateEnd, 'YYYY-MM-DD').format('MM/DD/YYYY');
        nTotalChecks += validFloat(item.total);
        return item;
      });
      setTotalCheks(formatNumber(nTotalChecks, '$.', 2));
      setTableData(data);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  return (
    {
      formState,
      formValidation,
      isFormValid,
      sendForm,
      onInputChange,
      fnGetData
    }
  )
}
