import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { ElementName } from '@/interfaces/IElement';
import { RootElement } from "@/RootElement";
import { DataTypeElement } from "@/DataTypeElement";
import { CustomComponentBuilder, EvaluateMessageFunction } from '@/components/CustomComponentBuilder';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { ComponentMessage, Message, MessageQueue, MessageTime } from "@/interfaces/MessageQueue";


describe("Custom component message evaluation", () => {
  let engine : Engine;
  let root : RootElement;
  let componentTypeContainer: ITypeContainer;
  let dataTypeContainer: ITypeContainer;
  let runtimeContainer: IRuntimeContainer; 
  let myCustomComponentA1: IComponent;
  let messageQueue : MessageQueue;

  beforeAll(() => {
    engine = new Engine();
    root = engine.getRootElement();
    componentTypeContainer = root.typesContainer.componentTypeContainer;
    dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;
    runtimeContainer = root.runtimeContainer;
    messageQueue = engine.messageQueue;
  });


  it("should re-evaluate a custom component when a message is sended to it", () => {

    let messageToEvaluate : Message | undefined;
    let componentToEvaluate : IComponent | undefined;

    const evaluateFunction : EvaluateMessageFunction = (component: IComponent, message: Message) => {
      messageToEvaluate = message;
      componentToEvaluate = component;
      const evalResult: EvaluationResult  = {} as EvaluationResult;
      return evalResult;
    } ;

    const myComponentBuilderA = new CustomComponentBuilder(
      'my-component-A' as ElementName,
      [],
      [
        {
          name:'integer-output' as ElementName, 
          dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement,
          initialValuePropertyName: 'value'
        }
      ],
      componentTypeContainer,
      evaluateFunction
    );

    myCustomComponentA1 = runtimeContainer.createComponent(
      'my-component-A-1' as ElementName,
      myComponentBuilderA,
      {
        inputPins: {},
        outputPins : {
          'integer-output' : { 'value': 5 },
        }
      }
    );

    const initMessage: ComponentMessage = {
        scope: "component",
        componentPath: [ 'runtime' as ElementName, 'components' as ElementName, 'my-component-A-1' as ElementName],
        at: 1234 as MessageTime,
        event: "created"
    };
    myCustomComponentA1.evaluate(initMessage);
    expect(messageToEvaluate).toBeDefined;
    expect(messageToEvaluate).to.deep.equal(initMessage);
    expect(componentToEvaluate).toBeDefined;
    expect(componentToEvaluate).to.deep.equal(myCustomComponentA1);
  });

});
