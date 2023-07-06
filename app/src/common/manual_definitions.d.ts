import {
  AgentRO,
  Authentication$Basic,
  Authentication$BearerToken,
  Authentication$Header,
  Authentication$Inherit,
  Authentication$None,
  Authentication$QueryString,
  InfoActuatorResponse$Git$Full,
  InfoActuatorResponse$Git$Simple,
  InfoActuatorResponse$Git$Unknown,
} from './generated_definitions';

declare module './generated_definitions' {
  interface Authentication {
    type: string;
  }
}

export type Authentication$Typed =
  | Authentication$None$Typed
  | Authentication$Inherit$Typed
  | Authentication$Basic$Typed
  | Authentication$Header$Typed
  | Authentication$QueryString$Typed
  | Authentication$BearerToken$Typed;

export interface Authentication$None$Typed extends Authentication$None {
  type: 'none';
}

export interface Authentication$Inherit$Typed extends Authentication$Inherit {
  type: 'inherit';
}

export interface Authentication$Basic$Typed extends Authentication$Basic {
  type: 'basic';
}

export interface Authentication$Header$Typed extends Authentication$Header {
  type: 'header';
}

export interface Authentication$QueryString$Typed extends Authentication$QueryString {
  type: 'query-string';
}

export interface Authentication$BearerToken$Typed extends Authentication$BearerToken {
  type: 'bearer-token';
}

export type InfoActuatorResponse$Git$Typed =
  | InfoActuatorResponse$Git$Simple$Typed
  | InfoActuatorResponse$Git$Full$Typed
  | InfoActuatorResponse$Git$Unknown$Typed;

export interface InfoActuatorResponse$Git$Simple$Typed extends InfoActuatorResponse$Git$Simple {
  type: 'simple';
}

export interface InfoActuatorResponse$Git$Full$Typed extends InfoActuatorResponse$Git$Full {
  type: 'full';
}

export interface InfoActuatorResponse$Git$Unknown$Typed extends InfoActuatorResponse$Git$Unknown {
  type: 'unknown';
  [key: string]: any;
}

export type EnrichedAgentRO = AgentRO & {
  syncing: boolean;
};
