import { ArrowDropDown } from '@mui/icons-material';
import { Button, IconButton, ListItem, Menu, MenuItem, Typography } from '@mui/material';
import { MouseEvent, ReactElement, useState } from 'react';
import { checkAccess, ROLE } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const PlannerMenu = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {checkAccess([ROLE.ADMIN, ROLE.OPKOKO_PLANNER, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
        <>
          <Button variant="contained">
            <IconButton
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                alignItems: 'center',
                padding: 0,
              }}
              onClick={handleClick}
              size="small"
            >
              <Typography sx={{ color: colors.white }}>Status</Typography>
              <ArrowDropDown htmlColor={colors.white} />
            </IconButton>
          </Button>
          <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <ListItem>Ohanterad</ListItem>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItem>Accepterad</ListItem>
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItem>Feedback</ListItem>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default PlannerMenu;
