import { BaseMutationOptions, BaseUseMutationResult, useBaseMutation } from 'renderer/apis/requests/base/useBaseMutation';
import { Subscriptions } from 'infra/subscriptions/subscriptions';

type Variables<EventKey extends keyof Subscriptions> = {
  event: EventKey;
  listener: Subscriptions[EventKey];
};

type Data = () => void;

export const subscribeToEvent = async <EventKey extends keyof Subscriptions>(
  variables: Variables<EventKey>
): Promise<Data> => {
  return await window.subscriptions.subscribe(variables.event, variables.listener);
};

export const useSubscribeToEvent = <EventKey extends keyof Subscriptions>(
  options?: BaseMutationOptions<Data, Variables<EventKey>>
): BaseUseMutationResult<Data, Variables<EventKey>> =>
  useBaseMutation<Data, Variables<EventKey>>(subscribeToEvent, options);
