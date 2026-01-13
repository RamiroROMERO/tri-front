import { useState, useEffect } from 'react';
import moment from 'moment';
import { request } from 'app/utils/core';
import { roundTwoDecimals, validInt } from 'app/utils/helpers';

export const useFilters = (setLoading, setTableData, t, setParamsFilter, setListQbAccounts, setListCustomerOnQbk, setInvoiceTotal, screenControl, sweetAlerts, fnMenuOptions, setDataPerdiems, setDataRatesUpdated, setOpenViewUpdateRates) => {
  const { optCreate, optUpdate } = screenControl;
  const [customerList, setCustomerList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [allWeeks, setAllWeeks] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectMTList, setProjectMTList] = useState([]);
  const [projectSelected, setProjectSelected] = useState([]);
  const [locationSelected, setLocationSelected] = useState([]);
  const [projectMTSelected, setProjectMTSelected] = useState([]);
  const [customerId, setCustomerId] = useState(0);
  const [yearId, setYearId] = useState(0);
  const [weekId, setWeekId] = useState(0);

  useEffect(() => {
    request.GET('/customers/getSL?active=1', resp => {
      const { customers } = resp;
      const list = customers.map(elem => {
        const newItem = {
          label: `${elem.code} - ${elem.name}`,
          value: elem.id
        }
        return newItem;
      });
      setCustomerList(list)
    }, err => {
      console.warn(err);
    })
  }, []);

  useEffect(() => {
    if (validInt(customerId) === 0) return;
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customerId}`, resp => {
      const { weeksWorks } = resp;
      const list = weeksWorks.map(elem => {
        const { customersWeek } = elem;
        elem.value = customersWeek.id;
        elem.label = `# ${customersWeek.noWeek} WEEK OF ${moment(customersWeek.startDate).format('MM/DD/YYYY')} TO ${moment(customersWeek.endDate).format('MM/DD/YYYY')}`
        return elem;
      });
      setAllWeeks(list);
      const yearsList = weeksWorks.reduce((acc, cur) => {
        acc[cur.customersWeek.noYear] = cur.customersWeek.noYear;
        return acc;
      }, {});
      const yeList = Object.keys(yearsList).map(elem => {
        const newItem = {
          value: elem,
          label: elem
        };
        return newItem
      });
      const currentYear = new Date().getFullYear();
      const filterWeeks = list.filter(elem => {
        return validInt(elem.customersWeek.noYear) === validInt(currentYear);
      });
      const selectLastWeek = filterWeeks.at(-1);

      setYearList(yeList || []);
      setYearId(currentYear);
      setWeekList(filterWeeks);
      setWeekId(selectLastWeek.weekId);
    }, err => { console.warn(err) });

    setLoading(true);
    request.GET(`/viewQbkCustomers?customerId=${customerId}`, (resp) => {
      const qbkAccounts = resp.data.map((item) => {
        return {
          id: item.quickbookCompanyId,
          value: item.quickbookCompanyId,
          label: item.quickbookCompanyName
        }
      });

      setListQbAccounts(qbkAccounts);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    setLoading(true);
    request.GET(`/customersQuickbook?customerId=${customerId}`, (resp) => {
      setListCustomerOnQbk(resp.qbkCustomers);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }, [customerId]);

  useEffect(() => {
    const filterWeeks = allWeeks.filter(elem => {
      return validInt(elem.customersWeek.noYear) === validInt(yearId)
    });
    setWeekList(filterWeeks);
    setWeekId(0);
  }, [yearId]);

  useEffect(() => {
    if (validInt(weekId) === 0) return;
    setLoading(true)
    setLocationList([]);
    setProjectList([]);
    setProjectMTList([]);
    setLocationSelected([]);
    setProjectSelected([]);
    setProjectMTSelected([]);
    request.GET(`/weeklyPayrollsDetails/customerWeekLocations?customerId=${customerId}&weekId=${weekId}`, resp => {
      const { locationWorks } = resp;
      const list = locationWorks.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = true;
        return acc;
      }, {});
      setLoading(false);
      setLocationList(list);
      fnLocationsChange(list, weekId);
    }, err => {
      setLoading(false);
      console.warn(err);
    });
  }, [weekId]);


  const fnLocationsChange = (locations) => {
    const locationSelected = Object.keys(locations).reduce((acc, key) => {
      if (locations[key].selected) {
        acc.push(locations[key].id);
      }
      return acc;
    }, []);
    setLocationSelected(locationSelected);
    setProjectSelected([]);
    setProjectMTSelected([]);
    setProjectList([]);
    setProjectMTList([]);

    let data = { customerId, weekId: weekId, locationId: locationSelected };
    setLoading(true);
    request.POST('/weeklyPayrollsDetails/customerWeekProjects', data, resp => {
      setLoading(false);
      const { weekProjects, missingProjects } = resp;
      let projects = weekProjects.map(elem => {
        return { id: elem.id, name: `${elem.code} - ${elem.name}` };
      });
      let projectsMissing = missingProjects.map(elem => {
        return { id: elem.id, name: `${elem.code} - ${elem.name}` };
      });
      const projectList = projects.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = true;
        return acc;
      }, {});
      const projectMTList = projectsMissing.reduce((acc, cur) => {
        acc[cur.name] = cur;
        acc[cur.name].selected = true;
        return acc;
      }, {});
      setProjectList(projectList);
      setProjectMTList(projectMTList);

      const projectSelected = Object.keys(projectList).reduce((acc, key) => {
        if (projectList[key].selected) {
          acc.push(projectList[key].id);
        }
        return acc;
      }, []);
      const projectMTSelected = Object.keys(projectMTList).reduce((acc, key) => {
        if (projectMTList[key].selected) {
          acc.push(projectMTList[key].id);
        }
        return acc;
      }, []);
      setProjectSelected(projectSelected);
      setProjectMTSelected(projectMTSelected);
    }, err => {
      setLoading(false);
      console.warn(err);
    });
  };

  const fnProjectsChange = (list) => {
    const select = Object.keys(list).reduce((acc, key) => {
      if (list[key].selected) {
        acc.push(list[key].id);
      }
      return acc;
    }, []);
    setProjectSelected(select);
  };

  const fnProjectsMissingChange = (list) => {
    const select = Object.keys(list).reduce((acc, key) => {
      if (list[key].selected) {
        acc.push(list[key].id);
      }
      return acc;
    }, []);
    setProjectMTSelected(select);
  };

  const propsToAccordionLocation = {
    list: locationList,
    setList: setLocationList,
    listSelected: locationSelected,
    setListSelected: setLocationSelected,
    fnOptionsChange: fnLocationsChange,
    title: t("table.common.projectLocation"),
    t: t
  };

  const propsToAccordionProjects = {
    list: projectList,
    setList: setProjectList,
    listSelected: projectSelected,
    setListSelected: setProjectSelected,
    fnOptionsChange: fnProjectsChange,
    title: t('table.common.projects'),
    t
  };

  const propsToAccordionMTProjects = {
    list: projectMTList,
    setList: setProjectMTList,
    listSelected: projectMTSelected,
    setListSelected: projectMTSelected,
    fnOptionsChange: fnProjectsMissingChange,
    title: t('dialog.missingtimes.checkGenerateInvoice'),
    t
  };

  const fnGetInvoiceList = () => {
    if (optCreate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    const data = {
      customerId: validInt(customerId),
      weekId: validInt(weekId),
      projectList: projectSelected,
      projectMissing: projectMTSelected,
      invoiceMissingtime: 0
    };

    const filterWeeks = weekList.find(item => item.value === weekId);
    data.weekSelect = filterWeeks.label;

    setParamsFilter(data);

    setTableData([]);
    setLoading(true);
    request.POST("/weeklyPayrollsDetails/getInvoicesList", data, resp => {
      setLoading(false);
      const { totals, invoices } = resp;
      const data = invoices.map((item, idx) => {
        return {
          id: item.isMissingTime ? `mt-${item.id}` : item.id,
          idProject: item.id,
          orderCode: `${idx}`,
          projectIcon: item.code + " - " + item.name,
          projectName: item.code + " - " + item.name,
          location: item.location?.name || '',
          regularHours: item.regularHours,
          overtimeHours: item.overtimeHours,
          subTotal: roundTwoDecimals(item.subTotal),
          amountDiscount: roundTwoDecimals(item.amountDiscount),
          total: roundTwoDecimals(item.total),
          customerId: item.customer.id,
          customerName: item.customer.name,
          isMissingTime: item.isMissingTime,
          projectList: [...item.projectList],
          jobReference: item.jobReference,
          jobPo: item.jobPo || '',
          hasPerDiems: item.hasPerDiems || false
        };
      });
      setTableData(data);
      setInvoiceTotal(totals || {});
      setDataPerdiems(resp.listPerdiem);
      fnMenuOptions();

    }, err => {
      setLoading(false)
      setTableData([]);
      console.warn(err)
    });
  }

  const fnOkUpdatePayrollRates = () => {
    if (optUpdate === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if (validInt(customerId) === 0 || validInt(weekId) === 0 || projectSelected.length <= 0 || locationSelected.length <= 0) {
      return;
    }

    const data = {
      customerId,
      customerWeekId: weekId,
      projectSelected,
      locationSelected
    }

    request.PUT('/weeklyPayrollsDetails/updateInvoiceRates', data, resp => {
      const { messages } = resp;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      const data = resp.data.map((item, idx) => {
        item.id = idx;
        return item;
      });
      setLoading(false);
      setDataRatesUpdated(data);
      fnGetInvoiceList();
      setOpenViewUpdateRates(true);
    }, err => {
      const { messages } = err;
      if (messages?.length > 0) {
        messages.map(elem => {
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  return {
    customerList,
    yearList,
    weekList,
    locationList,
    projectList,
    projectMTList,
    customerId,
    setCustomerId,
    yearId,
    setYearId,
    weekId,
    projectSelected,
    setWeekId,
    propsToAccordionLocation,
    propsToAccordionProjects,
    propsToAccordionMTProjects,
    fnGetInvoiceList,
    fnOkUpdatePayrollRates
  }
}
