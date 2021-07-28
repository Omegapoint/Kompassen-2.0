import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ReactElement } from 'react';
import cloud from '../../assets/cloud.svg';
import code from '../../assets/code.svg';
import shield from '../../assets/shield.svg';
import sun from '../../assets/sun.svg';
import vcs from '../../assets/vcs.svg';
import { borderRadius, padding } from '../../theme/Theme';
import { formatDate } from '../lecture/Row';

export type LectureKind = 'cloud' | 'sun' | 'shield' | 'code' | 'vcs';

export type IconType = {
  [key in LectureKind]: string;
};

const icons: IconType = { cloud, code, shield, sun, vcs };

export const getIconByKind = (kind: LectureKind): string => icons[kind];

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr max-content',
    padding: padding.minimal,
    gridGap: padding.minimal,
    alignItems: 'center',
    borderRadius: borderRadius.small,
  },
}));

interface LectureProps {
  name: string;
  location: string;
  date: Date;
  kind: LectureKind;
}
const Lecture = ({ name, location, date, kind }: LectureProps): ReactElement => {
  const classes = useStyles();
  const icon = getIconByKind(kind);
  const formattedDate = formatDate(date);

  return (
    <Paper className={classes.container}>
      <img width={20} height={20} src={icon} alt={kind} />
      <Typography variant="h6">{name}</Typography>
      <Typography>{`${formattedDate} • ${location}`}</Typography>
    </Paper>
  );
};

export default Lecture;
