import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { MessageQueueImpl } from '@/MessageQueueImpl';
import {
  MessageTime, 
  ComponentMessage, COMPONENT_MESSAGE_SCOPE, 
  PinMessage, PIN_MESSAGE_SCOPE,
  MESSAGE_CREATION
} from '@/interfaces/MessageQueue';
import { ComponentPath } from '@/interfaces/IComponent';


describe("Message queue", () => {
  let engine : Engine;

  beforeAll(() => {
    engine = new Engine();
  });

  describe("Message queue with a single message", () => {
    it("should find message queue", () => {
      expect(engine).to.have.property('messageQueue');
      const messageQueue = engine.messageQueue;
      expect(messageQueue).to.be.instanceOf(MessageQueueImpl);
      expect(messageQueue.messageCount).to.equal(0);
    });

    it("should push a component message", () => {
      const messageQueue = engine.messageQueue;
      const msg: ComponentMessage  = {
        at: 1234 as MessageTime,
        scope: COMPONENT_MESSAGE_SCOPE,
        event: MESSAGE_CREATION,
        componentPath:['runtime','my-component'] as ComponentPath
      };
      messageQueue.pushMessage(msg);
      expect(messageQueue.messageCount).to.equal(1);
    });

    it("should not pop a message scheduled in the future", () => {
      const messageQueue = engine.messageQueue;
      const message = messageQueue.popMessage(1233 as MessageTime);
      expect(message).to.equal(undefined);
    });

    it("should pop a message when its scheduled time is reached", () => {
      const messageQueue = engine.messageQueue;
      const message = messageQueue.popMessage(1234 as MessageTime);
      if (message === undefined)
        throw new Error("Can't pop last message");
      expect(message).to.be.instanceOf(Object);
      expect(message).to.have.property('at', 1234);
      expect(message).to.have.property('scope', 'component');
      expect(message).to.have.property('event', 'created');
      expect(message).to.have.property('componentPath');
      expect(message.componentPath).to.deep.equal(['runtime','my-component']);
    });

    it("should have an empty queue", () => {
      const messageQueue = engine.messageQueue;
      expect(messageQueue.messageCount).to.equal(0);
    });

    it("should not pop a message when queue is empty", () => {
      const messageQueue = engine.messageQueue;
      const message = messageQueue.popMessage(1233 as MessageTime);
      expect(message).to.equal(undefined);
    });

  });

  describe("Message queue with two messages", () => {
    it("should push two messages", () => {
      const messageQueue = engine.messageQueue;
      // first message
      messageQueue.pushMessage({
        at: 1234 as MessageTime,
        scope: COMPONENT_MESSAGE_SCOPE,
        event: MESSAGE_CREATION,
        componentPath:['runtime','my-component'] as ComponentPath
      });
      expect(messageQueue.messageCount).to.equal(1);
      // second message
      messageQueue.pushMessage({
        at: 1235 as MessageTime,
        scope: COMPONENT_MESSAGE_SCOPE,
        event: MESSAGE_CREATION,
        componentPath:['runtime','my-component'] as ComponentPath
      });
      expect(messageQueue.messageCount).to.equal(2);
    });

    it("should pop the first message", () => {
      const messageQueue = engine.messageQueue;
      const message = messageQueue.popMessage(1236 as MessageTime);
      if (message === undefined)
        throw new Error("Can't pop last message");
      expect(message).to.be.instanceOf(Object);
      expect(message).to.have.property('at', 1234);
      expect(message).to.have.property('scope', 'component');
      expect(message).to.have.property('event', 'created');
      expect(message).to.have.property('componentPath');
      const componentMessage = message as ComponentMessage;
      expect(componentMessage.componentPath).to.deep.equal(['runtime','my-component']);
    });

    it("should pop the second message", () => {
      const messageQueue = engine.messageQueue;
      const message = messageQueue.popMessage(1236 as MessageTime);
      if (message === undefined)
        throw new Error("Can't pop last message");
      expect(message).to.be.instanceOf(Object);
      expect(message).to.have.property('at', 1235);
      expect(message).to.have.property('scope', 'component');
      expect(message).to.have.property('event', 'created');
      expect(message).to.have.property('componentPath');
      const componentMessage = message as ComponentMessage;
      expect(componentMessage.componentPath).to.deep.equal(['runtime','my-component']);
    });

    it("should have an empty queue", () => {
      const messageQueue = engine.messageQueue;
      expect(messageQueue.messageCount).to.equal(0);
    });
  });


});
