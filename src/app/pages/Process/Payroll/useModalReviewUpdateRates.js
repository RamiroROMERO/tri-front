import { validInt } from "app/utils/helpers";

const { request } = require("app/utils/core");
const { useState, useEffect } = require("react");

const useModalReviewUpdateRates = ({ customerId, weekId, projectSelected, t, enableUpdate, sweetAlerts, setOpen, setLoading, fnGetPayroll }) => {

  const [dataRatesToUpdate, setDataRatesToUpdate] = useState([]);

  const getDataRatesToUpdate = () => {

    const data = {
      customerId,
      weekId,
      projectSelected
    }

    request.POST('/weeklyPayrollsDetails/reviewPayrollRates', data,
      resp => {
        const { data } = resp;
        setDataRatesToUpdate(data);
      },
      err => {
        setDataRatesToUpdate([])
      });
  }

  const fnUpdateRates = () => {

    if (enableUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (validInt(customerId) === 0 || validInt(weekId) === 0 || projectSelected.length <= 0) {
      return;
    }

    const data = {
      customerId,
      customerWeekId: weekId,
      projectSelected
    }
    setLoading(true);
    request.PUT('/weeklyPayrollsDetails/updatePayrollRates', data, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
      setOpen(false);
      fnGetPayroll();
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {

    getDataRatesToUpdate();

  }, []);

  const table = {
    title: t(' '),
    columns: [
      { field: 'code', headerName: t('table.employees.column.code'), flex: 0.6 },
      { field: 'name', headerName: t('table.employees.column.name'), flex: 1 },
      { field: 'classification', headerName: t('table.common.classifications'), flex: 0.9 },
      {
        field: 'oldPayrollRate', headerName: t('table.activeEmployees.column.oldRate'), flex: 0.5, type: 'number'
      },
      {
        field: 'newPayrollRate', headerName: t('table.activeEmployees.column.newRate'), flex: 0.5, type: 'number'
      },
      {
        field: 'oldPayrollRateOT', headerName: t('table.activeEmployees.column.oldRateOT'), flex: 0.5
      },
      {
        field: 'newPayrollRateOT', headerName: t('table.activeEmployees.column.newRateOT'), flex: 0.5, type: 'number'
      }
    ],
    data: dataRatesToUpdate,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    }
  };

  return {
    table,
    fnUpdateRates
  }

}

export default useModalReviewUpdateRates;