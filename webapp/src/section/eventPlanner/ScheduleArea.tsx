import { Box } from '@mui/material';
import React, { ReactElement } from 'react';
import { Lecture } from '../../lib/Types';
import { colors, padding } from '../../theme/Theme';
import ScheduledLecture from './ScheduledLecture';
import { COL_HEIGHT, DragStopFn, heightByMin, MINUTES, toYCol } from './UseSchedule';

interface ScheduleAreaProps {
  lectures: (Lecture | null)[][];
  colWidth: number;
  rowToTime: (col: number) => Date;
  handleDragStop: DragStopFn;
  editable: boolean;
}

const ScheduleArea = ({
  lectures,
  colWidth,
  rowToTime,
  handleDragStop,
  editable,
}: ScheduleAreaProps): ReactElement => (
  <Box
    sx={{
      gridGap: padding.standard,
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: '1fr',
    }}
  >
    {lectures.map((li, i) => (
      <div key={Math.random()}>
        {li.map((lecture, j) => (
          <Box
            sx={{
              height: `${COL_HEIGHT}px`,
              borderBottom: `${colors.lightGrey} solid 1px`,
              '&:first-of-type': {
                borderTop: `${colors.grey} solid 1px`,
              },
              [`&:nth-of-type(${30 / MINUTES}n)`]: {
                borderBottom: `${colors.grey} solid 1px`,
              },
            }}
            key={Math.random()}
          >
            {lecture ? (
              <ScheduledLecture
                startX={colWidth * i}
                startY={heightByMin(j * MINUTES)}
                rowToTime={(row) => rowToTime(toYCol(row))}
                lecture={lecture}
                colHeight={COL_HEIGHT}
                editable={editable}
                handleDragStop={(startPos, pos) =>
                  handleDragStop(lecture, startPos, pos, i, j, false)
                }
              />
            ) : null}
          </Box>
        ))}
      </div>
    ))}
  </Box>
);

export default ScheduleArea;
