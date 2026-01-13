import { Icon } from '@mui/material';
import { request } from 'app/utils/core';
import { formatDateToShow, validInt } from 'app/utils/helpers';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

export const useProjects = ({ setLoading, setActions, adminControl }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [customerId, setCustomerId] = useState(localStorage.getItem('st-prj-customerId') || 0);
  const [customerName, setCustomerName] = useState('');
  const [yearId, setYearId] = useState(currentYear);
  const [noRecords1, setNoRecords1] = useState(0)
  const [noRecords2, setNoRecords2] = useState(0)
  const [noRecords3, setNoRecords3] = useState(0)
  const [listYears, setListYears] = useState([]);
  const [listCustomers, setListCustomers] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [listLocations, setListLocations] = useState([]);
  const [dataLocations, setDataLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openModalLocations, setOpenModalLocations] = useState(false);

  const [weekId, setWeekId] = useState(0);
  const [openModalProjectsWithoutHours, setOpenModalProjectsWithoutHours] = useState(false);
  const enableProjectsWithoutHours = adminControl.find(ctrl => ctrl.privilegeId === 40)?.status || 0;
  const [listWeeksWorked, setListWeeksWorked] = useState([]);

  const onYearChange = e => {
    const year = e.target.value;
    setYearId(year);
    fnGetListCustomers(year);
    fnGetProjects(customerId, year);
  }

  const fnGetListCustomers = (year = yearId) => {
    setLoading(true);
    request.GET(`/projects/getByCustomer?year=${year}`, (resp) => {
      const customerList = resp.projectsByCustomers.map((item) => {
        return {
          id: item.customerId,
          value: item.customerId,
          name: item.customer.name,
          label: item.customer.name,
          qty: item.projectsQty,
          status: item.customer.active,
          type: 'item'
        }
      });

      const newList = [];
      const filterActives = customerList.filter(item => item.status === 1);
      const filterInactives = customerList.filter(item => item.status === 0);

      resp.inactiveCustomers.map(elem => {
        if (validInt(elem.active) === 1) {
          filterActives.push({ id: elem.id, name: elem.name, value: elem.id, label: elem.name, qty: 0, status: 1, type: 'item' })
        }
        return elem;
      });

      newList.push({ id: -1, name: 'Clientes Activos', type: 'title' });
      newList.push(...filterActives)
      newList.push({ id: -2, name: 'Clientes Inactivos', type: 'title' });
      newList.push(...filterInactives);

      const initialCustomerId = localStorage.getItem('st-prj-customerId');
      setCustomerId(validInt(initialCustomerId) > 0 ? validInt(initialCustomerId) : newList[1].id);
      setListCustomers(newList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnGetProjects = (idCustomer, year = yearId, status = 0) => {
    setCustomerId(idCustomer);
    setTableData([]);
    setNoRecords1(0);
    setNoRecords2(0);
    setNoRecords3(0);
    setCustomerName('');
    const urlGet = status === 0 ? `/projects?year=${year}&customerId=${idCustomer}` : `/projects?year=${year}&customerId=${idCustomer}&statusId=${status}`;

    setLoading(true);
    request.GET(urlGet, (resp) => {
      let noStatus1 = 0, noStatus2 = 0, noStatus3 = 0;
      const projects = resp.projects.map((item) => {
        if (item.statusId === 1) {
          noStatus1++;
        } else if (item.statusId === 2) {
          noStatus2++;
        } else {
          noStatus3++;
        }
        item.locationName = item.location?.name || '';
        item.qtyWeeks = item.weeksWork?.qtyWeeks || 0;
        item.statusName = item.status.name;
        return item;
      });
      setCustomerName(projects[0].customer.name);

      const status = resp.statusList.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      });

      setNoRecords1(noStatus1);
      setNoRecords2(noStatus2);
      setNoRecords3(noStatus3);

      setTableData(projects);
      setListStatus(status);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnGetLocations = () => {
    setLoading(true);
    request.GET('/locations', (resp) => {
      const locations = resp.locations.map((item) => {
        item.value = item.id
        item.label = item.name
        item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank"
        return item;
      });

      const filter = locations.filter(item => item.status === 1);

      setListLocations(filter);
      setDataLocations(locations);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnShowProjectsWithoutHours = () => {
    if(enableProjectsWithoutHours===0){
      return;
    }
    if (customerId === 0) {
      sweetAlerts('error', t("alertMessages.warning.customerId"));
      return;
    }

    if (yearId === 0) {
      sweetAlerts('error', t("alertMessages.warning.yearValid"));
      return;
    }

    setLoading(true);
    request.GET(`/weeklyPayrollsDetails/customerWeeksWorks?customerId=${customerId}`, (resp) => {
      const weeksWorks = resp.weeksWorks.map((item) => {
        return {
          id: item.weekId,
          value: item.weekId,
          label: `#${item.customersWeek.noWeek} WEEK OF ${formatDateToShow(item.customersWeek.startDate)} TO ${formatDateToShow(item.customersWeek.endDate)}`,
          noYear: item.customersWeek?.noYear || '',
          startDate: item.customersWeek?.startDate || '',
          endDate: item.customersWeek?.endDate || '',
          noWeek: item.customersWeek?.noWeek || ''
        }
      });

      const filterWeeks = weeksWorks.filter(item => item.noYear === currentYear);

      const selectLastWeek = filterWeeks.at(-1);

      setListWeeksWorked(filterWeeks);
      setWeekId(selectLastWeek.id);

      setOpenModalProjectsWithoutHours(true);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });
  }

  const fnMenuOptions = () => {
    let actions = [
      { icon: () => <Icon>add_location_alt</Icon>, name: 'table.common.addProjectLocation', onClick: () => { setOpenModalLocations(true) }},
      // { icon: () => <Icon>hourglass_disabled</Icon>, name: 'button.projectsWithoutHours', onClick: fnShowProjectsWithoutHours }
    ];
    setActions(actions)
  }

  useEffect(() => {
    setLoading(true);
    request.GET('/setWeekYear/getYears', (resp) => {
      const filterList = resp.yearsWeeks.filter((item) => {
        return item.year !== null
      });
      const yearsList = filterList.map((item) => {
        return {
          value: item.year,
          label: item.year
        }
      });
      setListYears(yearsList);
      setLoading(false);
    }, (err) => {
      console.warn(err);
      setLoading(false);
    });

    fnGetListCustomers();
    fnGetLocations();
    fnMenuOptions();
  }, []);

  useEffect(() => {
    if (customerId === 0) {
      return;
    }
    localStorage.setItem('st-prj-customerId', customerId);
    fnGetProjects(customerId);
  }, [customerId]);

  useEffect(() => {
    const initialCustomerId = localStorage.getItem('st-prj-customerId');
    if (!initialCustomerId) return;
    setCustomerId(validInt(initialCustomerId));
  }, [])

  return (
    {
      t,
      yearId,
      customerId,
      customerName,
      noRecords1,
      noRecords2,
      noRecords3,
      tableData,
      weekId,
      listYears,
      listCustomers,
      listStatus,
      listLocations,
      listWeeksWorked,
      dataLocations,
      openModalProjectsWithoutHours,
      setOpenModalProjectsWithoutHours,
      setWeekId,
      onYearChange,
      fnGetProjects,
      fnGetListCustomers,
      fnGetLocations,
      openModalLocations,
      setOpenModalLocations
    }
  )
}
