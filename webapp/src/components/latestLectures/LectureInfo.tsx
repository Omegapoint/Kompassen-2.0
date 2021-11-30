import { WbIncandescent } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';
import { ReactElement } from 'react';
import { useCategory } from '../../hooks/UseReduxState';
import { formatImgAsSVG } from '../../lib/Lib';
import { Lecture } from '../../lib/Types';
import { borderRadius, colors, padding } from '../../theme/Theme';
import { formatDate } from '../lecture/Row';

interface LectureInfoProps {
  lecture: Lecture;
}

const LectureInfo = ({ lecture }: LectureInfoProps): ReactElement => {
  const formattedDate = formatDate(lecture.updatedAt);
  const category = useCategory(lecture.categoryID || '');

  return (
    <Paper
      sx={{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr max-content',
        padding: padding.minimal,
        gridGap: padding.minimal,
        alignItems: 'center',
        borderRadius: borderRadius.small,
      }}
    >
      {category?.icon ? (
        <img
          src={formatImgAsSVG(category.icon)}
          alt={`${category.name} icon`}
          style={{ height: '20px', width: '20px' }}
        />
      ) : (
        <WbIncandescent
          sx={{
            height: '20px',
            width: '20px',
            '& path': { fill: colors.yellow },
          }}
        />
      )}
      <Typography variant="h6">{lecture.title}</Typography>
      <Typography>{formattedDate}</Typography>
    </Paper>
  );
};

export default LectureInfo;
