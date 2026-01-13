import { useState } from 'react';
import { useForm } from 'app/hooks';
import { request } from 'app/utils/core';
import { validInt } from 'app/utils/helpers';

export const useModalNewPrivilege = ({t, sweetAlerts, setLoading, fnGetDataPrivileges, setOpen, currentItem, listPrivileges, listUserTypePrivileges, typePrivilege}) => {
  const [filterListPrivileges, setFilterListPrivileges] = useState([]);
  const [listPrivSelected, setListPrivSelected] = useState([]);

  const {formState, formValidation, isFormValid, onInputChange, onBulkForm, onResetForm} = useForm({
    id: currentItem.id?currentItem.id:0,
    userTypeId: currentItem.userTypeId?currentItem.userTypeId:0,
    privilegeId: currentItem.privilegeId?currentItem.privilegeId:0,
    optCreate: currentItem.id?currentItem.optCreate:false,
    optUpdate: currentItem.id?currentItem.optUpdate:false,
    optDelete: currentItem.id?currentItem.optDelete:false,
    isAdmin: 0
  });

  const {id, userTypeId, privilegeId, optCreate, optUpdate, optDelete} = formState;

  const fnChangePrivilegesSel = (list) => {
    const privilegesSelected = list.reduce((acc, cur) =>{
      if(cur.checked === true){
        acc.push(cur.id);
      }
      return acc;
    },[]);
    setListPrivSelected(privilegesSelected);
  }

  const onPrivilegeChange = e =>{
    const list = filterListPrivileges.map((item) =>{
      if(validInt(e.target.id) === item.id){
        item.checked = !item.checked;
      }
      return item;
    });
    fnChangePrivilegesSel(list);
  }

  const filterPrivilegesList = (array1, array2) => {
    let filterArr = array1.filter(item => {
      let finding = array2.filter(item2 => {
        return item2.privilegeId === item.id
      });
      return finding.length === 0 ? true : false;
    });
    return filterArr
  }

  const onTypeUserChange = e =>{
    const type = e.target.value;
    onBulkForm({userTypeId: type});

    if (type > 0){
      // filtrar los privilegios por tipo de usuario
      let filterPrivTypeUser = listUserTypePrivileges.filter(item => {
        return item.userTypeId === type;
      });

      // filtrar los privilegios que aun no han sido asignados
      const privilegesListFiltered = filterPrivilegesList(listPrivileges, filterPrivTypeUser);

      // filtrar los privilegios por tipo
      const filterPrivType = privilegesListFiltered.filter((item) =>{
        return item.type === validInt(typePrivilege);
      });

      setFilterListPrivileges(filterPrivType);
      fnChangePrivilegesSel(filterPrivType);
    }else{
      setFilterListPrivileges([]);
      fnChangePrivilegesSel([]);
    }
  }

  const fnSavePrivileges = ()=>{
    if(id===0){
      if(listPrivSelected.length === 0){
        sweetAlerts('warning', t("warning.privilegesSelected"));
        return;
      }
    }

    let newData = [];

    if(id===0){
      for (let i = 0; i < listPrivSelected.length; i++) {
        newData.push({
          'userTypeId': userTypeId, 'privilegeId': listPrivSelected[i], 'optCreate': optCreate, 'optUpdate': optUpdate,
          'optDelete': optDelete, 'isAdmin': typePrivilege
        });
      }

      setLoading(true);
      request.POST('/usersTypesPrivileges/createMany', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataPrivileges();
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
      });
    }else{
      newData = {
        id,
        userTypeId,
        privilegeId,
        optCreate,
        optUpdate,
        optDelete,
        isAdmin: typePrivilege
      }

      setLoading(true);
      request.PUT('/usersTypesPrivileges', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataPrivileges();
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
      });
    }
  }

  useState(()=>{
    setFilterListPrivileges([]);
    fnChangePrivilegesSel([]);
  },[]);

  return (
    {
      formState,
      onInputChange,
      onPrivilegeChange,
      onTypeUserChange,
      filterListPrivileges,
      fnSavePrivileges
    }
  )
}
