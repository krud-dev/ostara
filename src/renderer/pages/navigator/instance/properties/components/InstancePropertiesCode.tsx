import React, { useMemo } from 'react';
import yaml from 'js-yaml';
import CodeEditor from 'renderer/components/code/CodeEditor';
import { Extension } from '@codemirror/state';
import { search } from '@codemirror/search';
import { Box } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useElementDocumentHeight from 'renderer/hooks/useElementDocumentHeight';
import { indentFoldingExtension } from '../../../../../components/code/extensions/indentFoldingExtension';
import { toString } from 'lodash';

type InstancePropertiesCodeProps = {
  properties: { [key: string]: unknown };
};

export default function InstancePropertiesCode({ properties }: InstancePropertiesCodeProps) {
  const code = useMemo<string>(
    () => yaml.dump(properties, { lineWidth: 1024, sortKeys: (a, b) => toString(a).localeCompare(toString(b)) }),
    [properties]
  );

  const searchExtension = useMemo<Extension>(() => search({ top: false }), []);

  const { elementHeight, elementRef } = useElementDocumentHeight();

  return (
    <Box ref={elementRef} sx={{ height: elementHeight }}>
      <PerfectScrollbar options={{ wheelPropagation: true }}>
        <CodeEditor language={'yaml'} value={code} readOnly extensions={[indentFoldingExtension, searchExtension]} />
      </PerfectScrollbar>
    </Box>
  );
}
