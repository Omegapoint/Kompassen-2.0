import React, { ReactElement } from 'react';
import { createStyles, Divider, makeStyles, Paper } from '@material-ui/core';
import useBoolean from '../../hooks/UseBoolean';
import BottomContainer from './BottomContainer';
import TopContainer from './TopContainer';
import { borderRadius, colors } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: 'min-content 1fr',
      gridAutoFlow: 'column',
    },
    line: {
      background: colors.blue,
      width: '6px',
      borderRadius: `${borderRadius.standard} 0 0 ${borderRadius.standard}`,
    },
  })
);

interface ForumProps {
  bookedBy?: string;
}

const Forum = ({ bookedBy }: ForumProps): ReactElement => {
  const [isExpanded, expand] = useBoolean();
  const classes = useStyles({ isExpanded });

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.line} />
        <Paper>
          <TopContainer isExpanded={isExpanded} bookedBy={bookedBy} expand={expand.toggle} />
          {isExpanded && (
            <>
              <Divider />
              <BottomContainer />
            </>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Forum;
