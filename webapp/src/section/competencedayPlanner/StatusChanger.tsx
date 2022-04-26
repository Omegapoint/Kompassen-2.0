import { ArrowDropDown } from '@mui/icons-material';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import { setLectureStatus } from '../../api/Api';
import { checkAccess, ROLE, useAppSelector } from '../../lib/Lib';
import { colors } from '../../theme/Theme';

interface StatusChangerProps {
  lectureID: string;
}

const StatusChanger = ({ lectureID }: StatusChangerProps): ReactElement => {
  const statuses = useAppSelector((state) => state.statuses);
  const [status, setStatus] = useState('');
  useEffect(() => {
    setLectureStatus({ statusID: status, lectureID });
  }, [status, lectureID]);

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };
  return (
    <>
      {checkAccess([ROLE.ADMIN, ROLE.OPKOKO_PLANNER, ROLE.OPKOKO_PROGRAM_COMMITTEE]) && (
        <>
          <Select
            onChange={handleChange}
            sx={{
              height: '40px',
              alignItems: 'center',
              display: 'display-inside',
              gridAutoFlow: 'column',
              padding: 0,
            }}
          >
            {statuses.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
            <ArrowDropDown htmlColor={colors.white} />
          </Select>
        </>
      )}
    </>
  );
};

export default StatusChanger;
