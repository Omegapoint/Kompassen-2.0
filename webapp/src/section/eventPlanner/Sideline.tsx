import { makeStyles, Theme } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import ScheduledLecture from './ScheduledLecture';
import { COL_HEIGHT, DragStopFn, heightByMin } from './UseSchedule';

interface StyleProps {
  minHeight: number;
}

const useStyles = makeStyles<Theme, StyleProps>(() => ({
  container: {
    display: 'grid',
    minHeight: ({ minHeight }) => `${minHeight}px`,
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
  },
}));

interface SidelineProps {
  numRows: number;
  lectures: Lecture[][];
  totWidth: number;
  handleDragStop: DragStopFn;
  longestDuration: number;
}

const Sideline = ({
  numRows,
  lectures,
  totWidth,
  handleDragStop,
  longestDuration,
}: SidelineProps): ReactElement => {
  const classes = useStyles({ minHeight: heightByMin(longestDuration / 60) });

  return (
    <div className={classes.container}>
      {lectures.map((li, i) => (
        <div key={Math.random()}>
          {li.map((lecture, i1) => (
            <ScheduledLecture
              startY={
                COL_HEIGHT * numRows +
                25 +
                heightByMin(li.slice(0, i1).reduce((s, e2) => s + (e2.duration || 0) / 60, 0))
              }
              startX={totWidth * (i / 4)}
              key={lecture.id}
              lecture={lecture}
              colHeight={COL_HEIGHT}
              handleDragStop={(startPos, pos) =>
                handleDragStop(lecture, startPos, pos, i, i1, true)
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sideline;
