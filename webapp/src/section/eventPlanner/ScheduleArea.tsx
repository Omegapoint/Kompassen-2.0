import { makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import ScheduledLecture from './ScheduledLecture';
import { COL_HEIGHT, DragStopFn, heightByMin, MINUTES, toYCol } from './UseSchedule';

const useStyles = makeStyles(() => ({
  container: {
    gridGap: padding.standard,
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
  },
  cell: {
    height: `${COL_HEIGHT}px`,
    borderBottom: `${colors.lightGrey} solid 1px`,
    '&:first-of-type': {
      borderTop: `${colors.grey} solid 1px`,
    },
    [`&:nth-of-type(${30 / MINUTES}n)`]: {
      borderBottom: `${colors.grey} solid 1px`,
    },
  },
}));

interface ScheduleAreaProps {
  lectures: (Lecture | null)[][];
  colWidth: number;
  rowToTime: (col: number) => Date;
  handleDragStop: DragStopFn;
}

const ScheduleArea = ({
  lectures,
  colWidth,
  rowToTime,
  handleDragStop,
}: ScheduleAreaProps): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {lectures.map((li, i) => (
        <div key={Math.random()}>
          {li.map((lecture, j) => (
            <div className={classes.cell} key={lecture?.id}>
              {lecture ? (
                <ScheduledLecture
                  startX={colWidth * i}
                  startY={heightByMin(j * MINUTES)}
                  rowToTime={(row) => rowToTime(toYCol(row))}
                  lecture={lecture}
                  colHeight={COL_HEIGHT}
                  handleDragStop={(startPos, pos) =>
                    handleDragStop(lecture, startPos, pos, i, j, false)
                  }
                />
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScheduleArea;
