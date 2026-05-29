import { MessageQueue, Message, MessageTime } from '@/interfaces/MessageQueue';

class MessageQueueImpl implements MessageQueue {

  private messageArray : Message[] = [];

  get messageCount(): number {
    return this.messageArray.length;
  }

  popMessage(now: MessageTime): Message | undefined {

    if (this.messageArray.length === 0)
      return undefined;

    if (this.messageArray[0].at > now)
      return undefined;

    return this.messageArray.shift();
  }

  pushMessage(message: Message): void {
    this.messageArray.push(message);
    this.messageArray.sort( (msgA: Message, msgB: Message) => msgA.at - msgB.at );
  }
}

export { MessageQueueImpl };
