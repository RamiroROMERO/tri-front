import { Alert, Button, DialogActions, DialogContent, Grid, Typography } from '@mui/material'
import { InputBox } from 'app/components';
import { request } from 'app/utils/core';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginEmployeeModal = (props) => {
  
  const {t, data} = props;
  const { rowSelected} = data;
  const navigate = useNavigate();
  const [emailEmp, setEmailEmp] = useState('');
  const [password, setPassword] = useState("");
  const [statusSend, setStatusSend] = useState("");
  const [statusLogin, setStatusLogin] = useState("");
  const [sendPass, setSendPass] = useState(0);

  const fnSendEmail = ()=>{

    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailEmp)){
      setStatusSend("Invalid email address");
      return;
    }
    setStatusSend('Sending...');
    const {id, name} = rowSelected;
    const data = {
      employeeId:id,
      email:emailEmp,
      employeeName: name
    };
    request.POST('/sendEmailEmployee',data, resp=>{
      setSendPass(1);
      setStatusSend("success");
    }, err=>{
      setSendPass(0);
      setStatusSend("error");
    });

  }

  const fnLoginEmployee = ()=>{
    setStatusSend("");
    setStatusLogin("Please wait...");
    const data = {email: emailEmp, pass: password};
    request.POST('/loginEmployee', data, resp=>{
      navigate('/employeeProfile', {
        replace:true, state:{employeeSelected:resp?.data?.id||0}
      });
    }, err=>{
      setStatusLogin("Email or Password incorrect!");
    })
  };

  return (
    <>
      <DialogContent dividers>
        <Typography variant='h3' >
          {`Employee: ${rowSelected.name}`}
        </Typography>
        <Typography variant='subtitle2'>
          {t("login.modal.textInfoForEmployee")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputBox
              label={t('login.employee.email')}
              name="emailEmp"
              value={emailEmp}
              onChange = {({target})=>setEmailEmp(target.value)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" justifyContent="flex-end" alignItems="center">
          <Grid item style={{marginTop:'1rem'}}>
            <Button onClick={fnSendEmail} variant='contained' color='primary' > {t('login.modal.sendEmail')} </Button>
          </Grid>
        </Grid>
        {statusSend!=='' && (<Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity={statusSend=="success"?"info":"warning"}>{statusSend}</Alert>
            </Grid>
          </Grid>)}
        {sendPass === 1 &&(
          <Grid container spacing={3} direction="row" style={{marginTop:'2rem'}}>
            <Grid item xs={12}>
              <InputBox
                label={t("login.password")}
                name="password"
                value={password}
                onChange={({target})=>setPassword(target.value)}
                type='password'
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={fnLoginEmployee} variant='contained' color='secondary'>
                {t("login.title")}
              </Button>
            </Grid>
            {statusLogin !=='' && (<Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity={statusLogin=="Please wait..."?"info":"warning"}>{statusLogin}</Alert>
            </Grid>
          </Grid>)}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant='filled' color='success'></Button>    
      </DialogActions>
    </>
  )
}
