import {
  Authentication$Basic,
  Authentication$BearerToken,
  Authentication$Header,
  Authentication$Inherit,
  Authentication$None,
  Authentication$QueryString,
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
