import React, { FunctionComponent } from 'react';
import Page from 'renderer/components/layout/Page';
import { Card, CardContent, CardHeader, MenuItem, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useUi } from 'renderer/contexts/UiContext';
import { ThemeSource } from 'renderer/apis/ui/getThemeSource';

const ApplicationSettingsPage: FunctionComponent = () => {
  const { themeSource, setThemeSource, developerMode, setDeveloperMode } = useUi();

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
            label={<FormattedMessage id="developerMode" />}
            margin="normal"
            select
            value={developerMode.toString()}
            onChange={(e) => setDeveloperMode(e.target.value === 'true')}
          >
            <MenuItem value={'false'}>
              <FormattedMessage id="off" />
            </MenuItem>
            <MenuItem value={'true'}>
              <FormattedMessage id="on" />
            </MenuItem>
          </TextField>
        </CardContent>
      </Card>
    </Page>
  );
};

export default ApplicationSettingsPage;
