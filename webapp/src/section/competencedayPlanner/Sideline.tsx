import { Box } from '@mui/material';
import React, { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import ScheduledLecture from './ScheduledLecture';
import { COL_HEIGHT, DragStopFn, heightByMin } from './UseSchedule';

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
}: SidelineProps): ReactElement => (
  <Box
    sx={{
      display: 'grid',
      minHeight: `${heightByMin(longestDuration / 60)}px`,
      gridAutoFlow: 'column',
      gridAutoColumns: '1fr',
    }}
  >
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
            editable
            handleDragStop={(startPos, pos) => handleDragStop(lecture, startPos, pos, i, i1, true)}
          />
        ))}
      </div>
    ))}
  </Box>
);

export default Sideline;
