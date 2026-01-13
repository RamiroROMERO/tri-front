import React from 'react'
import Link from "@mui/material/Link";
import { Chip, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { ChevronRight } from '@mui/icons-material';

const Items = ({ name, selected, handleListItemClick, qty }) => {
  return (
		<MenuItem disableRipple sx={{ p: 0, mb: 2 }} selected={selected}>
			<Link underline={"none"} onClick={handleListItemClick}>
				{
					<ListItemIcon sx={{ color: 'inherit', minWidth: '30px !important' }}>
						<ChevronRight/>
					</ListItemIcon>
				}
				<ListItemText>
					{name}
				</ListItemText>
				<Chip label={qty} sx={{ color: 'inherit', ml: '5px' }} />
			</Link>
		</MenuItem>
	)
}

export default Items