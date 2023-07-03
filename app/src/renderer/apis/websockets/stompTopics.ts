import {
  ApplicationCreatedEventMessage$Payload,
  ApplicationDeletedEventMessage$Payload,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationMetricRuleTriggeredMessage$Payload,
  ApplicationUpdatedEventMessage$Payload,
  InstanceCreatedEventMessage$Payload,
  InstanceDeletedEventMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHeapdumpDownloadProgressMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceMetadataRefreshedMessage$Payload,
  InstanceMetricRO,
  InstanceUpdatedEventMessage$Payload,
  ThreadProfilingProgressMessage$Payload,
} from 'common/generated_definitions';

export type StompTopics = {
  '/topic/instanceCreation': InstanceCreatedEventMessage$Payload;
  '/topic/instanceUpdate': InstanceUpdatedEventMessage$Payload;
  '/topic/instanceDeletion': InstanceDeletedEventMessage$Payload;
  '/topic/instanceHealth': InstanceHealthChangedEventMessage$Payload;
  '/topic/instanceMetadata': InstanceMetadataRefreshedMessage$Payload;
  '/topic/applicationCreation': ApplicationCreatedEventMessage$Payload;
  '/topic/applicationUpdate': ApplicationUpdatedEventMessage$Payload;
  '/topic/applicationDeletion': ApplicationDeletedEventMessage$Payload;
  '/topic/applicationHealth': ApplicationHealthUpdatedEventMessage$Payload;
  '/topic/metric/:instanceId/:metricName': InstanceMetricRO;
  '/topic/instanceHostname': InstanceHostnameUpdatedEventMessage$Payload;
  '/topic/instanceHeapdumpDownloadProgress': InstanceHeapdumpDownloadProgressMessage$Payload;
  '/topic/instanceThreadProfilingProgress': ThreadProfilingProgressMessage$Payload;
  '/topic/applicationMetricRuleTriggers': ApplicationMetricRuleTriggeredMessage$Payload;
};

export type StompTopicKey = keyof StompTopics;
