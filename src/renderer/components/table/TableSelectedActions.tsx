import { Checkbox, IconButton, Stack, StackProps, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { FormattedMessage } from 'react-intl';
import { useTable } from 'renderer/components/table/TableContext';
import { IconViewer } from 'renderer/components/common/IconViewer';
import React from 'react';

interface TableSelectedActionsProps extends StackProps {}

export default function TableSelectedActions({ sx, ...other }: TableSelectedActionsProps) {
  const {
    entity,
    selectedRows,
    selectAllIndeterminate,
    selectAllChecked,
    hasSelectedRows,
    selectAllRowsHandler,
    dense,
    massActionsHandler,
  } = useTable();

  if (!hasSelectedRows) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: COMPONENTS_SPACING,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        height: 58,
        borderRadius: 1,
        position: 'absolute',
        bgcolor: 'primary.lighter',
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={selectAllIndeterminate}
        checked={selectAllChecked}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => selectAllRowsHandler(event.target.checked)}
      />

      <Typography
        variant="subtitle1"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {selectedRows.length} <FormattedMessage id={'selected'} />
      </Typography>

      {entity.massActions.map((action) => (
        <Tooltip title={<FormattedMessage id={action.labelId} />} key={action.id}>
          <IconButton color={'primary'} onClick={() => massActionsHandler(action.id, selectedRows)}>
            <IconViewer icon={action.icon} fontSize={'small'} />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}
