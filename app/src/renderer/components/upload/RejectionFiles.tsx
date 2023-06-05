import { FileRejection } from 'react-dropzone';
import { alpha } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import React, { useCallback } from 'react';
import { isArray, isEmpty } from 'lodash';

type RejectionFilesProps = {
  fileRejections: FileRejection[];
};

export default function RejectionFiles({ fileRejections }: RejectionFilesProps) {
  const getFilesRejectedMessageKey = useCallback((rejections?: FileRejection | FileRejection[]): string => {
    if (!rejections) {
      return 'invalidFieldUpload';
    }

    if (isArray(rejections) && isEmpty(rejections)) {
      return 'invalidFieldUpload';
    }

    const fileRejection: FileRejection = isArray(rejections) ? rejections[0] : rejections;
    const { errors } = fileRejection;

    if (errors?.length) {
      const error = errors[0];
      const { code } = error;

      switch (code) {
        case 'file-too-large':
          return 'invalidFieldUploadTooLarge';
        case 'file-too-small':
          return 'invalidFieldUploadTooSmall';
        case 'too-many-files':
          return 'invalidFieldUploadTooManyFiles';
        case 'file-invalid-type':
          return 'invalidFieldUploadInvalidType';
        default:
          return 'invalidFieldUpload';
      }
    }

    return 'invalidFieldUpload';
  }, []);

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map((fileRejection) => {
        const { file } = fileRejection;
        const { path } = file;

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>
              {path}
            </Typography>

            <Typography variant="caption">
              <FormattedMessage id={getFilesRejectedMessageKey(fileRejection)} />
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
}
