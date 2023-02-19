import {
  ApplicationHealthUpdatedEventMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
} from '../../../common/generated_definitions';

export type StompTopics = {
  '/topic/instanceHealth': InstanceHealthChangedEventMessage$Payload;
  '/topic/applicationHealth': ApplicationHealthUpdatedEventMessage$Payload;
};

export type StompTopicKey = keyof StompTopics;

export const stompTopicsToSubscribe: StompTopicKey[] = ['/topic/applicationHealth', '/topic/instanceHealth'];
