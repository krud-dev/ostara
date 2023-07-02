import { Checkbox, IconButton, Stack, StackProps, Tooltip, Typography } from '@mui/material';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';
import { FormattedMessage } from 'react-intl';
import { useTableContext } from 'renderer/components/table/TableContext';
import { IconViewer } from 'renderer/components/common/IconViewer';
import React, { useCallback } from 'react';
import ToolbarButton from '../common/ToolbarButton';

interface TableSelectedActionsProps extends StackProps {}

export default function TableSelectedActions({ sx, ...other }: TableSelectedActionsProps) {
  const {
    entity,
    selectedRows,
    selectAllIndeterminate,
    selectAllChecked,
    hasSelectedRows,
    selectAllRowsHandler,
    massActionsHandler,
  } = useTableContext();

  const [loadingActionIds, setLoadingActionIds] = React.useState<string[]>([]);

  const massActionClickHandler = useCallback(
    async (event: React.MouseEvent, actionId: string): Promise<void> => {
      event.stopPropagation();

      setLoadingActionIds((prev) => [...prev, actionId]);

      await massActionsHandler(actionId, selectedRows);

      setLoadingActionIds((prev) => prev.filter((id) => id !== actionId));
    },
    [massActionsHandler, selectedRows, setLoadingActionIds]
  );

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
        height: 38,
        borderRadius: 1,
        position: 'absolute',
        bgcolor: 'primary.lighter',
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
          ml: 3,
          flexGrow: 1,
          color: 'primary.main',
        }}
      >
        {selectedRows.length} <FormattedMessage id={'selected'} />
      </Typography>

      {entity.massActions.map((action) => {
        const disabled = loadingActionIds.includes(action.id);
        return (
          <ToolbarButton
            tooltip={<FormattedMessage id={action.labelId} />}
            icon={action.icon}
            color={'primary'}
            disabled={disabled}
            onClick={(event) => massActionClickHandler(event, action.id)}
            key={action.id}
          />
        );
      })}
    </Stack>
  );
}
