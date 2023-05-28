import {
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationMetricRuleTriggeredMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHeapdumpDownloadProgressMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceMetricRO,
  ThreadProfilingProgressMessage$Payload,
} from '../../../common/generated_definitions';

export type StompTopics = {
  '/topic/instanceHealth': InstanceHealthChangedEventMessage$Payload;
  '/topic/applicationHealth': ApplicationHealthUpdatedEventMessage$Payload;
  '/topic/metric/:instanceId/:metricName': InstanceMetricRO;
  '/topic/instanceHostname': InstanceHostnameUpdatedEventMessage$Payload;
  '/topic/instanceHeapdumpDownloadProgress': InstanceHeapdumpDownloadProgressMessage$Payload;
  '/topic/instanceThreadProfilingProgress': ThreadProfilingProgressMessage$Payload;
  '/topic/applicationMetricRuleTriggers': ApplicationMetricRuleTriggeredMessage$Payload;
};

export type StompTopicKey = keyof StompTopics;
