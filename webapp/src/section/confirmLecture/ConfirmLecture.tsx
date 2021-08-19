import { createStyles, Link, makeStyles, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';
import { getLecture } from '../../api/Api';
import LectureCard from '../../components/lectureCard/LectureCard';
import BigLoader from '../../components/loader/BigLoader';
import { IDParam } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridGap: padding.standard,
      maxWidth: '1000px',
    },
    link: {
      color: colors.black,
      textDecoration: 'underline',
    },
  })
);

const buttonClick = '"Hantera mina anmälda pass"';

const ConfirmLecture = (): ReactElement => {
  const classes = useStyles();
  const { id } = useParams<IDParam>();
  const { data, isLoading } = useQuery(`lecture-${id}`, () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getLecture({ id: id! })
  );

  if (isLoading || !data) return <BigLoader />;

  return (
    <div className={classes.container}>
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
          <Link className={classes.link} component={NavLink} to="/lecture/user">
            {buttonClick}
          </Link>
          .
        </Typography>
      </div>
      <Typography>
        {'Känner du att du har mer att bidra med? '}
        <Link className={classes.link} component={NavLink} to="/lecture/create">
          Skicka in ett till pass!
        </Link>
      </Typography>
      <LectureCard lecture={data} editIcon={false} deleteIcon={false} />
    </div>
  );
};

export default ConfirmLecture;
