import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Link,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { FormEvent, ReactElement, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { NavLink, useNavigate } from 'react-router-dom';
import { createLecture, updateLecture } from '../../api/Api';
import { getAzureUser } from '../../api/GraphApi';
import useForm from '../../hooks/UseForm';
import { formIsInvalid, FormValidation, useFormValidation } from '../../hooks/UseFormValidation';
import { LARGE_STRING_LEN, SHORT_STRING_LEN } from '../../lib/Constants';
import { useAppSelector } from '../../lib/Lib';
import { Category, Format, Lecture, NewLectureLecturer } from '../../lib/Types';
import { AzureUser } from '../../reducers/session/actions';
import { colors, padding } from '../../theme/Theme';
import LecturerSelectBox from '../lecturerSelectBox/LecturerSelectBox';
import { InfoText } from './InfoText';

interface LectureFormProps {
  data?: Lecture;
}

const titleText = `Titeln måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const descriptionText = `Innehållet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const keyTakeawayText = `Key take away måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const targetAudienceyText = `Målgrupp måste vara mellan 1-${SHORT_STRING_LEN} tecken långt`;
const requirementsText = `Förkunskapskrav måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;
const messageText = `Meddelandet måste vara mellan 1-${LARGE_STRING_LEN} tecken långt`;

const invalidShortString = (str: string) => str.length < 1 || str.length > SHORT_STRING_LEN;
const invalidLongString = (str: string) => str.length < 1 || str.length > LARGE_STRING_LEN;
const invalidNullableLongString = (str: string) => str.length > LARGE_STRING_LEN;

interface FormValues {
  eventID: string;
  title: string;
  keyTakeAway: string;
  categoryID: string;
  formatID: string;
  targetAudience: string;
  internal: string;
  description: string;
  requirements: string;
  tags: string;
  message: string;
}

const useValidate = (values: FormValues): FormValidation<FormValues> => {
  const validate = {
    title: useFormValidation(values.title, titleText, invalidShortString),
    description: useFormValidation(values.description, descriptionText, invalidLongString),
    keyTakeAway: useFormValidation(values.keyTakeAway, keyTakeawayText, invalidShortString),
    targetAudience: useFormValidation(
      values.targetAudience,
      targetAudienceyText,
      invalidShortString
    ),
    requirements: useFormValidation(
      values.requirements,
      requirementsText,
      invalidNullableLongString
    ),
    message: useFormValidation(values.message, messageText, invalidNullableLongString),
  };

  return {
    validate,
    invalid: formIsInvalid(validate),
  };
};

// The more complex form to create a new lecture
const OPKoKoForm = ({ data }: LectureFormProps): ReactElement => {
  const allCategories = useAppSelector((state) => state.categories);
  const categories = allCategories.filter((e) => e.name !== 'Information');
  const { azureUser } = useAppSelector((state) => state.session);
  const formats = useAppSelector((state) => state.formats);
  const createLectureRequest = useMutation(createLecture);
  const updateLectureRequest = useMutation(updateLecture);
  const navigate = useNavigate();

  const defaultFormValue = {
    eventID: '334de9fb-058d-4eaa-a698-ca58aa2d2ab0',
    title: data?.title || '',
    keyTakeAway: data?.keyTakeaway || '',
    categoryID: categories.find((cat) => cat.id === data?.categoryID)?.id || categories[0].id,
    formatID: formats.find((format) => format.id === data?.formatID)?.id || formats[0].id,
    targetAudience: data?.targetAudience || '',
    internal: data?.internalPresentation?.toString() || 'false',
    tags: data?.tags?.toString() || '',
    description: data?.description || '',
    requirements: data?.requirements || '',
    message: data?.message || '',
  };

  const { values, handleChange } = useForm(defaultFormValue);
  const { validate, invalid } = useValidate(values);

  // Set/load lecturers
  const fixedLecturers: AzureUser[] = [azureUser];
  const [lecturers, setLecturers] = useState<AzureUser[]>([...fixedLecturers]);
  const previouslySetLecturers: NewLectureLecturer[] | null | undefined = data?.lecturers;

  useEffect(() => {
    if (previouslySetLecturers && !data?.idea) {
      const alreadyLecturers: AzureUser | AzureUser[] = [];
      previouslySetLecturers.map((usr) =>
        getAzureUser(usr.userID).then((lecturer) => {
          if (lecturer !== azureUser) {
            alreadyLecturers.push(lecturer);
          }
        })
      );
      setLecturers(alreadyLecturers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set/load rookies
  const priorRookies: AzureUser[] = [];
  useEffect(() => {
    previouslySetLecturers?.forEach((lecturer) => {
      if (lecturer.firstTimePresenting) {
        getAzureUser(lecturer.userID).then((user) => {
          priorRookies.push(user);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [rookies, setRookies] = useState<AzureUser[]>(priorRookies);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLecturerChange = (event: any, newValue: AzureUser[]) => {
    setLecturers([
      ...fixedLecturers,
      ...newValue.filter(
        (option) => fixedLecturers.findIndex((fixedOption) => fixedOption.id === option.id) === -1
      ),
    ]);
  };

  // ----- Handle Form Submit ----
  const handleSubmit = (evt: FormEvent, draft: boolean) => {
    evt.preventDefault();
    const category = categories.find((e) => e.id === values.categoryID) as Category;
    const format = formats.find((e) => e.id === values.formatID) as Format;
    const submitLecturers: NewLectureLecturer[] = lecturers.map((lecturer) => ({
      userID: lecturer.id,
      lectureID: null,
      firstTimePresenting: rookies.some((rookie) => rookie.id === lecturer.id),
    }));
    const formData = {
      title: values.title,
      description: values.description,
      eventID: '2a752f77-c5d7-4e1a-9c8b-d232282d6d2b',
      categoryID: category.id,
      keyTakeaway: values.keyTakeAway,
      requirements: values.requirements || null,
      message: values.message || null,
      internalPresentation: values.internal === 'true',
      targetAudience: values.targetAudience,
      formatID: format.id,
      lecturer: azureUser.displayName,
      lecturerID: azureUser.id,
      lectureStatusID: null,
      videoLink: null,
      // Not applicable for OPKoKo lectures
      remote: 'local',
      tags: [],
      duration: 0,
      maxParticipants: null,
      preparations: null,
      lecturers: submitLecturers,
    };
    if (data) {
      updateLectureRequest.mutate({ id: data.id, draft, ...formData });
    } else {
      createLectureRequest.mutate({ ...formData, draft });
    }
  };

  useEffect(() => {
    if (updateLectureRequest.isSuccess) {
      navigate(`/lecture/OPKoKo/${updateLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, updateLectureRequest.data?.id, updateLectureRequest.isSuccess]);

  useEffect(() => {
    if (createLectureRequest.isSuccess) {
      navigate(`/lecture/OPKoKo/${createLectureRequest.data?.id}/confirm`);
    }
  }, [navigate, createLectureRequest.data?.id, createLectureRequest.isSuccess]);

  return (
    <form>
      <Paper
        sx={{
          display: 'grid',
          padding: padding.large,
          justifyItems: 'start',
          rowGap: padding.medium,
        }}
      >
        <div style={{ display: 'grid', justifySelf: 'center' }}>
          <Typography
            sx={{ display: 'grid', justifySelf: 'center', color: colors.orange }}
            variant="h1"
          >
            {data ? 'Redigera pass till OPKoKo' : 'OPKoKo Call for Proposals'}
          </Typography>
          <Typography
            sx={{ display: 'grid', justifySelf: 'center', color: colors.orange }}
            variant="subtitle1"
          >
            Anmälan stänger kl 23.59 17 april 2022
          </Typography>
        </div>
        <InfoText />

        <LecturerSelectBox
          onLecturerChange={onLecturerChange}
          lecturers={lecturers}
          setLecturers={setLecturers}
          rookies={rookies}
          setRookies={setRookies}
        />

        <TextField
          fullWidth
          onChange={handleChange}
          required
          value={values.title}
          name="title"
          label="Titel: koncist och fyndigt - intressera oss för bidraget!"
          variant="outlined"
          {...validate.title}
        />

        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={8}
          maxRows={12}
          onChange={handleChange}
          required
          value={values.description}
          name="description"
          label="Beskrivning: publiceras i programmet och på Omegapoint Academy webb. Håll det kärnfullt,
          intressant, sälj in det till publiken! Gärna under 100 ord"
          variant="outlined"
        />

        <TextField
          {...validate.description}
          fullWidth
          multiline
          minRows={1}
          maxRows={2}
          onChange={handleChange}
          required
          value={values.keyTakeAway}
          name="keyTakeAway"
          label="Key Take Away: om deltagarna bara minns en sak - vad är det då de kommer att minnas?"
          variant="outlined"
        />
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Format (för speciellt önskemål om längd på formatet, ange i sista rutan i formuläret)
          </FormLabel>
          <RadioGroup name="formatID" onChange={handleChange} value={values.formatID}>
            {formats.map((e) =>
              e.name === 'Blixtföreläsning ' ? (
                <FormControlLabel
                  key={e.id}
                  value={e.id}
                  control={<Radio />}
                  // eslint-disable-next-line
                  label={e.name + ' (15min)'}
                />
              ) : (
                <FormControlLabel key={e.id} value={e.id} control={<Radio />} label={e.name} />
              )
            )}
          </RadioGroup>
        </div>
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Kategori
          </FormLabel>
          <RadioGroup name="categoryID" onChange={handleChange} value={values.categoryID}>
            {categories.map((e) => (
              <FormControlLabel key={e.id} value={e.id} control={<Radio />} label={e.name} />
            ))}
          </RadioGroup>
        </div>
        <div>
          <FormLabel sx={{ paddingTop: padding.minimal }} required component="legend">
            Intern presentation (ämnet känsligt/konfidentiellt)
          </FormLabel>
          <RadioGroup name="internal" onChange={handleChange} value={values.internal}>
            <FormControlLabel key="true" value="true" control={<Radio />} label="Ja" />
            <FormControlLabel key="false" value="false" control={<Radio />} label="Nej" />
          </RadioGroup>
        </div>
        <TextField
          {...validate.targetAudience}
          fullWidth
          onChange={handleChange}
          required
          value={values.targetAudience}
          name="targetAudience"
          label="Målgrupp: vem eller vilka tror du uppskattar ditt pass mest?"
          variant="outlined"
        />

        <TextField
          {...validate.requirements}
          fullWidth
          onChange={handleChange}
          name="requirements"
          label="Nivå på presentationen: kan en åhörare som är HELT nybörjare i ämnet ha utbyte av
          presentationen eller krävs det mer avancerade kunskaper?"
          variant="outlined"
          value={values.requirements}
        />

        <TextField
          {...validate.message}
          fullWidth
          onChange={handleChange}
          name="message"
          label="Meddelande: publiceras ej med bidraget, enbart info till
          programutskottet. Be om extra stöd, beskriv upplägget mer etc. Anmäler du ett bidrag åt en gäst? Skriv det här! "
          multiline
          minRows={3}
          maxRows={6}
          variant="outlined"
          value={values.message}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'max-content 1fr max-content',
            gridTemplateAreas: `"cancel . buttons"`,
            width: '100%',
          }}
        >
          <Link sx={{ gridArea: 'cancel' }} component={NavLink} to="/" variant="subtitle1">
            Avbryt
          </Link>
          <Box sx={{ gridArea: 'buttons', display: 'flex', gridGap: padding.standard }}>
            <Button
              variant="contained"
              disabled={invalid}
              color="primary"
              onClick={(e) => handleSubmit(e, false)}
            >
              Skicka in bidrag till urval
            </Button>
          </Box>
        </Box>
      </Paper>
    </form>
  );
};

export default OPKoKoForm;
