import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAttendanceByEventID } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import { Lecture } from '../../lib/Types';
import { colors } from '../../theme/Theme';

interface LectureAttendanceListProps {
  lecture: Lecture;
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Namn',
    width: 200,
    filterable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 300,
    filterable: false,
  },
];
const LectureAttendanceList = ({ lecture }: LectureAttendanceListProps): ReactElement => {
  const request = () => getAttendanceByEventID({ id: lecture.eventID || '' });
  const { data } = useQuery(`attendantID`, request);
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);

  useEffect(() => {
    if (data) {
      (async () => {
        const resp = await Promise.all(
          data
            .filter((user) => user.lectures.indexOf(lecture.id) > -1)
            .map(async (attendant) => {
              const user = await getAzureUser(attendant.userID);
              return {
                id: attendant.id,
                name: user.displayName,
                email: user.mail.toLowerCase(),
              };
            })
        );
        setRows(resp);
      })();
    }
  }, [data, lecture]);

  const output = (
    <DataGrid
      sx={{
        background: colors.white,
        mt: 2,
        '& .MuiDataGrid-virtualScrollerRenderZone': {
          backgroundColor: colors.white,
        },
      }}
      autoHeight
      rowHeight={20}
      rows={rows || []}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      disableSelectionOnClick
    />
  );
  return output;
};

export default LectureAttendanceList;
