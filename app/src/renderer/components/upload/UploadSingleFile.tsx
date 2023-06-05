import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { styled, Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';
import { ReactNode } from 'react';
import { SxProps } from '@mui/system';

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(2, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

type UploadProps = DropzoneOptions & {
  file?: File | string;
  helperText?: ReactNode;
  error?: boolean;
  sx?: SxProps<Theme>;
};

export default function UploadSingleFile({ file, helperText, disabled, error, sx, ...other }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled: disabled,
    ...other,
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(disabled && {
            cursor: 'not-allowed !important',
            opacity: '1 !important',
          }),
        }}
      >
        <input {...getInputProps()} />

        <BlockContent file={file} />
      </DropZoneStyle>

      {!!fileRejections.length && <RejectionFiles fileRejections={fileRejections} />}

      {helperText}
    </Box>
  );
}
