import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { EvaluateMessageFunction, PinDeclaration } from '@/components/CustomComponentBuilder';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { Message } from "@/global/messages";
import { ComponentName, ElementName, ElementPath, InputPinName, OutputPinName } from "@/global/types";
import { DataTypeElement } from "@/DataTypeElement";

describe("Engine", () => {
  let engine : Engine;
  let globalMessage : Message | null = null;

  beforeAll(() => {
    engine = new Engine();
  });


  it("should declare first custom component", () => {
    const dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;

    const componentEvaluateFunction1 : EvaluateMessageFunction = (_component: IComponent, message: Message) => {
      globalMessage = message;
      const evalResult: EvaluationResult  = {
        setOutputs: [
          {
            pin: 'integer-output',
            value: 123
          }
        ]
      } as EvaluationResult;
      return evalResult;
    } ;

    const typeContainer1 = engine.declareCustomComponent(
      'my-custom-component-1' as ElementName,
      [ 'types', 'components' ] as ElementPath,
      [] as PinDeclaration[],
      [
        {
          name:'integer-output' as ElementName, 
          dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement
        }
      ] as PinDeclaration[],
      componentEvaluateFunction1 
    );
    expect(typeContainer1).to.be.instanceOf(Object);
  });


  it("should declare second custom component", () => {
    const dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;

    const componentEvaluateFunction2 : EvaluateMessageFunction = (_component: IComponent, message: Message) => {
      const evalResult: EvaluationResult  = {} as EvaluationResult;
      globalMessage = message;
      return evalResult;
    } ;

    const typeContainer2 = engine.declareCustomComponent(
      'my-custom-component-2' as ElementName,
      [ 'types', 'components' ] as ElementPath,
      [
        {
          name:'integer-input' as ElementName, 
          dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement
        }
      ] as PinDeclaration[],
      [] as PinDeclaration[],
      componentEvaluateFunction2 
    );
    expect(typeContainer2).to.be.instanceOf(Object);
  });


  it("should instanciate first custom component", () => {
    const component = engine.createComponent(
      'my-component-1' as ComponentName,
      [ 'runtime' ] as ElementPath,
      [ 'types', 'components', 'my-custom-component-1' ] as ElementPath,
      { } as Record<string, any>
    );
    expect(component).to.be.instanceOf(Object);
    expect(engine.messageQueue.messageCount).equal(1); // component creation message
  });


  it("should instanciate second custom component", () => {
    const component = engine.createComponent(
      'my-component-2' as ComponentName,
      [ 'runtime' ] as ElementPath,
      [ 'types', 'components', 'my-custom-component-2' ] as ElementPath,
      { } as Record<string, any>
    );
    expect(component).to.be.instanceOf(Object);
    expect(engine.messageQueue.messageCount).equal(2); // component creation messages
  });

  it("should process waiting messages", () => {
    engine.runOnce();
    expect(engine.messageQueue.messageCount).equal(1);
    engine.runOnce();
    expect(engine.messageQueue.messageCount).equal(0);

  });

  it("should create pin connection", () => {
    const pinConnection = engine.createPinConnection(
      [ 'runtime' ] as ElementPath,
      'my-component-1' as ComponentName,
      'integer-output' as OutputPinName,
      'my-component-2' as ComponentName,
      'integer-input'  as InputPinName,
    );
    expect(pinConnection).not.to.equal(null, 'Pin connection not created');

    expect(pinConnection).to.have.property('name', 'my-component-1:integer-output-my-component-2:integer-input');
    expect(pinConnection).to.have.property('kind', 'pin-connection');
    expect(pinConnection).to.have.property('sourceComponentName', 'my-component-1');
    expect(pinConnection).to.have.property('sourcePinName', 'integer-output');
    expect(pinConnection).to.have.property('targetComponentName', 'my-component-2');
    expect(pinConnection).to.have.property('targetPinName', 'integer-input');
    expect(pinConnection).to.have.property('path');
    expect(pinConnection.path).to.deep.equal([ 'runtime', 'my-component-1:integer-output-my-component-2:integer-input' ]);

  });

  it("should find the pin connection message", () => {
    expect(engine.messageQueue.messageCount).equal(1);
  });

  it("should evaluate the message created", () => {
    engine.runOnce();
    expect(engine.messageQueue.messageCount).equal(0);
    expect(globalMessage).to.not.equal(null);
    expect(globalMessage).to.have.property('at');
    expect(globalMessage).to.have.property('scope', 'pin');
    expect(globalMessage).to.have.property('event', 'changed');
    expect(globalMessage).to.have.property('componentPath');
    expect(globalMessage?.componentPath).to.deep.equal(['runtime', 'my-component-2']);
    expect(globalMessage).to.have.property('value', 123);
  });
});


// TODO
//  it("should not create the same connection", () => {
//    const pinConnectionType = root.typesContainer.pinConnectionTypeContainer.getElementByName(PinConnectionTypeElementName) as ITypeElement;
//
//    expect( () => {
//      runtimeContainer.createPinConnection(
//        'my-component-A-1' as ComponentName, 'integer-output' as OutputPinName,
//        'my-component-B-1' as ComponentName, 'integer-input' as InputPinName,
//        pinConnectionType.factory as IPinConnectionFactory
//      );
//    }).toThrow("Pin connection «my-component-A-1:integer-output-my-component-B-1:integer-input» already exists in container «/runtime»");
//  });


  // TODO tester l'erreur de l'ajout d'une connexion sur une pin entrée déjà connectée
  // TODO tester l'erreur de l'ajout d'une connexion sur un composant source inexistant dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur un composant cible inexistant dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur une entrée cible inexistante dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur une sortie source inexistante dans le composant

