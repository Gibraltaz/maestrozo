import { ComponentPath } from '@/interfaces/IComponent';
import { InputPinName } from '@/interfaces/IPin';

type MessageTime = number & { __brand: 'msg_time' };


const MESSAGE_CREATION = 'created';
const MESSAGE_DESTROY = 'destroyed';
const MESSAGE_CHANGE = 'changed';

type MessageEvent = 
  typeof MESSAGE_CREATION |
  typeof MESSAGE_DESTROY |
  typeof MESSAGE_CHANGE;


const COMPONENT_MESSAGE_SCOPE = 'component';
type ComponentMessageScope = typeof COMPONENT_MESSAGE_SCOPE;

const PIN_MESSAGE_SCOPE = 'pin';
type PinMessageScope = typeof PIN_MESSAGE_SCOPE;

/* alternative : 
 *     const MESSAGE_SCOPE = { COMPONENT: 'component', PIN: 'pin' } as const;
 *     scope MessageScope = typeof MESSAGE_SCOPE[ keyof typeof MESSAGE_SCOPE ];
 *     interface ComponentMessage {
 *         scope: typeof MESSAGE_SCOPE.COMPONENT;
 *     }
 */


type MessageScope = ComponentMessageScope | PinMessageScope; 
type Message = ComponentMessage | PinMessage;


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
  MessageTime, MessageScope,
  Message, 
  ComponentMessage, COMPONENT_MESSAGE_SCOPE,
  PinMessage,PIN_MESSAGE_SCOPE,
  MessageEvent, MESSAGE_CREATION, MESSAGE_DESTROY, MESSAGE_CHANGE
};
