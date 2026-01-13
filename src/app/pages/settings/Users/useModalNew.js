import { Switch } from '@mui/material';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';
import { useEffect } from 'react';
import { useState } from 'react';

export const useModalNew = ({t, sweetAlerts, setLoading, fnGetData, setOpen, currentItem}) => {
  const [sendForm, setSendForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [statusCustomer, setStatusCustomer] = useState(false);
  const [openMsgChangeStatus, setOpenMsgChangeStatus] = useState(false);
  const [disabledPanel2, setDisabledPanel2] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [listCustomersToShow, setListCustomersToShow] = useState([]);
  const [listAllCustomers, setListAllCustomers] = useState([]);
  const [currentItemCust, setCurrentItemCust] = useState({});
  const [titleMsgChangeStatus, setTitleMsgChangeStatus] = useState('');

  const formValidations = {
    name: [(val) => val.length >= 4, t("alertMessages.warning.nameValid")],
    userName: [(val) => val.length >= 4, t("alertMessages.warning.userName")],
    type: [(val) => validInt(val) !== 0, t("alertMessages.warning.type")]
  }

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    name: currentItem.name?currentItem.name:'',
    userName: currentItem.userName?currentItem.userName:'',
    email: currentItem.email?currentItem.email:'',
    type: currentItem.type?currentItem.type:0,
    defaultCustomer: currentItem?.defaultCustomer || 0,
    status: currentItem.status?currentItem.status:true
  }, formValidations);

  const {id, name, userName, email, type, defaultCustomer, status} = formState;

  const table = {
    title: '',
    columns: [
      {field: 'customerName', headerName: t('table.common.customer'), flex: 1.5},
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
        renderCell: ({row, field, id})=>{
          return (
          <Switch
            id={'switch-' + id}
            checked={row[field]}
            onChange={(e)=>onStatusChange(e,row)}
            inputProps={{'aria-label': 'controlled'}}
          />)
        }
      },
    ],
    data: tableData,
    options: {
      pageSize: 5,
      rowsPerPageOptions: [5, 10, 15, 20]
    }
  };

  const fnSave = ()=>{
    setSendForm(true);

    if (!isFormValid) {
      sweetAlerts('error', t("alertMessages.warning.missingData"));
      return;
    }

    const newData = {
      id,
      name,
      userName,
      email,
      type,
      defaultCustomer,
      status
    }

    setLoading(true);
    if(validInt(id)===0){
      request.POST('/users', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setOpen(false);
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      })
    }else{
      request.PUT('/users', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetData();
        setSendForm(false);
        setLoading(false);
      }, err=>{
        const {messages} = err;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        setLoading(false);
      });
    }
  }

  const onStatusChange = (e, row) =>{
    const valueStatus = e.target.checked;

    setTitleMsgChangeStatus(valueStatus===true?'component.sweetAlert.question.enableCustomer':'component.sweetAlert.question.disableCustomer');

    setCurrentItemCust(row);
    setStatusCustomer(valueStatus)
    setOpenMsgChangeStatus(true);
  }

  const onCustomerChange = e=>{
    const custId = e.target.value;
    setCustomerId(custId);
  }

  const fnOkChangeStatus = ()=>{

    const newData = {
      id: currentItemCust.id,
      status: statusCustomer
    }

    setLoading(true);
    request.PUT(`/usersCustomers/${currentItemCust.id}`, newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetCustomers(listAllCustomers);
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    });
  }

  const filterCustomerList = (array1, array2) => {
    let filterArr = array1.filter(item => {
      let finding = array2.filter(item2 => {
        return item2.customerId === item.id
      });
      return finding.length === 0 ? true : false;
    });
    return filterArr
  }

  const fnGetCustomers = (customerList)=>{
    setLoading(true);
    request.GET(`/usersCustomers?userId=${currentItem.id}`, (resp)=>{
      const data = resp.data.map((item)=>{
        item.customerName = item.customer?.name || ''
        item.statusIcon = (item.status===1 || item.status===true)?true:false
        return item
      });

      const customerListFiltered = filterCustomerList(customerList, data);
      setListCustomersToShow(customerListFiltered);

      setTableData(data);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

  const fnAddCustomer = ()=>{

    if (customerId===0) {
      sweetAlerts('error', t("alertMessages.warning.customerId"));
      return;
    }

    const newData = {
      userId: currentItem.id,
      customerId,
      status: 1
    }

    setLoading(true);
    request.POST('/usersCustomers', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }

      const listFiltered = filterCustomerList(listAllCustomers, [...tableData, newData]);
      setListCustomersToShow(listFiltered);
      fnGetCustomers(listFiltered);
      setCustomerId(0);
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    })
  }

  useEffect(()=>{
    setLoading(true);
    request.GET(`/customers/getSL?active=1`, (resp)=>{
      const customers = resp.customers.map((item)=>{
        return {
          value: item.id,
          label: item.name,
          id: item.id
        }
      });
      setListAllCustomers(customers);
      fnGetCustomers(customers);
      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  },[]);

  useEffect(()=>{
    if((defaultCustomer===1 || defaultCustomer===true) && id>0){
      setDisabledPanel2(false);
    }else{
      setDisabledPanel2(true);
    }
  },[defaultCustomer]);

  const propsToModalConfirm = {
    open: openMsgChangeStatus,
    setOpen: setOpenMsgChangeStatus,
    message: titleMsgChangeStatus,
    onSuccess: fnOkChangeStatus
  }

  return (
    {
      formState,
      onInputChange,
      fnSave,
      isFormValid,
      formValidation,
      sendForm,
      activeTab,
      setActiveTab,
      titleMsgChangeStatus,
      table,
      customerId,
      listCustomersToShow,
      onCustomerChange,
      fnAddCustomer,
      propsToModalConfirm,
      disabledPanel2
    }
  )
}
