import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import InstanceInfoValuesCard, {
  InstanceInfoCardValue,
} from 'renderer/pages/navigator/instance/info/components/InstanceInfoValuesCard';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import { InfoActuatorResponse$Git$Full$Typed } from 'common/manual_definitions';

type InstanceInfoGitFullProps = {
  git: InfoActuatorResponse$Git$Full$Typed;
};

export default function InstanceInfoGitFull({ git }: InstanceInfoGitFullProps) {
  const values = useMemo<InstanceInfoCardValue[]>(
    () => [
      {
        id: 'branch',
        label: <FormattedMessage id={'branch'} />,
        value: git.branch || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'commit',
        label: <FormattedMessage id={'commit'} />,
        value: git.commit?.id?.abbrev || <FormattedMessage id={'notAvailable'} />,
      },
      {
        id: 'commitTime',
        label: <FormattedMessage id={'time'} />,
        value: git.commit?.time?.date ? <FormattedDateAndRelativeTime value={git.commit.time?.date} /> : '',
        advanced: true,
        hide: !git.commit?.time?.date,
      },
      {
        id: 'commitUser',
        label: <FormattedMessage id={'commitUser'} />,
        value: `${git.commit?.user?.name || ''} ${git.commit?.user?.email ? `<${git.commit.user.email}>` : ''}`,
        advanced: true,
        hide: !git.commit?.user?.name && !git.commit?.user?.email,
      },
      {
        id: 'commitMessage',
        label: <FormattedMessage id={'commitMessage'} />,
        value: git.commit?.message?.full,
        advanced: true,
        hide: !git.commit?.message?.full,
      },
      {
        id: 'buildVersion',
        label: <FormattedMessage id={'buildVersion'} />,
        value: git.build?.version,
        advanced: true,
        hide: !git.build?.version,
      },
      {
        id: 'buildUser',
        label: <FormattedMessage id={'buildUser'} />,
        value: `${git.build?.user?.name || ''} ${git.build?.user?.email ? `<${git.build.user.email}>` : ''}`,
        advanced: true,
        hide: !git.build?.user?.name && !git.build?.user?.email,
      },
      {
        id: 'buildHost',
        label: <FormattedMessage id={'buildHost'} />,
        value: git.build?.host,
        advanced: true,
        hide: !git.build?.host,
      },
      {
        id: 'tags',
        label: <FormattedMessage id={'tags'} />,
        value: git.tags,
        advanced: true,
        hide: !git.tags,
      },
      {
        id: 'dirty',
        label: <FormattedMessage id={'dirty'} />,
        value: git.dirty ? <FormattedMessage id={'yes'} /> : <FormattedMessage id={'no'} />,
        advanced: true,
      },
      {
        id: 'totalCommitCount',
        label: <FormattedMessage id={'totalCommitCount'} />,
        value: git.total?.commit?.count,
        advanced: true,
        hide: !git.total?.commit?.count,
      },
      {
        id: 'closestTagName',
        label: <FormattedMessage id={'closestTagName'} />,
        value: git.closest?.tag?.name,
        advanced: true,
        hide: !git.closest?.tag?.name,
      },
      {
        id: 'closestTagCommitCount',
        label: <FormattedMessage id={'closestTagCommitCount'} />,
        value: git.closest?.tag?.commit?.count,
        advanced: true,
        hide: !git.closest?.tag?.commit?.count,
      },
      {
        id: 'remoteOriginUrl',
        label: <FormattedMessage id={'remoteOriginUrl'} />,
        value: git.remote?.origin?.url,
        advanced: true,
        hide: !git.remote?.origin?.url,
      },
    ],
    [git]
  );

  return <InstanceInfoValuesCard title={<FormattedMessage id={'git'} />} values={values} />;
}
