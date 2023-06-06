import React, { FunctionComponent, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Card } from '@mui/material';
import { ApplicationRO } from '../../../../../common/generated_definitions';
import ApplicationMetricRulesTable from './components/ApplicationMetricRulesTable';

const ApplicationMetricRules: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

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
