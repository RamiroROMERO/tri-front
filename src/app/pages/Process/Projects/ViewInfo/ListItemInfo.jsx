import styled from "@emotion/styled";
import { ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 24,
  height: 48,
  width: 48,
  borderRadius: "50%",
  minWidth: 42,
  marginRight: 16,
  padding: theme.spacing(1),
  alignItems: "center",
  justifyContent: "center",
  border: `solid 1px ${theme.palette.divider}`,
}));

const ListItemInfo = ({ iconList, title, description }) => {

  return (
    <ListItem
      sx={{
        width: { xs: "100%", sm: "50%", xl: "33.33%" },
      }}
    >
      <StyledListItemIcon>
        {iconList}
      </StyledListItemIcon>
      <ListItemText
        primary={
          <Typography
            fontSize={"12px"}
            variant="h6"
            color="text.secondary"
            mb={0.5}
          >
            {title}
          </Typography>
        }
        secondary={
          <Typography variant="body1" color="text.primary">
            {description}
          </Typography>
        }
      />
    </ListItem>
  )
}

export default ListItemInfo;
