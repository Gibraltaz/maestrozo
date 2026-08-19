/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementPath } from "./Element";

type MtzMessageTime = number & { __brand: 'mtz-msg-time' };

type MessageType =  string & { __brand: 'MsgEvent' };
    
const MESSAGE_TYPE_CHANGE = 'changed' as MessageType;

type MtzMessage = {
  at: MtzMessageTime;
  elementPath: ElementPath;
  messageType: MessageType;
};


type MtzMessageQueue = {
  messages: Array<MtzMessage>;
};

function mtzMessageQueueCreate(): MtzMessageQueue {
  return {
    messages: []
  };
}

function mtzMessageQueueGetMessageCount(messageQueue: MtzMessageQueue): number {
  return messageQueue.messages.length;
}


function mtzMessageQueuePopMessage(messageQueue: MtzMessageQueue, now: MtzMessageTime): MtzMessage | null {
  if (messageQueue.messages.length === 0)
    return null;             
  if (messageQueue.messages[0].at > now)
    return null;             
  return messageQueue.messages.shift() ?? null;
}


function mtzMessageQueuePushMessage(messageQueue: MtzMessageQueue, message: MtzMessage): void {
  messageQueue.messages.push(message);
  messageQueue.messages.sort( (msgA: MtzMessage, msgB: MtzMessage) => msgA.at - msgB.at );
}


export {
  MessageType,
  MESSAGE_TYPE_CHANGE,
  MtzMessageTime,
  MtzMessage,
  MtzMessageQueue,
  mtzMessageQueueCreate,
  mtzMessageQueueGetMessageCount,
  mtzMessageQueuePopMessage,
  mtzMessageQueuePushMessage
};
