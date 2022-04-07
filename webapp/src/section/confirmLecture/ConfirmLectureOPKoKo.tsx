import { Box, Button, Link, SxProps, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';
import { getLecture } from '../../api/Api';
import LectureView from '../../components/lectureView/LectureView';
import BigLoader from '../../components/loader/BigLoader';
import { colors, padding } from '../../theme/Theme';

const linkStyle: SxProps = { color: colors.black, textDecoration: 'underline' };

const buttonClick = '"Hantera mina inskickade bidrag"';

const ConfirmLectureOPKoKo = (): ReactElement => {
  const { id } = useParams<'id'>();
  const { data, isLoading } = useQuery(`lecture-${id}`, () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getLecture({ id: id! })
  );

  if (isLoading || !data) return <BigLoader />;
  return (
    <Box sx={{ display: 'grid', gridGap: padding.standard, maxWidth: '1000px' }}>
      <Typography variant="h5" color="primary">
        Bidraget är nu inskickat till urval för OPKoKo!
      </Typography>
      <div>
        <Box sx={{ display: 'flex' }}>
          <Typography>
            Som tack för att ni vill bidra till vår kompetenskultur kommer ni att bli inbjudna till
            en
            <b>
              {' '}
              digital föreläsning och workshop i presentationsteknik den 19/4 kl 17.00-19.00.
            </b>{' '}
            <br />
            Beslut om bidragets acceptans kommer att meddelas den 26 april 2022.{' '}
          </Typography>
          <Button
            variant="contained"
            sx={{ width: '300px', height: '50px', marginLeft: '20px' }}
            href="https://cdn.filesend.jp/private/sLiwLZS7ZnUQvq4CHKmuYDoWY9N3zXJlLBH56pVQBy9BavQy2dEHOEVTO4ilqFcU/Presentationstekniksfo%CC%88rela%CC%88sning%20Fredrik%20Berling.ics"
            download
          >
            Lägg till i din kalender
          </Button>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <Typography>
            {'För att se dina bidrag gå till '}
            <Link sx={linkStyle} component={NavLink} to="/lecture/user">
              {buttonClick}
            </Link>
            .
          </Typography>
        </Box>
      </div>
      <Typography>
        {'Känner du att du har mer att bidra med? '}
        <Link sx={linkStyle} component={NavLink} to="/lecture/OPKoKo/create">
          Skicka in ett till bidrag!
        </Link>
      </Typography>
      <LectureView lecture={data} />
    </Box>
  );
};

export default ConfirmLectureOPKoKo;
