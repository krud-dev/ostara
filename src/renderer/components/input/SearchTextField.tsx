import IconButton from '@mui/material/IconButton';
import * as React from 'react';
import { ComponentType, useCallback, useMemo, useRef } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useIntl } from 'react-intl';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { isNil } from 'lodash';

export type SearchTextFieldProps = TextFieldProps & {
  icon?: ComponentType<SvgIconProps>;
  onChangeValue?: (value: string) => void;
};

const SearchTextField = ({ value, onChange, icon, placeholder, onChangeValue, ...props }: SearchTextFieldProps) => {
  const intl = useIntl();

  const inputRef = useRef<HTMLInputElement>(null);

  const Icon = useMemo<ComponentType<SvgIconProps>>(() => icon || SearchOutlined, [icon]);
  const placeholderInternal = useMemo<string>(
    () => (!isNil(placeholder) ? placeholder : intl.formatMessage({ id: 'search' })),
    [placeholder, intl]
  );

  const clearHandler = useCallback(() => {
    onChangeValue?.('');
  }, [onChangeValue]);

  const focusHandler = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <TextField
      inputRef={inputRef}
      placeholder={placeholderInternal}
      size="medium"
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onChangeValue?.(e.target.value);
      }}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" onClick={focusHandler}>
            <Icon fontSize={'small'} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton onClick={clearHandler} size={'small'}>
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
