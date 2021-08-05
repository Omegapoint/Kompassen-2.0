import { createStyles, IconButton, makeStyles, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { ReactElement, useContext } from 'react';
import alarmCircled from '../../assets/alarmCircled.svg';
import useAzureUser from '../../hooks/UseAzureUser';
import { padding } from '../../theme/Theme';
import Discussion from './Discussion';
import LectureContext from './LectureContext';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      gridArea: 'title',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'max-content max-content 1fr max-content',
      gridTemplateAreas: `"title icon . info"
                          "content content content content"`,
      padding: padding.small,
      gridGap: `${padding.minimal}`,
    },
    icon: {
      gridArea: 'icon',
      height: '25px',
      width: '25px',
    },
    info: {
      gridArea: 'info',
      maxWidth: '200px',
      textAlign: 'end',
    },
  })
);

const formatTime = (d: Date): string => {
  const date = format(d, 'dd MMMM', { locale: sv });
  const time = format(d, 'HH:MM', { locale: sv });
  return `${date} kl. ${time}`;
};

const BottomContainer = (): ReactElement => {
  const { lecture } = useContext(LectureContext);
  const classes = useStyles();
  const date = formatTime(lecture.createdAt);
  const { name } = useAzureUser(lecture.createdBy);

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="subtitle2">
        Diskussion
      </Typography>
      <IconButton className={classes.icon}>
        <img className={classes.icon} alt="arrow circled" src={alarmCircled} />
      </IconButton>
      <Typography className={classes.info} variant="subtitle1">
        {`Publicerat av ${name} ${date}`}
      </Typography>
      <Discussion />
    </div>
  );
};

export default BottomContainer;
