import { Card, CardContent, CardHeader } from '@mui/material';
import React, { useMemo } from 'react';
import CodeEditor from 'renderer/components/code/CodeEditor';

type InstanceInfoJsonCardProps = {
  title: string;
  object: any;
};

export default function InstanceInfoJsonCard({ title, object }: InstanceInfoJsonCardProps) {
  const json = useMemo<string>(() => JSON.stringify(object, null, 2), [object]);
  return (
    <Card>
      <CardHeader title={title} sx={{ textTransform: 'capitalize' }} />
      <CardContent sx={{ px: 0, pb: '0!important' }}>
        <CodeEditor language={'json'} value={json} readOnly editable={false} />
      </CardContent>
    </Card>
  );
}
