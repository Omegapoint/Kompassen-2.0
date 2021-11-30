import { Box, Link, SxProps, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';
import { getLecture } from '../../api/Api';
import LectureView from '../../components/lectureView/LectureView';
import BigLoader from '../../components/loader/BigLoader';
import { colors, padding } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black, textDecoration: 'underline' };

const buttonClick = '"Hantera mina anmälda pass"';

const ConfirmLecture = (): ReactElement => {
  const { id } = useParams<'id'>();
  const { data, isLoading } = useQuery(`lecture-${id}`, () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getLecture({ id: id! })
  );

  if (isLoading || !data) return <BigLoader />;
  return (
    <Box sx={{ display: 'grid', gridGap: padding.standard, maxWidth: '1000px' }}>
      <Typography variant="h5" color="primary">
        Ditt pass är nu skapat!
      </Typography>
      <div>
        <Typography>
          Du kommer få en notis när planeraren har godkänt din anmälan och senare igen när schemat
          publiceras.
        </Typography>
        <Typography>
          {'För att se dina anmälda pass gå till '}
          <Link sx={linkStyle} component={NavLink} to="/lecture/user">
            {buttonClick}
          </Link>
          .
        </Typography>
      </div>
      <Typography>
        {'Känner du att du har mer att bidra med? '}
        <Link sx={linkStyle} component={NavLink} to="/lecture/create">
          Skicka in ett till pass!
        </Link>
      </Typography>
      <LectureView lecture={data} />
    </Box>
  );
};

export default ConfirmLecture;
