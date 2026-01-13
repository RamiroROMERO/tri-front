import React from 'react';
import { Typography } from "@mui/material";
import Div from "@jumbo/shared/Div";
import { useSelector } from 'react-redux';

const Footer = () => {

  const { companyData } = useSelector(state => state.generalData);
  const fullYear = new Date().getFullYear();
  return (
    <Div sx={{
      py: 2,
      px: { lg: 6, xs: 4 },
      borderTop: 2,
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}>
      <Div sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {companyData?.name}
        <Div sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant={"body1"} color={"text.primary"}>
          Evolution Code & Design © {fullYear}
        </Typography>
        </Div>
      </Div>
    </Div>
  );
};

export default Footer;
