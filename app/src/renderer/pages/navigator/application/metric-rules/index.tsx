import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { Card } from '@mui/material';
import { ApplicationRO } from 'common/generated_definitions';
import ApplicationMetricRulesTable from './components/ApplicationMetricRulesTable';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

const ApplicationMetricRules: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  return (
    <Page>
      <Card>
        <ApplicationMetricRulesTable applicationId={item.id} />
      </Card>
    </Page>
  );
};

export default ApplicationMetricRules;
