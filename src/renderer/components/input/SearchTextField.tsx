import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { ComponentType, useMemo } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useIntl } from 'react-intl';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';

export type SearchTextFieldProps = TextFieldProps & {
  icon?: ComponentType<SvgIconProps>;
  onChangeValue?: (value: string) => void;
};

const SearchTextField = ({ value, onChange, icon, onChangeValue, ...props }: SearchTextFieldProps) => {
  const intl = useIntl();

  const Icon = useMemo<ComponentType<SvgIconProps>>(() => icon || SearchOutlined, [icon]);

  return (
    <TextField
      placeholder={intl.formatMessage({ id: 'search' })}
      size="medium"
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onChangeValue?.(e.target.value);
      }}
      fullWidth
      InputProps={{
        startAdornment: (
          <>
            <InputAdornment position="start">
              <Icon fontSize={'small'} sx={{ ml: 1, color: 'text.disabled' }} />
            </InputAdornment>
          </>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton onClick={() => onChangeValue?.('')}>
              <CloseOutlined fontSize={'small'} sx={{ color: 'text.disabled' }} />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
    />
  );
};

export default SearchTextField;
