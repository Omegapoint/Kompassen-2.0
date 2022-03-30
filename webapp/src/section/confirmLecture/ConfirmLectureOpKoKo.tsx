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
        Din anmälan av bidrag till OPKoKo är nu skickad!
      </Typography>
      <div>
        <Typography>Som tack för ert bidrag kommer ni att bli inbjudna till en föreläsning kring presentationsteknik. Det kommer ut en kalenderinbjudan inom kort! Beslut om bidragets acceptans kommer att meddelas den 26 april 2022. </Typography>
        <Box sx={{marginTop: '60px'}}><Typography>
          {'För att se dina anmälda pass gå till '}
          <Link sx={linkStyle} component={NavLink} to="/lecture/user">
            {buttonClick}
          </Link>
          .
        </Typography>
        </Box>
      </div>
      <Typography>
        {'Känner du att du har mer att bidra med? '}
        <Link sx={linkStyle} component={NavLink} to="/lecture/OpKoKo/create">
          Skicka in ett till bidrag!
        </Link>
      </Typography>
      <LectureView lecture={data} />
    </Box>
  );
};

export default ConfirmLectureOpKoKo;
