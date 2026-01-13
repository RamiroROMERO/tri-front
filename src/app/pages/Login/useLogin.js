import { useEffect, useState } from 'react'
import { getAssetPath } from 'app/utils/appHelpers';
import { resolvePath, useNavigate } from 'react-router-dom';
import { ASSET_IMAGES } from "../../utils/constants/paths";
import { LAYOUT_NAMES } from "../../layouts/layouts";
import { useJumboApp } from "@jumbo/hooks";
import { request } from 'app/utils/core';
import { useForm } from 'app/hooks';
import { useDispatch } from 'react-redux';
import { onEditCompanyData } from 'app/redux/actions';
import { validInt } from 'app/utils/helpers';
import { LoginEmployeeModal } from './LoginEmployeeModal';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { Key } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';


const companyList = [{
  "id": 1,
  "value": 1,
  "name": "Techsource",
  "label": "Techsource",
  "fullName": "Techsource Specialized Services",
  "image": "images/companies/techsource",
  "port": "3001"
}, {
  "id": 2,
  "value": 2,
  "name": "Galpa",
  "label": "Galpa",
  "image": "images/companies/galpa",
  "fullName": "GALPA Construction LLC",
  "port": "3002"
}, {
  "id": 3,
  "value": 3,
  "name": "NextGen",
  "label": "NextGen",
  "image": "images/companies/nextgen",
  "fullName": "NextGen Communications Construction",
  "port": "3003"
}];

const moduleList = [{
  "id": 1,
  "value": 1,
  "name": "Payroll",
  "textId": "payroll-control",
  "label": "Payroll"
}, {
  "id": 2,
  "value": 2,
  "name": "Inventory",
  "textId": "inventory-control",
  "label": "Inventory"
}];

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState('');
  // const [moduleList, setModuleList] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeSelected, setEmployeeSelected] = useState({});
  const [openLoginEmployee, setOpenLoginEmployee] = useState(false);
  const [hasLoading, setHasLoading] = useState(false);

  const { setActiveLayout } = useJumboApp();
  const [defaultUser, setDefaultUser] = useState(JSON.parse(localStorage.getItem('mw-user-saved')));

  const { formState, onInputChange, onBulkForm } = useForm({
    companyId: 2,
    moduleId: 1,
    userName: '',
    userPass: '',
    userRemember: false
  });

  localStorage.removeItem('mw-user-data');
  localStorage.removeItem('mw-company-data');

  const onUserNameChange = ({ target }) => {

    const { value } = target;

    onInputChange({ target: { name: 'userName', value } });
    setLoginError("");

  }

  const onUserPasswordChange = ({ target }) => {

    const { value } = target;

    onInputChange({ target: { name: 'userPass', value } });

    setLoginError("");

  }

  // const fnGetCompanyList = ()=>{
  //   request.GET('/getCompanyList', (resp)=>{
  //     const {data} = resp;
  //     const newData = data.map(elem=>{
  //       elem.name = elem.name2
  //       delete elem.name2;
  //       return elem;
  //     });
  //     setCompanyList(newData);
  //   }, (err)=>{
  //   })
  // }

  const fnOnChangeCompanyId = (e) => {
    const companyId = e.target.value;
    // if(validInt(companyId)===0){
    //   setModuleList([]);
    //   return;
    // }
    // request.GET(`/getModuleList?companyId=${companyId}`,(resp)=>{
    //   const {data} = resp;
    //   setModuleList(data);
    // }, (err)=>{
    //   setModuleList([]);
    // });

    onBulkForm({ companyId });
  }
  const fnGetEmployeeData = () => {
    request.GET('/employeeForLogin', resp => {
      const { data } = resp;
      setEmployeeData(data);
    }, err => {
      setEmployeeData([]);
      console.warn(err);
    })
  }

  const fnLoginEmployee = (row) => {
    setEmployeeSelected(row);
    setOpenLoginEmployee(true);
  }

  const table = {
    title: t("table.activeEmployees.title"),
    columns: [
      { field: 'name', headerName: t('table.dailiesPayrolls.column.employeeName'), flex: 1 },
      { field: 'classificationName', headerName: t('table.employees.column.classificationName'), flex: 0.4 },
      {
        field: 'actions',
        type: 'actions',
        headerName: t("table.common.actions"),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            icon={<Key />}
            label={t("action.key")}
            onClick={() => fnLoginEmployee(row)}
            color='info'
          />
        ],
      }
    ],
    data: employeeData,
    options: {
      pageSize: 10,
      rowsPerPageOptions: [5, 10, 15, 20],
      // pagination: true,
      // checkboxSelection: false
    }
  };


  useEffect(() => {
    if (defaultUser?.userName) {
      onBulkForm({ userName: defaultUser.userName, userRemember: true });
    };
    setActiveLayout(LAYOUT_NAMES.SOLO_PAGE);
    // fnGetCompanyList();
    // fnGetEmployeeData();
  }, [])

  const fnLogin = (e) => {

    e.preventDefault();

    const { userName, userPass, moduleId, userRemember } = formState;

    setLoginError("");

    if (userName === "" || userPass === "") {
      setLoginError("User or Password is empty");
      return;
    }
    // if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userName)){
    //   setLoginError("Invalid email address");
    //   return;
    // }
    setHasLoading(true);

    request.POST('/login', { userName, pass: userPass, moduleId }, (resp) => {

      const { user: dataUser, token } = resp;
      const { modules } = dataUser;
      const privilegesUser = modules.find(elem => elem.id = moduleId).privileges;

      // const dataCompany = resp.dataCompany;
      const dataCompany = {
        "id": 2,
        "name": "Galpa",
        "fullName": "Galpa Construction LLC",
        "image": "images/companies/techsource",
        "port": "3001"
      };
      const myImage = dataUser.img ? dataUser.img.split('/')[dataUser.img.split('/').length - 1] : "default.png";
      const userData = {
        token,
        id: dataUser.id,
        name: dataUser.name,
        email: dataUser.email,
        changePass: dataUser.changePass,
        module: moduleList.find(elem => elem.id === moduleId),
        privileges: privilegesUser,
        image: getAssetPath(`${ASSET_IMAGES}/avatar/${myImage}`)
      };

      if (userRemember) {
        localStorage.setItem('mw-user-saved', JSON.stringify({ userName }));
      } else {
        localStorage.removeItem('mw-user-saved');
      }

      setHasLoading(false);

      localStorage.setItem('mw-user-data', JSON.stringify(userData));
      localStorage.setItem('mw-company-data', JSON.stringify(dataCompany));
      dispatch(onEditCompanyData(dataCompany));
      navigate('/', {
        replace: true,
      });
    }, (err) => {
      const { messages } = err;
      setHasLoading(false);
      if (messages) {
        messages.map(elem => {
          setLoginError(elem.message);
          return elem;
        });
      }
    })
  }

  const propsModalForEmployeeLogin = {
    title: 'login.modal.employee',
    DialogContent: LoginEmployeeModal,
    setOpen: setOpenLoginEmployee,
    open: openLoginEmployee,
    data: {
      rowSelected: employeeSelected

    }
  }

  return {
    fnLogin,
    formState,
    onInputChange,
    loginError,
    companyList,
    moduleList,
    employeeData,
    fnOnChangeCompanyId,
    table,
    hasLoading,
    openLoginEmployee,
    setOpenLoginEmployee,
    propsModalForEmployeeLogin,
    onUserNameChange,
    onUserPasswordChange
  }
}
