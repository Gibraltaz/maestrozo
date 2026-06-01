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


describe("Engine runOnce", () => {

  it("should re-evaluate a custom component when a message is sended to it", () => {
    const engine = new Engine();
    const root = engine.getRootElement();
    const componentTypeContainer = root.typesContainer.componentTypeContainer;
    const dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;
    const runtimeContainer = root.runtimeContainer;

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

    const myCustomComponentA1 = runtimeContainer.createComponent(
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
        componentPath: myCustomComponentA1.path,
        at: 1234 as MessageTime,
        event: "created"
    };

    engine.messageQueue.pushMessage(initMessage);
    expect(engine.messageQueue.messageCount).to.equal(1);
    engine.runOnce();

    expect(messageToEvaluate).to.toBeDefined();
    expect(messageToEvaluate).to.deep.equal(initMessage);

    expect(componentToEvaluate).to.toBeDefined();
    expect(componentToEvaluate).to.deep.equal(myCustomComponentA1);

    expect(engine.messageQueue.messageCount).to.equal(0);
  });




});
