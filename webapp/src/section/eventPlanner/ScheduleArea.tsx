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
      {lectures.map((e, i) => (
        <div key={Math.random()}>
          {e.map((e1, i1) => (
            <div className={classes.cell} key={Math.random()}>
              {e1 ? (
                <ScheduledLecture
                  startX={colWidth * i}
                  startY={heightByMin(i1 * MINUTES)}
                  colToTime={(y) => rowToTime(toYCol(y))}
                  lecture={e1}
                  colHeight={COL_HEIGHT}
                  handleDragStop={(startPos, pos) =>
                    handleDragStop(e1, startPos, pos, i, i1, false)
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
