import {
  BaseMutationOptions,
  BaseUseMutationResult,
  useBaseMutation,
} from 'renderer/apis/requests/base/useBaseMutation';
import { axiosInstance } from '../../axiosInstance';
import { AxiosResponse } from 'axios';
import { SEND_FEEDBACK_URL } from '../../../constants/ui';

type Variables = {
  text: string;
  email: string;
};

type Data = void;

export const sendFeedback = async (variables: Variables): Promise<Data> => {
  await axiosInstance.post<Data, AxiosResponse<Data>>(
    SEND_FEEDBACK_URL,
    {
      text: variables.text,
      email: variables.email,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }
  );
};

export const useSendFeedback = (
  options?: BaseMutationOptions<Data, Variables>
): BaseUseMutationResult<Data, Variables> => useBaseMutation<Data, Variables>(sendFeedback, options);
