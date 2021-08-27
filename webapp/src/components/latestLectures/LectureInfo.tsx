import { makeStyles, Paper, Typography } from '@material-ui/core';
import { WbIncandescent } from '@material-ui/icons';
import { ReactElement } from 'react';
import { useCategory, useLocation } from '../../hooks/UseReduxState';
import { formatImgAsSVG } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDate } from '../lecture/Row';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'max-content 1fr max-content',
    padding: padding.minimal,
    gridGap: padding.minimal,
    alignItems: 'center',
    borderRadius: borderRadius.small,
    '& > :first-child': {
      height: '20px',
      width: '20px',
    },
  },
  defaultIcon: {
    '& path': {
      fill: colors.yellow,
    },
  },
}));

interface LectureInfoProps {
  lecture: Lecture;
}

const LectureInfo = ({ lecture }: LectureInfoProps): ReactElement => {
  const classes = useStyles();
  const formattedDate = formatDate(lecture.updatedAt);
  const category = useCategory(lecture.categoryID || '');
  const location = useLocation(lecture.locationID || '');

  return (
    <Paper className={classes.container}>
      {category?.icon ? (
        <img src={formatImgAsSVG(category.icon)} alt={`${category.name} icon`} />
      ) : (
        <WbIncandescent className={classes.defaultIcon} />
      )}
      <Typography variant="h6">{lecture.title}</Typography>
      <Typography>{[formattedDate, location?.name].filter((e) => e).join(' • ')}</Typography>
    </Paper>
  );
};

export default LectureInfo;
