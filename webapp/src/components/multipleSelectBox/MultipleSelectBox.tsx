import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { searchAzureUsers } from '../../api/GraphApi';
import { useAppSelector } from '../../lib/Lib';
import { AzureUser } from '../../reducers/session/actions';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const MultipleSelectBox = ({ onChange }: any, fixedLecturer: AzureUser) => {
  const { azureUser } = useAppSelector((state) => state.session);
  const [options, setOptions] = useState<AzureUser[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // TRY: Could try setting the search term to azureUser.displayName?
  const fixedOption = [azureUser];
  const [v, setV] = React.useState([...fixedOption]);

  const onLecturerChange = (event: any, newValue: AzureUser[]) => {
    setV([
      ...fixedOption,
      ...newValue.filter((option) => fixedOption.indexOf(option) === -1),
    ]);
    onChange(event, newValue);
  };
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
          ).filter((user) => user.displayName !== azureUser.displayName)
        );
      });
    }
  };

  return (
    <Autocomplete
      multiple
      value={v}
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
            disabled={fixedOption.indexOf(option) !== -1}
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
          <small style={{ position: 'relative', top: '2px', padding: '4px' }}>{option.mail}</small>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Talare" placeholder="" />
      )}
    />
  );
};

export default MultipleSelectBox;
