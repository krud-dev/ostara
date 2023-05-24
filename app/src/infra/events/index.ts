import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter/rxjs';
import { Events } from './events';

export const systemEvents = new EventEmitter() as TypedEmitter<Events>;
