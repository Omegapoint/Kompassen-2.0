import { createStyles, FormGroup, makeStyles, Switch, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    handleNote: {
      display: 'grid',
      gridGap: `${padding.minimal} ${padding.large}`,
      paddingTop: padding.standard,
      paddingBottom: padding.large,
      justifyItems: 'start',
      alignItems: 'center',
      gridTemplateColumns: 'max-content max-content 1fr',
      gridTemplateAreas: `"hlabel1 slider1 ."
                              "hlabel2 slider2 ."
                              "hlabel3 slider3 . "
                              "hlabel4 slider4 ."`,
      '& > *': {
        gridColumn: 'span 2',
      },
    },
    hlabel1: {
      gridArea: 'hlabel1',
    },
    hlabel2: {
      gridArea: 'hlabel2',
    },
    hlabel3: {
      gridArea: 'hlabel3',
    },
    hlabel4: {
      gridArea: 'hlabel4',
    },
    slider1: {
      gridArea: 'slider1',
    },
    slider2: {
      gridArea: 'slider2',
    },
    slider3: {
      gridArea: 'slider3',
    },
    slider4: {
      gridArea: 'slider4',
    },
  })
);
interface SwitchType {
  newPosts: boolean;
  commentedPost: boolean;
  adminReadPost: boolean;
  responsibleClass: boolean;
}
interface NotificationProps {
  checked: SwitchType;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | null>) => void;
}

const Notifications = ({ checked, handleChange }: NotificationProps): ReactElement => {
  const classes = useStyles();

  return (
    <FormGroup className={classes.handleNote}>
      <Typography className={classes.hlabel1}>Få notiser på nya inlägg i Kommunity</Typography>
      <Switch
        className={classes.slider1}
        checked={checked.newPosts}
        onChange={handleChange}
        name="newPosts"
      />
      <Typography className={classes.hlabel2}>Få notiser på inlägg jag kommenterat</Typography>
      <Switch
        className={classes.slider2}
        checked={checked.commentedPost}
        onChange={handleChange}
        name="commentedPost"
      />
      <Typography className={classes.hlabel3}>
        Få notiser då admin läst mitt inlämnade pass
      </Typography>
      <Switch
        className={classes.slider3}
        checked={checked.adminReadPost}
        onChange={handleChange}
        name="adminReadPost"
      />
      <Typography className={classes.hlabel4}>
        Få notiser då någon ställt upp som passhållare
      </Typography>
      <Switch
        className={classes.slider4}
        checked={checked.responsibleClass}
        onChange={handleChange}
        name="responsibleClass"
      />
    </FormGroup>
  );
};
export default Notifications;
