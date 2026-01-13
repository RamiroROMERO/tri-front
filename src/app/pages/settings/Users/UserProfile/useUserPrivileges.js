import React, { useEffect, useMemo, useState } from 'react'
import { Icon, Switch } from '@mui/material';
import { request } from 'app/utils/core';
import { useForm } from 'app/hooks';
import { validInt } from 'app/utils/helpers';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Delete, Edit, PlaylistAddCheck } from '@mui/icons-material';

export const useUserPrivileges = ({setLoading, userId, moduleId, sweetAlerts, t, currentItem, controlAdmin}) => {
  const [moduleName, setModuleName] = useState('');
  const [listPrivileges, setListPrivileges] = useState([]);
  const [dataPrivGeneral, setDataPrivGeneral] = useState([]);
  const [dataPrivAdmin, setDataPrivAdmin] = useState([]);
  const [filterListPrivileges, setFilterListPrivileges] = useState([]);
  const [listPrivSelected, setListPrivSelected] = useState([]);
  const [openModalPrivileges, setOpenModalPrivileges] = useState(false);
  const [openMsgChangeStatus, setOpenMsgChangeStatus] = useState(false);
  const [openMsgDeletePriv, setOpenMsgDeletePriv] = useState(false);
  const [openMsgAssignAllPriv, setOpenMsgAssignAllPriv] = useState(false);
  const [disableChecks, setDisableChecks] = useState(false);
  const [titleModalNew, setTitleModalNew] = useState('');

  const {formState: formStatePriv, formValidation, isFormValid, onInputChange: onInputChangePriv, onBulkForm, onResetForm} = useForm({
    id: 0,
    userId: userId,
    privilegeId: 0,
    status: true,
    optCreate: false,
    optUpdate: false,
    optDelete: false
  });

  const {id, privilegeId, optCreate, optUpdate, optDelete, status} = formStatePriv;

  const onStatusGenChange = e =>{
    const statusId = e.target.checked;

    if(statusId === true){
      onBulkForm({
        status: statusId
      });
      setDisableChecks(false);
    }else{
      onBulkForm({
        status: statusId,
        optCreate: false,
        optUpdate: false,
        optDelete: false
      });
      setDisableChecks(true);
    }
  }

  const fnPrivilgesUser = (filterPrivileges)=>{
    // filtrar privilegios por tipo
    let filterUserGeneralPriv = filterPrivileges[0].privileges.filter(item => {
      return item.type === 0
    });

    let filterUserAdminPriv = filterPrivileges[0].privileges.filter(item =>{
      return item.type === 1
    });

    // llenar tabla
    const dataGeneral = filterUserGeneralPriv.map((item) => {
      item.privilegeName = item.name
      item.statusIcon = item.status == 1 ? "check_box" : "check_box_outline_blank";
      item.optCreateIcon = item.optCreate === 1 ? "check_box" : "check_box_outline_blank";
      item.optUpdateIcon = item.optUpdate === 1 ? "check_box" : "check_box_outline_blank";
      item.optDeleteIcon = item.optDelete === 1 ? "check_box" : "check_box_outline_blank";
      return item;
    });

    const dataPriv = filterUserAdminPriv.map((item)=>{
      item.privilegeName = item.name
      item.statusIcon = item.status===1?true:false
      return item;
    });

    setDataPrivGeneral(dataGeneral);
    setDataPrivAdmin(dataPriv);
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

  const fnGetDataUserDetail = ()=>{
    setLoading(true);
    request.GET(`/modules?id=${moduleId}`, (resp)=>{
      const {modules} = resp;

      setModuleName(modules[0].name);

      const listPriv = modules[0].privileges.map((item)=>{
        item.checked = true
        return item;
      });

      request.GET(`/usersPrivileges/findOneUser?userId=${userId}`, (resp)=>{
        const {userPrivileges} = resp;
        // filtar privilegios por modulo seleccionado
        let filterPrivileges = userPrivileges.filter(item => {
          return item.id == moduleId;
        });

        // filtrar privilegios asignados al usuario
        fnPrivilgesUser(filterPrivileges);

        // filtrar los privilegios que aun no han sido asignados
        const privFiltered = filterPrivilegesList(listPriv, filterPrivileges[0].privileges);
        setListPrivileges(privFiltered);

        setLoading(false);
      }, (err)=>{
        console.warn(err);
        setLoading(false);
      });

      setLoading(false);
    }, (err)=>{
      console.warn(err);
      setLoading(false);
    });
  }

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

  const fnSavePrivileges = ()=>{
    if(id===0){
      if(listPrivSelected.length === 0){
        sweetAlerts('warning', t("warning.privilegesSelected"));
        return;
      }
    }

    const newData = {
      userId,
      privilegeList: [],
      privilegeId: 0,
      optCreate,
      optUpdate,
      optDelete,
      status
    }

    if(id===0){
      delete newData.privilegeId;
      newData.privilegeList = listPrivSelected

      setLoading(true);
      request.POST('/usersPrivileges', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataUserDetail();
        setOpenModalPrivileges(false);
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
      delete newData.privilegeList;
      newData.id = id;
      newData.privilegeId = privilegeId;

      setLoading(true);
      request.PUT('/usersPrivileges', newData, resp=>{
        const {messages} = resp;
        if(messages?.length>0){
          messages.map(elem=>{
            sweetAlerts(elem.type, t(elem.message));
          });
        }
        fnGetDataUserDetail();
        setOpenModalPrivileges(false);
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

  const fnNewPrivileges = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    onResetForm();
    setTitleModalNew("dialog.addPrivileges.title");
    setOpenModalPrivileges(true);
  }

  const fnEditGeneral = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    if(item.status===true || item.status===1){
      setDisableChecks(false);
    }else{
      setDisableChecks(true);
    }
    onBulkForm(item);
    setTitleModalNew("dialog.editPrivileges.title");
    setOpenModalPrivileges(true);
  }

  const fnDeletePrivilege = (item)=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    onBulkForm({id: item.id});
    setOpenMsgDeletePriv(true);
  }

  const fnOnOkDeletePrivilege = ()=>{
    setLoading(true);
    request.DELETE(`/usersPrivileges`, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetDataUserDetail();
      setLoading(false);
    }, err=>{
      const {messages} = err;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      setLoading(false);
    },{id});
  }

  const onStatusChange = (e, id, privilegeId) =>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    const valueStatus = e.target.checked;

    onBulkForm({id, status: valueStatus, privilegeId});
    setOpenMsgChangeStatus(true);
  }

  const fnOkChangeStatus = ()=>{
    const newData = {
      id,
      userId,
      privilegeId,
      status
    }

    setLoading(true);
    request.PUT('/usersPrivileges', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetDataUserDetail();
      setOpenModalPrivileges(false);
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

  const fnAssignAllPrivilege = ()=>{
    if (controlAdmin.status === 0) {
      sweetAlerts('warning', t("alertMessages.warning.unauthorizedUser"));
      return;
    }
    setOpenMsgAssignAllPriv(true);
  }

  const fnOkAssignAllPrivilege = ()=>{
    const newData = {
      userId,
      userTypeId: currentItem.type
    }
    request.POST('/usersPrivileges/asignPrivileges', newData, resp=>{
      const {messages} = resp;
      if(messages?.length>0){
        messages.map(elem=>{
          sweetAlerts(elem.type, t(elem.message));
        });
      }
      fnGetDataUserDetail();
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

  const tableGeneral = {
    title: "",
    columns: [
      {field: 'privilegeName', headerName: t('table.privileges.title'), flex: 1 },
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'optCreateIcon', headerName: t('table.users.detail.optCreate'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'optUpdateIcon', headerName: t('table.users.detail.optUpdate'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {field: 'optDeleteIcon', headerName: t('table.users.detail.optDelete'), flex: 0.5,
        renderCell: ({row, field})=>{
          return (<Icon>{row[field]}</Icon>)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Edit />}
            label={t("button.edit")}
            onClick={() => fnEditGeneral(row)}
            color='info'
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeletePrivilege(row)}
            color='error'
          />
        ],
      }
    ],
    data: dataPrivGeneral,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [
      {
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewPrivileges
      },
      {
        Icon: () => <PlaylistAddCheck />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnAssignAllPrivilege
      }
    ]
  };

  const tableAdmin = {
    title: "",
    columns: [
      {field: 'privilegeName', headerName: t('table.privileges.title'), flex: 1},
      {field: 'statusIcon', headerName: t('table.common.status'), flex: 0.3,
        renderCell: ({row, field, id})=>{
          return (
          <Switch
            id={'switch-' + id}
            checked={row[field]}
            onChange={(e)=>onStatusChange(e,id,row.privilegeId)}
            inputProps={{'aria-label': 'controlled'}}
          />)
        }
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Delete />}
            label= {t("button.delete")}
            onClick={() => fnDeletePrivilege(row)}
            color='error'
          />
        ],
      }
    ],
    data: dataPrivAdmin,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [10, 20, 30, 50]
    },
    freeActions: [
      {
        Icon: () => <Add />,
        label: t("datatable.buttons.newDocument"),
        onClick: fnNewPrivileges
      }
    ]
  };

  useEffect(()=>{
    fnGetDataUserDetail();
  },[moduleId]);

  return (
    {
      formStatePriv,
      moduleName,
      tableGeneral,
      tableAdmin,
      openModalPrivileges,
      setOpenModalPrivileges,
      listPrivileges,
      onInputChangePriv,
      onPrivilegeChange,
      filterListPrivileges,
      fnSavePrivileges,
      setFilterListPrivileges,
      fnChangePrivilegesSel,
      openMsgChangeStatus,
      setOpenMsgChangeStatus,
      fnOkChangeStatus,
      openMsgDeletePriv,
      setOpenMsgDeletePriv,
      fnOnOkDeletePrivilege,
      openMsgAssignAllPriv,
      setOpenMsgAssignAllPriv,
      fnOkAssignAllPrivilege,
      onStatusGenChange,
      disableChecks,
      titleModalNew
    }
  )
}
