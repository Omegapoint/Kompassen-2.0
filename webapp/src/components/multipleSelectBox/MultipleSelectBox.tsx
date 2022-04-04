import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Chip, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React, { ReactElement, useEffect, useState } from 'react';
import { getAzureUser, searchAzureUsers } from '../../api/GraphApi';
import { useAppSelector } from '../../lib/Lib';
import { NewLectureLecturer } from '../../lib/Types';
import { AzureUser } from '../../reducers/session/actions';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface MultipleSelectBoxProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLecturerChange: (event: any, arg1: AzureUser[]) => void;
  onRookiesChange: (arg0: AzureUser[]) => void;
  fixedLecturers?: NewLectureLecturer[] | null;
  setLecturers: (arg0: AzureUser[]) => void;
  lecturers?: AzureUser[];
  rookies?: AzureUser[];
}

const MultipleSelectBox = ({
  onLecturerChange,
  onRookiesChange,
  fixedLecturers,
  lecturers,
  setLecturers,
  rookies,
}: MultipleSelectBoxProps): ReactElement => {
  const { azureUser } = useAppSelector((state) => state.session);
  const [options, setOptions] = useState<AzureUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rookiesFromCurrentEdit, setRookiesFromCurrentEdit] = useState<AzureUser[]>(rookies ?? []);

  useEffect(() => {
    if (fixedLecturers) {
      const alreadyLecturers: AzureUser | AzureUser[] = [];
      fixedLecturers.map((user) =>
        getAzureUser(user.userID).then((lecturer) => {
          if (lecturer !== azureUser) {
            alreadyLecturers.push(lecturer);
          }
        })
      );
      setLecturers(alreadyLecturers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedLecturers, azureUser]);

  const handleClick = (lecturer: AzureUser) => {
    if (rookiesFromCurrentEdit.indexOf(lecturer) === -1) {
      rookiesFromCurrentEdit.push(lecturer);
      setRookiesFromCurrentEdit(rookiesFromCurrentEdit);
    } else {
      const index = rookiesFromCurrentEdit.indexOf(lecturer);
      rookiesFromCurrentEdit.splice(index, 1);
      setRookiesFromCurrentEdit(rookiesFromCurrentEdit);
    }
    onRookiesChange(rookiesFromCurrentEdit);
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
              color={rookiesFromCurrentEdit.indexOf(option) !== -1 ? 'primary' : 'default'}
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

export default MultipleSelectBox;
