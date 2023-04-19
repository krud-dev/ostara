import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';

export type AnalyticsEvent = {
  name: string;
  params: { [key: string]: string };
};

type Variables = {
  measurementId: string;
  apiSecret: string;
  clientId: string;
  sessionId: string;
  events: AnalyticsEvent[];
};

type Data = boolean;

export const sendEvents = async (variables: Variables): Promise<Data> => {
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${variables.measurementId}&api_secret=${variables.apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: variables.clientId,
          events: variables.events.map((event) => ({
            ...event,
            params: { ...event.params, session_id: variables.sessionId },
          })),
        }),
      }
    );
  } catch (e) {
    return false;
  }
  return true;
};

export const useSendEvents = (options?: BaseMutationOptions<Data, Variables>): BaseUseMutationResult<Data, Variables> =>
  useBaseMutation<Data, Variables>(sendEvents, options);
