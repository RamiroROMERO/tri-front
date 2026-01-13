import React from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import { EmailOutlined, HowToReg, Person } from '@mui/icons-material';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";

const InfoUser = ({t, currentItem, typeUser}) => {
  return (
    <JumboCardQuick title={t("page.profile.title.userInformation")} noWrapper>
			<List disablePadding sx={{mb: 2}}>
				<ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.5, 3)}}>
					<ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
						<EmailOutlined/>
					</ListItemIcon>
					<ListItemText
						primary={<Typography variant="body1" color="text.secondary">{t("page.profile.input.email")}</Typography>}
						secondary={<Typography variant="body1" color="text.primary">{currentItem.email}</Typography>}
					/>
				</ListItem>
				<ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.5, 3)}}>
					<ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
						<Person/>
					</ListItemIcon>
					<ListItemText
						primary={<Typography variant="body1" color="text.secondary">{t("page.profile.input.userType")}</Typography>}
						secondary={<Typography variant="body1" color="text.primary">{typeUser}</Typography>}
					/>
				</ListItem>
				<ListItem alignItems="flex-start" sx={{p: theme => theme.spacing(.5, 3)}}>
					<ListItemIcon sx={{minWidth: 36, color: 'text.secondary'}}>
						<HowToReg/>
					</ListItemIcon>
					<ListItemText
						primary={<Typography variant="body1" color="text.secondary">{t("page.profile.title.status")}</Typography>}
						secondary={<Typography variant="body1" color="text.primary">{currentItem.status===1?'Active':'Inactive'}</Typography>}
					/>
				</ListItem>
			</List>
		</JumboCardQuick>
  )
}

export default InfoUser