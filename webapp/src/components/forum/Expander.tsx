import React, { ReactElement } from 'react';
import { Button, createStyles, IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import shortArrowCircled from '../../assets/shortArrowCircled.svg';
import { padding } from '../../theme/Theme';

interface StyleProps {
  isExpanded: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(() =>
  createStyles({
    bookedByContainer: {
      gridArea: 'registerButton',
      maxWidth: '190px',
    },
    bookedBy: {
      justifySelf: 'flex-end',
    },
    expandButtonContainer: {
      gridArea: 'expandButtonContainer',
      position: 'absolute',
      bottom: `calc(-12px - 13px - ${padding.small})`,
      width: '100%',
      display: 'grid',
      justifyItems: 'center',
    },
    expandButton: {
      '& img': {
        width: '26px',
        height: '26px',
      },
      transform: ({ isExpanded }) => `rotate(${isExpanded ? 180 : 0}deg)`,
    },
  })
);

export interface ExpanderProps {
  isExpanded: boolean;
  bookedBy?: string;
  expand: () => void;
}
const Expander = ({ isExpanded, bookedBy, expand }: ExpanderProps): ReactElement => {
  const classes = useStyles({ isExpanded });

  return (
    <>
      {bookedBy ? (
        <div className={classes.bookedByContainer}>
          <Typography variant="body2" className={classes.bookedBy}>
            {bookedBy}
          </Typography>
        </div>
      ) : (
        <Button
          component={NavLink}
          to="/class/create"
          className={classes.bookedByContainer}
          variant="contained"
          color="primary"
        >
          Anmäl Pass
        </Button>
      )}

      <div className={classes.expandButtonContainer}>
        <IconButton className={classes.expandButton} onClick={expand}>
          <img alt="arrow circled" src={shortArrowCircled} />
        </IconButton>
      </div>
    </>
  );
};

export default Expander;
