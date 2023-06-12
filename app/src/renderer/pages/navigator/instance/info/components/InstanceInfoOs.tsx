import React, { ComponentType, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { InfoActuatorResponse$Os } from 'common/generated_definitions';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';
import { Box, SvgIconProps } from '@mui/material';
import WindowsIcon from 'renderer/components/icons/WindowsIcon';
import MacOsIcon from 'renderer/components/icons/MacOsIcon';
import LinuxIcon from 'renderer/components/icons/LinuxIcon';

type InstanceInfoOsProps = {
  os: InfoActuatorResponse$Os;
};

export default function InstanceInfoOs({ os }: InstanceInfoOsProps) {
  const OsIconComponent = useMemo<ComponentType<SvgIconProps> | undefined>(() => {
    if (os.name?.toLowerCase().includes('windows')) {
      return WindowsIcon;
    }
    if (os.name?.toLowerCase().includes('mac')) {
      return MacOsIcon;
    }
    if (os.name?.toLowerCase().includes('linux')) {
      return LinuxIcon;
    }
    return undefined;
  }, [os]);

  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'os',
        label: <FormattedMessage id={'os'} />,
        value: (
          <>
            {OsIconComponent && <OsIconComponent fontSize={'small'} sx={{ verticalAlign: 'middle', mr: 1 }} />}
            <Box component={'span'} sx={{ verticalAlign: 'middle' }}>{`${os.name} ${os.version}${
              os.arch ? ` (${os.arch})` : ''
            }`}</Box>
          </>
        ),
      },
    ],
    [os]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'os'} />} values={values} />;
}
