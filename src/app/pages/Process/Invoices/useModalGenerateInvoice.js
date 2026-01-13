import { useEffect, useState } from 'react';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalGenerateInvoice = ({ listCustomerOnQbk, setLoading, paramsFilter, sweetAlerts, t, rowsSelected, setDataInvoiceReview, setDataInvoiceTotal, setOpenInvoiceReview, controlAdmin }) => {
  const [accountSelected, setAccountSelected] = useState(0);
  const [serviceSelected, setServiceSelected] = useState(0);
  const [quickbookCustomerId, setQuickbookCustomerId] = useState(0);
  const [description, setDescription] = useState("");
  const [listServices, setListServices] = useState([]);

  const [controlInvoiceStatus, setControlInvoiceStatus] = useState([...rowsSelected]);

  const [btnGenerateDisable, setBtnGenerateDisable] = useState(false);
  const [showGenerateCard, setShowGenerateCard] = useState(false);

  const fnGetQbkServices = (qboCompany) => {
    let filterCustQbk = listCustomerOnQbk.filter((elem) => {
      return validInt(elem.quickbookCompanyId) === validInt(qboCompany);
    });
    filterCustQbk = filterCustQbk[0];
    if (filterCustQbk && validInt(filterCustQbk.id) !== 0) {
      setQuickbookCustomerId(filterCustQbk.quickbookCustomerId);
    } else {
      setQuickbookCustomerId(0);
    }

    setListServices([]);
    setLoading(true);
    request.POST(`/qboAPI/getProductsAndServices`, { qboCompany }, (resp) => {
      const services = resp.data.map(item => {
        item.value = item.id
        item.label = item.name
        return item;
      });
      setListServices(services);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const onAccountChange = e => {
    const account = e.target.value;

    setAccountSelected(account);
    if (account > 0) {
      fnGetQbkServices(account);
    }
  }

  const fnGenerateInvoice = () => {
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (quickbookCustomerId === 0) {
      sweetAlerts('error', t("warning.quickbookCustomerId"));
      return;
    }
    if (serviceSelected === 0) {
      sweetAlerts('error', t("warning.serviceSelected"));
      return;
    }
    if (accountSelected === 0) {
      sweetAlerts('error', t("warning.accountSelected"));
      return;
    }

    setBtnGenerateDisable(true);
    setShowGenerateCard(true)
    fnGenerateInvoiceRecursive(0);
  }

  const fnGenerateInvoiceRecursive = (idx) => {

    const currentProject = rowsSelected[idx];
    const filterService = listServices.find(item => item.id === serviceSelected);
    let isNewMissingTime, hasPerDiems = false;
    isNewMissingTime = currentProject.isMissingTime || false;
    hasPerDiems = currentProject.hasPerDiems || false;

    let where = {
      projectList: [...currentProject.projectList],
      weekId: paramsFilter.weekId,
      customerId: paramsFilter.customerId,
      quickbookCustomerId,
      quickBookItemRef: filterService,
      dataQB: { idCompany: accountSelected },
      description,
      isMissingTime: isNewMissingTime,
      hasPerDiems
    };

    request.POST(`/weeklyPayrollsDetails/generateInvoice`, where, (resp) => {

      const { invoice } = resp;
      let detaInvoice = {};
      if (invoice) detaInvoice = invoice[0];

      if (detaInvoice.DocNumber) {
        controlInvoiceStatus[idx].iconStatus = 'check_circle';
        controlInvoiceStatus[idx].colorStatus = '#229954';
        controlInvoiceStatus[idx].qbkNumber = detaInvoice.DocNumber;
      } else {
        controlInvoiceStatus[idx].iconStatus = 'highlight_off';
        controlInvoiceStatus[idx].colorStatus = '#c0392b';
        controlInvoiceStatus[idx].qbkNumber = 0;
      }
      setControlInvoiceStatus([...controlInvoiceStatus]);

      idx++;
      if (idx < rowsSelected.length) {
        fnGenerateInvoiceRecursive(idx);
      } else {
        setBtnGenerateDisable(false);
        setShowGenerateCard(false);
      }
    }, (err) => {
      controlInvoiceStatus[idx].iconStatus = 'highlight_off';
      controlInvoiceStatus[idx].colorStatus = '#c0392b';
      controlInvoiceStatus[idx].qbkNumber = 0;
      setControlInvoiceStatus(controlInvoiceStatus);
      console.warn(err);
      idx++;
      if (idx < rowsSelected.length) {
        fnGenerateInvoiceRecursive(idx);
      } else {
        setBtnGenerateDisable(false);
        setShowGenerateCard(false);
      }
      return err;
    });
  }

  return (
    {
      accountSelected,
      serviceSelected,
      setServiceSelected,
      listServices,
      onAccountChange,
      fnGenerateInvoice,
      btnGenerateDisable,
      showGenerateCard,
      controlInvoiceStatus
    }
  )
}
