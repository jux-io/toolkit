import { compositeTokenTypes, supportedTokenTypes } from '../constants';

export type SupportedTokenTypes = (typeof supportedTokenTypes)[number];
export type CompositeTokenTypes = (typeof compositeTokenTypes)[number];
