import { Box, Link, SxProps, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';
import { getLecture } from '../../api/Api';
import BigLoader from '../../components/loader/BigLoader';
import { colors, padding } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black, textDecoration: 'underline' };

const buttonClick = '"Hantera mina anmälda pass"';

const ConfirmLectureOpKoKo = (): ReactElement => {
  const { id } = useParams<'id'>();
  const { data, isLoading } = useQuery(`lecture-${id}`, () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getLecture({ id: id! })
  );

  if (isLoading || !data) return <BigLoader />;
  return (
    <Box sx={{ display: 'grid', gridGap: padding.standard, maxWidth: '1000px' }}>
      <Typography variant="h5" color="primary">
        Din anmälan av pass till OpKoKo är nu skickad!
      </Typography>
      <div>
        <Typography>(text om vad som händer nu)</Typography>
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
    </Box>
  );
};

export default ConfirmLectureOpKoKo;
