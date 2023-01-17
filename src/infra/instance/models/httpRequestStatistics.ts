export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE';
export type HttpRequestOutcome = 'CLIENT_ERROR' | 'SERVER_ERROR' | 'SUCCESS';
export type InstanceHttpRequestStatisticsByMethod = {
  method: HttpMethod;
  statistics: InstanceHttpRequestStatistics;
};
export type InstanceHttpRequestStatisticsByOutcome = {
  outcome: HttpRequestOutcome;
  statistics: InstanceHttpRequestStatistics;
};
export type InstanceHttpRequestStatisticsByStatus = {
  status: number;
  statistics: InstanceHttpRequestStatistics;
};

export type InstanceHttpRequestStatisticsByException = {
  exception: 'None' | string;
  statistics: InstanceHttpRequestStatistics;
};
export type InstanceHttpRequestStatistics = {
  uri: string;
  count: number;
  totalTime: number;
  max: number;
};

export type InstanceHttpRequestStatisticsForUriOptions = {
  method?: HttpMethod;
  outcome?: HttpRequestOutcome;
  status?: number;
  exception?: 'None' | string;
};
