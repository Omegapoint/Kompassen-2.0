import { FormGroup, Switch, Typography } from '@mui/material';
import { ChangeEvent, Fragment, ReactElement } from 'react';
import { padding } from '../../theme/Theme';

interface SwitchType {
  newLecture: boolean;
  newComment: boolean;
  adminRead: boolean;
  lectureTaken: boolean;
}

interface NotificationProps {
  checked: SwitchType;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface DataType {
  title: string;
  name: keyof SwitchType;
}

const data: DataType[] = [
  {
    title: 'Nytt inlägg i Community',
    name: 'newLecture',
  },
  {
    title: 'Inlägg jag kommenterat',
    name: 'newComment',
  },
  {
    title: 'Admin har läst mitt inlämnade pass',
    name: 'adminRead',
  },
  {
    title: 'Någon har ställt upp som passhållare',
    name: 'lectureTaken',
  },
];

const Notifications = ({ checked, handleChange }: NotificationProps): ReactElement => (
  <FormGroup
    sx={{
      display: 'grid',
      gridGap: `${padding.minimal} ${padding.large}`,
      alignItems: 'center',
      gridTemplateColumns: 'max-content max-content',
    }}
  >
    {data.map((e) => (
      <Fragment key={e.name}>
        <Typography>{e.title}</Typography>
        <Switch checked={checked[e.name]} onChange={handleChange} name={e.name} />
      </Fragment>
    ))}
  </FormGroup>
);
export default Notifications;
