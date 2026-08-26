/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { rm } from "node:fs/promises";

import { ElementName, ElementPath, MtzElement } from "@/Element";
import { 
  MESSAGE_TYPE_CHANGE, MtzMessageQueue, 
  mtzMessageQueueGetMessageCount, mtzMessageQueuePopMessage, mtzMessageQueuePushMessage, MtzMessageTime
} from "@/MessageQueue";

const tmpFilePath = (prefix:string) =>join( tmpdir(), `${prefix}-${randomUUID()}.tmp`);

import { FileStore } from '@/store/FileStore';
import { MtzEngine } from '@/Engine';

let storePath: string;

describe("Control message queue storing", () => {
  describe("First loading", () => {

    let fileStore: FileStore | null;
    let engine: MtzEngine;
    let messageQueueElement: MtzElement;
    let messageQueue: MtzMessageQueue;


    beforeAll( async () => {
      storePath = tmpFilePath('maestrozo')
      fileStore = new FileStore(storePath);
      engine = new MtzEngine();
      await engine.initialize(fileStore);
    });

    it("message-queue should be empty", async () => {
      const element = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
      messageQueueElement = element;
      expect(element).not.to.equal(null);
      expect(element).to.be.instanceof(Object);
      expect(element).to.have.property('elementName', 'message-queue');

      expect(element).to.have.property('data');
      assert(element.data !== null);
      expect(element.data).to.be.instanceof(Object);

      expect(element.data).to.have.property('messages');
      expect(element.data.messages).to.be.instanceof(Array);

      messageQueue = {
        messages: element.data.messages
      } as MtzMessageQueue ;

      expect(mtzMessageQueueGetMessageCount(messageQueue)).to.equal(0);
    });

    it("should push a first message", async () => {
      mtzMessageQueuePushMessage(messageQueue, {
        at: 1234 as MtzMessageTime,
        elementPath: [ 'a' as ElementName ],
        messageType: MESSAGE_TYPE_CHANGE 
      });
      const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
      expect(messageCount).to.equal(1);
    });

    it("should push a second message", async () => {
      mtzMessageQueuePushMessage(messageQueue, {
        at: 1233 as MtzMessageTime,
        elementPath: [ 'b' as ElementName ],
        messageType: MESSAGE_TYPE_CHANGE 
      });
      const messageCount = mtzMessageQueueGetMessageCount(messageQueue);
      expect(messageCount).to.equal(2);
    });

    it("should store message queue", async () => {
      await engine.modifyElement(messageQueueElement);
    });
  });

  describe("Second loading", () => {
    let fileStore: FileStore | null;
    let engine: MtzEngine;
    let messageQueue: MtzMessageQueue;


    beforeAll( async () => {
      fileStore = new FileStore(storePath);
      engine = new MtzEngine();
      await engine.initialize(fileStore);
    });

    afterAll( async () => {
      await rm(storePath);
    });


    it("message-queue should be loaded", async () => {
      const element = await engine.getElement(['#', 'system', 'message-queue'] as ElementPath);
      expect(element).not.to.equal(null);
      expect(element).to.be.instanceof(Object);
      expect(element).to.have.property('elementName', 'message-queue');

      expect(element).to.have.property('data');
      assert(element.data !== null);
      expect(element.data).to.be.instanceof(Object);

      expect(element.data).to.have.property('messages');
      expect(element.data.messages).to.be.instanceof(Array);

      messageQueue = {
        messages: element.data.messages
      } as MtzMessageQueue ;

    });

    it("message-queue should contain two messages", async () => {
      expect(mtzMessageQueueGetMessageCount(messageQueue)).to.equal(2);
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

  });
});
