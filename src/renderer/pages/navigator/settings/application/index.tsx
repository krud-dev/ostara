import React, { FunctionComponent } from 'react';
import Page from 'renderer/components/layout/Page';
import { Card, CardContent, CardHeader, MenuItem, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useUi } from 'renderer/contexts/UiContext';
import { map } from 'lodash';
import locales from '../../../../lang';
import { ThemeSource } from '../../../../../infra/ui/models/electronTheme';

const ApplicationSettingsPage: FunctionComponent = () => {
  const { themeSource, setThemeSource, localeInfo, setLocale } = useUi();

  return (
    <Page>
      <Card>
        <CardHeader title={<FormattedMessage id="application" />} />
        <CardContent>
          <TextField
            fullWidth
            label={<FormattedMessage id="theme" />}
            margin="normal"
            select
            value={themeSource}
            onChange={(e) => setThemeSource(e.target.value as ThemeSource)}
          >
            <MenuItem value={'system'}>
              <FormattedMessage id="system" />
            </MenuItem>
            <MenuItem value={'dark'}>
              <FormattedMessage id="dark" />
            </MenuItem>
            <MenuItem value={'light'}>
              <FormattedMessage id="light" />
            </MenuItem>
          </TextField>

          <TextField
            fullWidth
            label={<FormattedMessage id="language" />}
            margin="normal"
            select
            value={localeInfo.id}
            onChange={(e) => setLocale(e.target.value)}
          >
            {map(locales, (l) => (
              <MenuItem value={l.id} key={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>
    </Page>
  );
};

export default ApplicationSettingsPage;
