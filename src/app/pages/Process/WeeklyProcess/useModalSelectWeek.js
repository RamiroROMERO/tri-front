import { useForm } from 'app/hooks';
import { formatDateToShow, validInt } from 'app/utils/helpers';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useModalSelectWeek = ({t, sweetAlerts, listWeeks, currentItem}) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [sendForm, setSendForm] = useState(false);
  const [filterWeeksYear, setFilterWeeksYear] = useState([]);

  const formValidations = {
    year: [(val) => validInt(val) !== 0, t("alertMessages.warning.yearValid")],
    weekId: [(val) => validInt(val) !== 0, t("alertMessages.warning.noWeek")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    year: currentYear,
    weekId: 0,
    startDate: '',
    endDate: ''
  }, formValidations);

  const {year, weekId, startDate, endDate, status} = formState;

  const onYearChange = e => {
    const year = e.target.value;
    onBulkForm({year: year, weekId: 0});
  }

  const onWeekChange = e => {
    const week = e.target.value;

    const filter = listWeeks.find(item => item.value === week);
    onBulkForm({
      weekId: week,
      startDate: filter?formatDateToShow(filter.startDate):'',
      endDate: filter?formatDateToShow(filter.endDate):''
    });
  }

  const fnViewEnterHours = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const filterWeeks = listWeeks.find(item => item.value === weekId);

    let pathToReturn = '/process/weeklyProcess'
    delete currentItem.statusIcon;

    const data = {
      customerData: currentItem,
      weekId,
      weekData: filterWeeks,
      pathToReturn
    }

    navigate(`/process/weeklyProcess/dailyPayroll`, {
      replace:true,
      state: data
    });
  }

  useEffect(()=>{
    const filter = listWeeks.filter(item => item.noYear === year);
    setFilterWeeksYear(filter);
  },[year]);

  return (
    {
      formState,
      isFormValid,
      formValidation,
      sendForm,
      filterWeeksYear,
      onInputChange,
      onYearChange,
      onWeekChange,
      fnViewEnterHours
    }
  )
}
