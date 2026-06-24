/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ComponentMessageScope, Message, MessageEvent, MessageScope, PinMessageScope } from '@/global/messages';
import { ComponentPath, MessageTime } from '@/global/types';
import { InputPinName } from '@/interfaces/IPin';

interface BaseMessage {
  at: MessageTime,
  scope: MessageScope
  event: MessageEvent
}

interface ComponentMessage extends BaseMessage {
  scope: ComponentMessageScope;
  componentPath: ComponentPath;
}

interface PinMessage extends BaseMessage {
  scope: PinMessageScope;
  componentPath: ComponentPath;
  inputPinName: InputPinName
}


interface MessageQueue {
  get messageCount(): number
  pushMessage(message: Message): void;
  popMessage(now: MessageTime): Message | undefined;
}

export {
  MessageQueue,
  ComponentMessage, 
  PinMessage,
};
