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
  onChange: any;
  onRookiesChange: (arg0: AzureUser[]) => void;
  fixedLecturers?: NewLectureLecturer[] | null;
}

const MultipleSelectBox = ({
  onChange,
  onRookiesChange,
  fixedLecturers,
}: MultipleSelectBoxProps): ReactElement => {
  const { azureUser } = useAppSelector((state) => state.session);
  const [options, setOptions] = useState<AzureUser[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // TRY: Could try setting the search term to azureUser.displayName?
  const fixedOption = [azureUser];

  const [lecturers, setLecturers] = React.useState([...fixedOption]);
  const [rookies, setRookies] = useState<AzureUser[]>([]);

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
  }, [fixedLecturers, azureUser]);
  const onLecturerChange = (event: any, newValue: AzureUser[]) => {
    setLecturers([
      ...fixedOption,
      ...newValue.filter((option) => fixedOption.indexOf(option) === -1),
    ]);
    onChange(event, newValue);
  };

  const handleClick = (lecturer: AzureUser) => {
    if (rookies.indexOf(lecturer) === -1) {
      setRookies([...rookies, lecturer]);
    } else {
      const withoutDeletedOption = rookies.filter((value) => value !== lecturer);
      setRookies(withoutDeletedOption);
    }
    console.log({ onRookiesChange });
    onRookiesChange(rookies);
  };

  const onKeyUp = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length >= 3) {
      searchAzureUsers(searchTerm).then((value) => {
        setOptions(
          value
            .filter(
              (user) =>
                user.mail &&
                (user.mail.includes('omegapoint.se') ||
                  user.mail.includes('integrationsbolaget.se') ||
                  user.mail.includes('molnbolaget.se'))
            )
            .filter((user) => user.displayName !== azureUser.displayName)
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
        disableCloseOnSelect
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.displayName}
              {...getTagProps({ index })}
              onClick={() => handleClick(option)}
              color={rookies.indexOf(option) !== -1 ? 'primary' : 'default'}
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
