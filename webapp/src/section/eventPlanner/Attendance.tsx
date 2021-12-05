import { Box, Chip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { ReactElement, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAttendanceByEventID } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import SmallLoader from '../../components/loader/SmallLoader';
import { useAppSelector } from '../../lib/Lib';
import { Event, Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

interface LectureRow {
  color: string;
  lecture: Lecture;
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Namn',
    width: 150,
    filterable: false,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 270,
    filterable: false,
  },
  {
    field: 'remote',
    headerName: 'Distans',
    width: 90,
  },
  {
    field: 'message',
    headerName: 'Matpreferens',
    width: 130,
  },
  {
    field: 'lectures',
    headerName: 'Pass',
    width: 350,
    sortable: false,
    renderCell: ({ row }) => (
      <Box sx={{ display: 'grid', gridGap: padding.tiny }}>
        {row.allLectures.map((e: LectureRow) => (
          <Chip
            key={e.lecture.title}
            sx={{
              background: e.color,
              color: colors.white,
            }}
            label={e.lecture.title}
          />
        ))}
      </Box>
    ),
  },
];

interface AttendanceProps {
  event: Event;
  lectures: Lecture[];
}

const Attendance = ({ event, lectures }: AttendanceProps): ReactElement => {
  const request = () => getAttendanceByEventID({ id: event.id });
  const { data } = useQuery(`attendance-${event.id}`, request);
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [searchable, setSearchable] = useState<Record<string, Lecture> | null>(null);
  const categories = useAppSelector((state) => state.categories);

  useEffect(() => {
    setSearchable(lectures.reduce((acc, lecture) => ({ ...acc, [lecture.id]: lecture }), {}));
  }, [lectures]);

  useEffect(() => {
    if (data && searchable) {
      (async () => {
        const resp = await Promise.all(
          data.map(async (attendant) => {
            const user = await getAzureUser(attendant.userID);
            const allLectures: LectureRow[] = attendant.lectures
              .map((lectureID) => searchable[lectureID])
              .sort((x, y) => (x.title > y.title ? 1 : -1))
              .map((lecture) => ({
                lecture,
                color: categories.find((e2) => e2.id === lecture.categoryID)!.color,
              }));
            return {
              id: attendant.id,
              name: user.displayName,
              email: user.mail.toLowerCase(),
              remote: attendant.remote ? 'Ja' : 'Nej',
              message: attendant.message || '-',
              allLectures,
              lectures: allLectures.map((lectureData) => lectureData.lecture.title).join(' '),
            };
          })
        );
        setRows(resp);
      })();
    }
  }, [categories, data, searchable]);

  if (!rows) {
    return (
      <Box
        sx={{
          height: '200px',
          display: 'grid',
          alignContent: 'center',
          justifyItems: 'center',
        }}
      >
        <SmallLoader />
      </Box>
    );
  }

  return (
    <DataGrid
      sx={{
        background: colors.white,
        '& .MuiDataGrid-virtualScrollerRenderZone': {
          backgroundColor: colors.white,
        },
      }}
      rowHeight={200}
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      disableSelectionOnClick
    />
  );
};

export default Attendance;
