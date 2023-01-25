import React, { FunctionComponent } from 'react';
import Page from 'renderer/components/layout/Page';
import { Card, CardContent, CardHeader, MenuItem, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useUi } from 'renderer/contexts/UiContext';

const ApplicationSettingsPage: FunctionComponent = () => {
  const { darkMode, setDarkMode, developerMode, setDeveloperMode } = useUi();

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
            value={darkMode.toString()}
            onChange={(e) => setDarkMode(e.target.value === 'true')}
          >
            <MenuItem value={'true'}>
              <FormattedMessage id="dark" />
            </MenuItem>
            <MenuItem value={'false'}>
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
