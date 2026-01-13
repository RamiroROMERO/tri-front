import React from 'react';
import Chip from "@mui/material/Chip";
import { CardActions, CardContent, Link, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { useTranslation } from "react-i18next";

const CardNotifications = ({ title, titleColor, labelChip, colorChip, linkToLearnMore, children }) => {

  const { t } = useTranslation();

  return (
    <JumboCardQuick
      headerSx={{ bgcolor: 'primary.main' }}
      noWrapper
      title={
        <Typography
          variant={"h5"}
          sx={{ color: titleColor }}
        >
          {t(title)}
        </Typography>
      }
      action={<Chip label={labelChip} color={colorChip} />}
    >
      <Divider />
      {children && (
        <CardContent>
          {children}
        </CardContent>)
      }
      <CardActions sx={{ py: theme => theme.spacing(1.5) }}>
        {linkToLearnMore && (<Link href={linkToLearnMore} underline={"none"} lineHeight={1.2}>View More</Link>)}
      </CardActions>
    </JumboCardQuick>
  );
};

export default CardNotifications;
