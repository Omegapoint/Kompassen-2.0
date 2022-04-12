import { ArrowDropDown, Edit } from '@mui/icons-material';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { IconButton, ListItem, ListItemIcon, Menu, MenuItem, SxProps } from '@mui/material';
import { MouseEvent, ReactElement, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { checkAccess, ROLE } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black };

const PlannerMenu = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton
        sx={{
          display: 'grid',
          marginRight: '20px',
          gridAutoFlow: 'column',
          alignItems: 'center',
          padding: 0,
        }}
        onClick={handleClick}
        size="large"
      >
        <ConnectWithoutContactIcon htmlColor={colors.white} />
        <ArrowDropDown htmlColor={colors.white} />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Edit fontSize="small" />
              <ListItem sx={linkStyle} component={NavLink} to="/events/opkokos">
                Planera OPKoKos
              </ListItem>
            </ListItemIcon>
          </MenuItem>
        )}
        {checkAccess([ROLE.ADMIN, ROLE.COMPETENCE_DAY_PLANNER]) && (
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Edit fontSize="small" />
              <ListItem sx={linkStyle} component={NavLink} to="/events/competencedays">
                Planera Kompetensdagar
              </ListItem>
            </ListItemIcon>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default PlannerMenu;
