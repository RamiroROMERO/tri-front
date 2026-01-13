import React from 'react';
import Div from "@jumbo/shared/Div";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Error500 = () => {

  const {t} = useTranslation();

  const navigate = useNavigate();
  
  const fnReturnBack = ()=>{
    navigate('/',{
      replace: true
    }
    );
  };

  return (
    <Div sx={{
      flex: 1,
      flexWrap: 'wrap',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: theme => theme.spacing(4),
    }}>
      <Typography
        variant={"h1"}
        fontWeight="500"
        sx={{ fontSize: 150, textShadow: '1rem 0.6rem 1rem rgba(0, 0, 0, 0.35)', mb: 1 }}
      >500</Typography>
      <Typography
        component={"h2"}
        variant={"h1"}
        color={"text.secondary"}
        mb={4}
      >{t("pages.error.page500")} </Typography>
      <Button onClick={ fnReturnBack } variant="contained">{t("buttons.goBack")}</Button>
    </Div>
  );
};

export default Error500;
