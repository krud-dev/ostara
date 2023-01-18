import React, { useMemo } from 'react';
import yaml from 'js-yaml';
import CodeEditor from 'renderer/components/code/CodeEditor';

type InstancePropertiesCodeProps = {
  properties: { [key: string]: unknown };
};

export default function InstancePropertiesCode({ properties }: InstancePropertiesCodeProps) {
  const code = useMemo<string>(() => yaml.dump(properties), [properties]);

  return <CodeEditor language={'yaml'} value={code} editable={false} />;
}
