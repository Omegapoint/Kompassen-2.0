import { ArrowDropDown } from '@mui/icons-material';
import { ListItem, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { setLectureStatus } from '../../api/Api';
import { checkAccess, ROLE } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

const PlannerMenu = (lectureID: any): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    setLectureStatus({ statusID: status, lectureID });
  }, [status, lectureID]);

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      {checkAccess([ROLE.ADMIN, ROLE.OPKOKO_PLANNER, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
        <>
          <Select
            defaultValue="Ohanterad"
            onChange={handleChange}
            sx={{
              height: '40px',
              alignItems: 'center',
              display: 'display-inside',
              gridAutoFlow: 'column',
              padding: 0,
            }}
          >
            <MenuItem value="Ohanterad" onClick={handleClose}>
              <ListItem>Ohanterad</ListItem>
            </MenuItem>
            <MenuItem value="Accepterad" onClick={handleClose}>
              <ListItem>Accepterad</ListItem>
            </MenuItem>
            <MenuItem value="Feedback" onClick={handleClose}>
              <ListItem>Feedback</ListItem>
            </MenuItem>
            <MenuItem value="Nekad" onClick={handleClose}>
              <ListItem>Nekad</ListItem>
            </MenuItem>
            <ArrowDropDown htmlColor={colors.white} />
          </Select>
        </>
      )}
    </>
  );
};

export default PlannerMenu;
