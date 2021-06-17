import React, { ReactElement } from 'react';
import { createStyles, IconButton, makeStyles, Typography } from '@material-ui/core';
import alarmCircled from '../../assets/alarmCircled.svg';
import Discussion from './Discussion';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      gridArea: 'title',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: 'max-content max-content 1fr max-content',
      gridTemplateAreas: `"title icon . info"
                          "content content content content"`,
      padding: padding.small,
      gridGap: `${padding.minimal}`,
    },
    icon: {
      gridArea: 'icon',
      height: '25px',
      width: '25px',
    },
    info: {
      gridArea: 'info',
      maxWidth: '200px',
      textAlign: 'end',
    },
    content: {
      gridArea: 'content',
      width: '100%',
    },
  })
);

const BottomContainer = (): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="subtitle2">
        Diskussion
      </Typography>
      <IconButton className={classes.icon}>
        <img className={classes.icon} alt="arrow circled" src={alarmCircled} />
      </IconButton>
      <Typography className={classes.info} variant="subtitle1">
        Publicerat av Andreas Samuelsson 15 maj kl. 15:54
      </Typography>
      <div className={classes.content}>
        <Discussion />
      </div>
    </div>
  );
};

export default BottomContainer;
