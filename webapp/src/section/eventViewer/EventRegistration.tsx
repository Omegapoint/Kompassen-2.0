import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  createAttendance,
  deleteAttendance,
  getAttendanceByEventID,
  isAttending,
} from '../../api/Api';
import SmallLoader from '../../components/loader/SmallLoader';
import useForm from '../../hooks/UseForm';
import { useAppSelector } from '../../lib/Lib';
import { Event, Lecture } from '../../lib/Types';
import SmallLectureCard from '../eventPlanner/SmallLectureCard';

const defaultFormValue: FormValue = {
  lectures: [],
  message: '',
  remote: false,
};

interface FormValue {
  lectures: string[];
  message: string;
  remote: boolean;
}

interface EventRegistrationProps {
  lectures: Lecture[];
  event: Event;
  toggleOnlyRemote: () => void;
}

const EventRegistration = ({
  event,
  lectures,
  toggleOnlyRemote,
}: EventRegistrationProps): ReactElement => {
  interface LectureInfo {
    lecture: Lecture;
    color: string;
    icon: string;
  }
  const [userAttendedLectures, setUserAttendedLectures] = useState<LectureInfo[] | null>(null);
  const { azureUser } = useAppSelector((state) => state.session);
  const categories = useAppSelector((state) => state.categories);
  const { values, updateValues, handleChange } = useForm(defaultFormValue);
  const onCreate = useMutation(createAttendance);
  const onDelete = useMutation(deleteAttendance);
  const { isLoading, data } = useQuery(`attending-${event.id}`, () =>
    isAttending({ id: event.id })
  );

  const handleSelectChange = (e: FormEvent<HTMLDivElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (e.target as any).value as string;
    if (values.lectures.includes(value)) {
      updateValues({ lectures: values.lectures.filter((lectureId) => lectureId !== value) });
    } else {
      updateValues({ lectures: [...values.lectures, value] });
    }
  };

  const onSubmit = () => onCreate.mutateAsync({ ...values, eventID: event.id });

  const onDeleteClick = async () => {
    await onDelete.mutateAsync({ id: event.id });
    window.location.reload();
  };

  const approvedLectures = lectures.filter((e) => e.approved);

  const attendantRequest = () => getAttendanceByEventID({ id: event.id });
  const { data: registrationData } = useQuery(`attendance-${event.id}`, attendantRequest);

  useEffect(() => {
    function getColorAndIconForCategory(categoryID: string) {
      return {
        color: categories.find((c) => c.id === categoryID)?.color || 'grey',
        icon: categories.find((c) => c.id === categoryID)?.icon || '* ',
      };
    }
    if (registrationData && lectures) {
      const currentUser = registrationData.find((e) => e.userID === azureUser.id);
      const usersRegistrations: LectureInfo[] = lectures
        .filter((e) => currentUser?.lectures.includes(e.id))
        .map((e) => ({ lecture: e, ...getColorAndIconForCategory(e.categoryID!) }));
      setUserAttendedLectures(usersRegistrations);
    }
  }, [registrationData, lectures, azureUser.id, categories]);

  if (isLoading) return <SmallLoader />;
  if (data?.ok || onCreate.isSuccess) {
    return (
      <Box
        sx={{
          height: '200px',
          display: 'grid',
          alignContent: 'center',
          justifyItems: 'center',
          rowGap: '5px',
        }}
      >
        <Typography variant="h4">
          {onCreate.isSuccess ? 'Tack för din anmälan!' : 'Din anmälan'}
        </Typography>
        {userAttendedLectures &&
          userAttendedLectures.map((lecture: LectureInfo) => (
            <SmallLectureCard lecture={lecture.lecture} color={lecture.color} icon={lecture.icon} />
          ))}
        <Button
          sx={{ marginTop: '10px', marginLeft: '10px' }}
          color="primary"
          variant="contained"
          onClick={onDeleteClick}
        >
          Ta bort anmälan
        </Button>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'grid', gridGap: '10px', marginTop: '40px' }}>
      <Typography variant="h4">Anmäl dig till kompetensdagen</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={values.remote}
            onChange={(e) => {
              handleChange(e);
              toggleOnlyRemote();
            }}
            name="remote"
          />
        }
        label="Visa bara de pass som går på distans"
      />
      <Box>
        {!!approvedLectures.length && (
          <>
            <Typography variant="h5">Välj pass</Typography>
            <FormGroup onChange={handleSelectChange}>
              {approvedLectures.map((e) => (
                <FormControlLabel key={e.id} control={<Checkbox value={e.id} />} label={e.title} />
              ))}
            </FormGroup>
          </>
        )}
      </Box>
      { !values.remote && (
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={5}
            value={values.message}
            onChange={handleChange}
            name="message"
            label="Matpreferens"
            variant="outlined"
          />
      )}
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Skicka in anmälan
      </Button>
    </Box>
  );
};

export default EventRegistration;
