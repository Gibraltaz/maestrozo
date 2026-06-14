import { ComponentMessage, PinMessage } from "@/interfaces/MessageQueue";


//TODO ménage
//type MessageEvent = 
//  typeof MESSAGE_CREATION |
//  typeof MESSAGE_DESTROY |
//  typeof MESSAGE_CHANGE;


type MessageEvent =  string & { __brand: 'MsgEvent' };

const MESSAGE_CREATION: MessageEvent = 'created' as MessageEvent;
const MESSAGE_DESTROY: MessageEvent = 'destroyed' as MessageEvent;
const MESSAGE_CHANGE: MessageEvent = 'changed' as MessageEvent;

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


export {
  Message,
  MessageScope,
  COMPONENT_MESSAGE_SCOPE,
  ComponentMessageScope,
  PIN_MESSAGE_SCOPE,
  PinMessageScope,
  MessageEvent, 
  MESSAGE_CREATION, 
  MESSAGE_DESTROY, 
  MESSAGE_CHANGE
};
