import {
  ApplicationHealthUpdatedEventMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHeapdumpDownloadProgressMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceMetricRO,
} from '../../../common/generated_definitions';

export type StompTopics = {
  '/topic/instanceHealth': InstanceHealthChangedEventMessage$Payload;
  '/topic/applicationHealth': ApplicationHealthUpdatedEventMessage$Payload;
  '/topic/metric/:instanceId/:metricName': InstanceMetricRO;
  '/topic/instanceHostname': InstanceHostnameUpdatedEventMessage$Payload;
  '/topic/instanceHeapdumpDownloadProgress': InstanceHeapdumpDownloadProgressMessage$Payload;
};

export type StompTopicKey = keyof StompTopics;
