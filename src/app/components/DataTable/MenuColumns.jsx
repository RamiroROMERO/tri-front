import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { IconButton, MenuItem } from '@mui/material';
import { MenuColumnsItem } from './MenuColumnsItem';
import { ViewWeek } from '@mui/icons-material';
import { useState } from 'react';
import JumboScrollbar from '@jumbo/components/JumboScrollbar/JumboScrollbar';

export const MenuColumns = ({ columns, changeShowColum }) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const [listChecked, setListChecked] = useState(columns.filter(elem => elem.hidden === false).map(elem => elem.field));

  const changeSwhitchToggle = (value) => {
    const currentIndex = listChecked.indexOf(value);
    const newChecked = [...listChecked];
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setListChecked(newChecked);
    changeShowColum(value);
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  React.useEffect(() => {
    setListChecked(columns.filter(elem => elem.hidden === false).map(elem => elem.field));
  }, [columns]);

  return (
    <Stack direction="row" spacing={2}>
      <div style={{ zIndex: 11 }}>
        <IconButton
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <ViewWeek color='primary' />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <JumboScrollbar
                    autoHeight
                    autoHide
                    autoHideDuration={200}
                    autoHideTimeout={500}
                    autoHeightMax={500}
                  >
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <MenuItem disabled>Show/Hide Columns</MenuItem>
                      {
                        columns.filter(elem => elem.field !== 'actions').map((elem, idx) => (
                          <MenuColumnsItem
                            key={`menuColumnsItem-${idx}`}
                            idx={idx}
                            label={elem.headerName}
                            field={elem.field}
                            onChange={() => changeSwhitchToggle(elem.field)}
                            checked={listChecked.indexOf(elem.field) !== -1}
                          />
                        ))
                      }

                    </MenuList>
                  </JumboScrollbar>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}