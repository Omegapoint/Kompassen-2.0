import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Chip, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React, { ReactElement, useState } from 'react';
import { searchAzureUsers } from '../../api/GraphApi';
import { AzureUser } from '../../reducers/session/actions';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface LecturerSelectBoxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLecturerChange: (event: any, arg1: AzureUser[]) => void;
  setLecturers: (arg0: AzureUser[]) => void;
  lecturers: AzureUser[] | [];
  rookies: AzureUser[];
  setRookies: (arg0: AzureUser[]) => void;
}

const LecturerSelectBox = ({
  onLecturerChange,
  lecturers,
  rookies,
  setRookies,
}: LecturerSelectBoxProps): ReactElement => {
  const [options, setOptions] = useState<AzureUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [rookiesFromCurrentEdit, setRookiesFromCurrentEdit] = useState<AzureUser[]>(rookies ?? []);

  const handleClick = (lecturer: AzureUser) => {
    if (rookies.findIndex((rookie) => lecturer.id === rookie.id) === -1) {
      setRookies([...rookies, lecturer]);
    } else {
      const filteredRookies = rookies.filter((rookie) => lecturer.id !== rookie.id);
      setRookies(filteredRookies);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onKeyUp = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length >= 3) {
      searchAzureUsers(searchTerm).then((value) => {
        setOptions(
          value.filter(
            (user) =>
              user.mail &&
              (user.mail.includes('omegapoint.se') ||
                user.mail.includes('integrationsbolaget.se') ||
                user.mail.includes('molnbolaget.se'))
          )
        );
      });
    }
  };

  return (
    <>
      <Typography>
        Markera de talare som är Rookies - en person som talar på sitt första deltagande på en
        OPKoKo.{' '}
      </Typography>
      <Autocomplete
        multiple
        value={lecturers}
        filterOptions={(x) => x}
        className="multiSelectBox"
        fullWidth
        options={options}
        onChange={onLecturerChange}
        onKeyUp={onKeyUp}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.displayName}
              {...getTagProps({ index })}
              onClick={() => handleClick(option)}
              color={
                rookies.findIndex((rookie) => rookie.id === option.id) !== -1
                  ? 'primary'
                  : 'default'
              }
            />
          ))
        }
        getOptionLabel={(option) => option.displayName}
        noOptionsText="Start searching for options..."
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              value
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.displayName}{' '}
            <small style={{ position: 'relative', top: '2px', padding: '4px' }}>
              {option.mail}
            </small>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Talare, markera talare som är Rookies" placeholder="" />
        )}
      />
    </>
  );
};

export default LecturerSelectBox;
