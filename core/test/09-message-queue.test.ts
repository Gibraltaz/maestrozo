/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementName } from "@/Element";
import { MESSAGE_TYPE_CHANGE, MtzMessageQueue, mtzMessageQueueCreate, mtzMessageQueueGetMessageCount, mtzMessageQueuePopMessage, mtzMessageQueuePushMessage, MtzMessageTime } from "@/MessageQueue";


describe("Message queue", () => {
  let messageQueue: MtzMessageQueue;

  it("should be initialized", async () => {
    messageQueue = mtzMessageQueueCreate();
  });

  it("should have zero messages", async () => {
    const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
    expect(messageCount).to.equal(0);
  });

  it("should push a first message", async () => {
    mtzMessageQueuePushMessage(messageQueue, {
      at: 1234 as MtzMessageTime,
      elementPath: [ 'a' as ElementName ],
      messageType: MESSAGE_TYPE_CHANGE 
    });

  });

  it("should have a message", async () => {
    const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
    expect(messageCount).to.equal(1);
  });

  it("should push a second message", async () => {
    mtzMessageQueuePushMessage(messageQueue, {
      at: 1233 as MtzMessageTime,
      elementPath: [ 'b' as ElementName ],
      messageType: MESSAGE_TYPE_CHANGE 
    });

  });

  it("should have two messages", async () => {
    const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
    expect(messageCount).to.equal(2);
  });

  it("should not pop a message with a time in the future", async () => {
    const message = mtzMessageQueuePopMessage(messageQueue, 1230 as MtzMessageTime);
    expect(message).to.equal(null);
  });

  it("should pop the first message", async () => {
    const message = mtzMessageQueuePopMessage(messageQueue, 1240 as MtzMessageTime);
    expect(message).not.to.equal(null);
    assert(message !== null);
    expect(message).to.instanceof(Object);
    expect(message).to.have.property('at', 1233);
    expect(message).to.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ 'b' ]);
    expect(message).to.have.property('messageType', 'changed');
    const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
    expect(messageCount).to.equal(1);
  });

  it("should pop the second message", async () => {
    const message = mtzMessageQueuePopMessage(messageQueue, 1240 as MtzMessageTime);
    expect(message).not.to.equal(null);
    assert(message !== null);
    expect(message).to.instanceof(Object);
    expect(message).to.have.property('at', 1234);
    expect(message).to.have.property('elementPath');
    expect(message.elementPath).to.deep.equal([ 'a' ]);
    expect(message).to.have.property('messageType', 'changed');
    const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
    expect(messageCount).to.equal(0);
  });

  it("should not pop a message when queue is empty", async () => {
    const message = mtzMessageQueuePopMessage(messageQueue, 1230 as MtzMessageTime);
    expect(message).to.equal(null);
  });

});
