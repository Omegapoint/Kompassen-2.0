import { createStyles, FormGroup, makeStyles, Switch, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { padding } from '../../theme/Theme';

const useStyles = makeStyles(() =>
  createStyles({
    handleNote: {
      display: 'grid',
      gridGap: `${padding.minimal} ${padding.large}`,
      alignItems: 'center',
      gridTemplateColumns: 'max-content max-content',
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
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DataType {
  title: string;
  name: keyof SwitchType;
}

const data: DataType[] = [
  {
    title: 'Nytt inlägg i Community',
    name: 'newPosts',
  },
  {
    title: 'Inlägg jag kommenterat',
    name: 'commentedPost',
  },
  {
    title: 'Admin har läst mitt inlämnade pass',
    name: 'adminReadPost',
  },
  {
    title: 'Någon har ställt upp som passhållare',
    name: 'responsibleClass',
  },
];

const Notifications = ({ checked, handleChange }: NotificationProps): ReactElement => {
  const classes = useStyles();

  return (
    <FormGroup className={classes.handleNote}>
      {data.map((e) => (
        <>
          <Typography>{e.title}</Typography>
          <Switch checked={checked[e.name]} onChange={handleChange} name={e.name} />
        </>
      ))}
    </FormGroup>
  );
};
export default Notifications;
