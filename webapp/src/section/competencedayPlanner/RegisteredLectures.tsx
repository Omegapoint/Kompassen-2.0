import { Box, Pagination } from '@mui/material';
import { ReactElement, useState } from 'react';
import { usePagination } from '../../hooks/UsePagination';
import { Lecture } from '../../lib/Types';
import { padding } from '../../theme/Theme';
import LectureCard from './LectureCard';

interface RegisteredLecturesProps {
  lectures: Lecture[];
  admin?: boolean;
  opkoko?: boolean;
}

const RegisteredLectures = ({
  lectures,
  admin = false,
  opkoko = false,
}: RegisteredLecturesProps): ReactElement => {
  const [totalPages, changeTotalPages] = useState(Math.ceil(lectures.length));
  const [page, changePage] = useState(1);

  const paginationRange = usePagination({
    totalCount: lectures.length,
    pageSize: 10,
    siblingCount: 5,
    currentPage: page,
  });

  // const statuses = useAppSelector((state) => state.statuses);
  return (
    <>
      {console.log(paginationRange)}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: opkoko ? 'max-content' : '1fr 1fr 1fr',
          gridTemplateRows: 'max-content',
          gridGap: padding.standard,
        }}
      >
        {lectures.map((e) => (
          <LectureCard key={e.id} lecture={e} edit admin={admin} opkoko={opkoko} />
        ))}
      </Box>
      <Pagination
        count={10}
        page={page}
        onChange={(event) =>
          changePage(Number((event.currentTarget as HTMLTextAreaElement).textContent))
        }
      />
    </>
  );
};

export default RegisteredLectures;
