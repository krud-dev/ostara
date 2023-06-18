import { Box, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React, { useMemo } from 'react';
import { isString } from 'lodash';

type BlockContentProps = {
  file?: File | string;
};

export default function BlockContent({ file }: BlockContentProps) {
  const fileName = useMemo<string | undefined>(() => {
    if (!file) {
      return undefined;
    }
    return isString(file) ? file : file.name;
  }, [file]);

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: 'center' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="subtitle1">
          <FormattedMessage id="dropOrSelectFile" />
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
          {fileName || <FormattedMessage id="dropFilesHereOrClick" />}
        </Typography>
      </Box>
    </Stack>
  );
}
