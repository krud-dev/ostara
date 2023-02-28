import {
  ApplicationHealthUpdatedEventMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
  InstanceMetricRO,
} from '../../../common/generated_definitions';

export type StompTopics = {
  '/topic/instanceHealth': InstanceHealthChangedEventMessage$Payload;
  '/topic/applicationHealth': ApplicationHealthUpdatedEventMessage$Payload;
  '/topic/metric/:instanceId/:metricName': InstanceMetricRO;
};

export type StompTopicKey = keyof StompTopics;

export const stompTopicsToSubscribe: StompTopicKey[] = ['/topic/applicationHealth', '/topic/instanceHealth'];
