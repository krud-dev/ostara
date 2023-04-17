import React, { ReactNode, useCallback, useMemo } from 'react';
import { InstanceAbility, InstanceRO } from '../../../common/generated_definitions';
import { useNavigatorTree } from '../../contexts/NavigatorTreeContext';
import { Button, Card, CardContent, CardHeader, Link, Stack, Typography } from '@mui/material';
import { IconViewer } from '../../components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../components/table/details/DetailsLabelValueHorizontal';
import { LoadingButton } from '@mui/lab';
import Page from '../../components/layout/Page';
import { showUpdateItemDialog } from '../../utils/dialogUtils';
import useItemDisplayName from '../../hooks/useItemDisplayName';
import { useUpdateInstanceHealth } from '../../apis/requests/instance/health/updateInstanceHealth';
import { ABILITIES_DOCUMENTATION_URL } from '../../constants/ui';

type InstanceAbilityErrorGuardProps = {
  ability: InstanceAbility;
  children: ReactNode;
};

export default function InstanceAbilityErrorGuard({ ability, children }: InstanceAbilityErrorGuardProps) {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();
  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);
  const hasAbility = useMemo(() => !!selectedItemAbilities?.includes(ability), [selectedItemAbilities, ability]);

  const displayName = useItemDisplayName(item);

  const healthState = useUpdateInstanceHealth();

  const refreshHandler = useCallback(async (): Promise<void> => {
    try {
      const result = await healthState.mutateAsync({ instanceId: item.id });
    } catch (e) {}
  }, [item, healthState]);

  const updateHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();
      showUpdateItemDialog(item);
    },
    [item]
  );

  const troubleshootingHandler = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();
    window.open(ABILITIES_DOCUMENTATION_URL, '_blank');
  }, []);

  if (hasAbility) {
    return <>{children}</>;
  }

  return (
    <Page sx={{ height: '100%' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <IconViewer icon={'ErrorOutlineOutlined'} sx={{ fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'instanceMissingAbility'} values={{ alias: displayName, ability: ability }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'checkActuatorSupportedAbilities'} />
          </Typography>

          <Card variant={'outlined'} sx={{ mt: 3 }}>
            <CardHeader title={<FormattedMessage id={'additionalInformation'} />} />

            <CardContent>
              <Stack spacing={2}>
                <DetailsLabelValueHorizontal label={<FormattedMessage id={'actuatorUrl'} />} value={item.actuatorUrl} />
                <DetailsLabelValueHorizontal
                  label={<FormattedMessage id={'troubleshooting'} />}
                  value={
                    <Link href={`#`} onClick={troubleshootingHandler}>
                      <FormattedMessage id={'learnMoreAboutInstanceAbilities'} />
                    </Link>
                  }
                />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" color="primary" onClick={updateHandler}>
              <FormattedMessage id={'updateInstance'} />
            </Button>
            <LoadingButton variant="outlined" color="primary" onClick={refreshHandler} loading={healthState.isLoading}>
              <FormattedMessage id={'refreshStatus'} />
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
