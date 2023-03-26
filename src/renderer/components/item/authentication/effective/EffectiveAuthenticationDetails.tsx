import React, { ComponentType, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ApplicationRO,
  Authentication,
  EffectiveAuthentication,
  FolderRO,
} from '../../../../../common/generated_definitions';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import DetailsLabelValueHorizontal from '../../../table/details/DetailsLabelValueHorizontal';
import EffectiveAuthenticationDetailsBasic from './EffectiveAuthenticationDetailsBasic';
import EffectiveAuthenticationDetailsNone from './EffectiveAuthenticationDetailsNone';
import EffectiveAuthenticationDetailsInherit from './EffectiveAuthenticationDetailsInherit';
import EffectiveAuthenticationDetailsHeader from './EffectiveAuthenticationDetailsHeader';
import EffectiveAuthenticationDetailsBearer from './EffectiveAuthenticationDetailsBearer';
import EffectiveAuthenticationDetailsQuerystring from './EffectiveAuthenticationDetailsQuerystring';
import { showUpdateItemDialog } from '../../../../utils/dialogUtils';
import { LoadingButton } from '@mui/lab';
import { useCrudShow } from '../../../../apis/requests/crud/crudShow';
import { applicationCrudEntity } from '../../../../apis/requests/crud/entity/entities/application.crudEntity';
import { folderCrudEntity } from '../../../../apis/requests/crud/entity/entities/folder.crudEntity';

export type EffectiveAuthenticationDetailsProps = {
  authentication?: Authentication;
  effectiveAuthentication: Partial<EffectiveAuthentication>;
};

const EffectiveAuthenticationDetails: FunctionComponent<EffectiveAuthenticationDetailsProps> = ({
  authentication,
  effectiveAuthentication,
}: EffectiveAuthenticationDetailsProps) => {
  const [internalEffectiveAuthentication, setInternalEffectiveAuthentication] =
    useState<Partial<EffectiveAuthentication>>(effectiveAuthentication);

  useEffect(() => {
    setInternalEffectiveAuthentication(effectiveAuthentication);
  }, [effectiveAuthentication]);

  const show = useMemo<boolean>(
    () =>
      (!authentication || authentication.type === 'inherit') &&
      !!internalEffectiveAuthentication.sourceId &&
      !!internalEffectiveAuthentication.sourceType,
    [authentication, internalEffectiveAuthentication]
  );
  const loading = useMemo<boolean>(
    () => !internalEffectiveAuthentication.authentication,
    [internalEffectiveAuthentication]
  );

  const EffectiveAuthenticationDetailsType = useMemo<ComponentType<EffectiveAuthenticationDetailsProps>>(() => {
    switch (internalEffectiveAuthentication.authentication?.type) {
      case 'none':
      default:
        return EffectiveAuthenticationDetailsNone;
      case 'inherit':
        return EffectiveAuthenticationDetailsInherit;
      case 'basic':
        return EffectiveAuthenticationDetailsBasic;
      case 'header':
        return EffectiveAuthenticationDetailsHeader;
      case 'bearer-token':
        return EffectiveAuthenticationDetailsBearer;
      case 'query-string':
        return EffectiveAuthenticationDetailsQuerystring;
    }
  }, [internalEffectiveAuthentication.authentication]);

  const typeMessageId = useMemo<string>(() => {
    switch (internalEffectiveAuthentication.authentication?.type) {
      case 'none':
      default:
        return 'none';
      case 'inherit':
        return 'inherit';
      case 'basic':
        return 'basic';
      case 'header':
        return 'header';
      case 'bearer-token':
        return 'bearer';
      case 'query-string':
        return 'querystring';
    }
  }, [internalEffectiveAuthentication.authentication]);

  const showItemState = useCrudShow<ApplicationRO | FolderRO>();

  const updateHandler = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      if (!internalEffectiveAuthentication.sourceId) {
        return;
      }

      let item: ApplicationRO | FolderRO | undefined;
      try {
        item = await showItemState.mutateAsync({
          entity:
            internalEffectiveAuthentication.sourceType === 'APPLICATION' ? applicationCrudEntity : folderCrudEntity,
          id: internalEffectiveAuthentication.sourceId,
        });
      } catch (e) {}
      if (!item) {
        return;
      }

      const result = (await showUpdateItemDialog(item)) as ApplicationRO | FolderRO | undefined;
      if (result) {
        setInternalEffectiveAuthentication((prev) => ({
          ...prev,
          authentication: result.authentication,
        }));
      }
    },
    [internalEffectiveAuthentication, showItemState, setInternalEffectiveAuthentication]
  );

  if (!show) {
    return null;
  }

  return (
    <Card variant={'outlined'} sx={{ mt: 2 }}>
      <CardContent>
        <Stack direction={'column'} spacing={1}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Typography variant={'subtitle1'}>
              <FormattedMessage id={'effectiveAuthentication'} />
            </Typography>
            <LoadingButton
              variant={'outlined'}
              size={'small'}
              loading={showItemState.isLoading}
              onClick={updateHandler}
            >
              <FormattedMessage id={'update'} />
            </LoadingButton>
          </Stack>

          {loading && (
            <Typography variant={'body2'} sx={{ color: 'text.secondary' }}>
              <FormattedMessage id={'loading'} />
            </Typography>
          )}

          <DetailsLabelValueHorizontal
            label={<FormattedMessage id={'type'} />}
            value={<FormattedMessage id={typeMessageId} />}
          />

          <EffectiveAuthenticationDetailsType effectiveAuthentication={internalEffectiveAuthentication} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EffectiveAuthenticationDetails;
