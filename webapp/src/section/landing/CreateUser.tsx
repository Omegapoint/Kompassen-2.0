import { Button, createStyles, makeStyles, Paper, Typography } from '@material-ui/core';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { createUser } from '../../api/Api';
import { padding } from '../../theme/Theme';
import Notifications from '../settings/Notifications';

const defaultNotifications = {
  newLecture: true,
  newComment: true,
  adminRead: true,
  lectureTaken: true,
};

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      display: 'grid',
      padding: padding.medium,
      gridGap: padding.standard,
      '& > button': {
        justifySelf: 'center',
      },
    },
  })
);

interface CreateUserProps {
  onFinish: () => void;
}

const CreateUser = ({ onFinish }: CreateUserProps): ReactElement => {
  const classes = useStyles();
  const { mutate, isSuccess } = useMutation(createUser);
  const [notifications, setNotifications] = useState(defaultNotifications);

  useEffect(() => {
    if (isSuccess) onFinish();
  }, [isSuccess, onFinish]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNotifications((old) => ({ ...old, [event.target.name]: event.target.checked }));
  };

  const handleSubmit = async () => mutate({ notifications });

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Välkommen till Kompass 2.0</Typography>
      <Typography variant="h6">Ställ in dina notifikationsinställningar</Typography>
      <Notifications handleChange={handleChange} checked={notifications} />
      <Button color="primary" variant="contained" onClick={handleSubmit}>
        Spara inställningarna
      </Button>
    </Paper>
  );
};

export default CreateUser;
