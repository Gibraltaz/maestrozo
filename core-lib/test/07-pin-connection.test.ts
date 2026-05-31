import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { ElementName } from '@/interfaces/IElement';
import { ITypeElement } from '@/interfaces/ITypeElement';
import { RootElement } from "@/RootElement";
import { DataTypeElement } from "@/DataTypeElement";
import { CustomComponentBuilder, EvaluateMessageFunction } from '@/components/CustomComponentBuilder';
import { IRuntimeContainer } from '@/interfaces/IRuntimeContainer';
import { ComponentName, EvaluationResult, IComponent, InputPinName, OutputPinName } from '@/interfaces/IComponent';
import { PinConnectionTypeElementName, IPinConnectionFactory } from '@/interfaces/IPinConnection';
import { Message } from "@/interfaces/MessageQueue";

const evaluateFunction : EvaluateMessageFunction = (_component: IComponent, _message: Message) => {
  return {} as EvaluationResult;
} ;

describe("Custom component", () => {
  let engine : Engine;
  let root : RootElement;
  let componentTypeContainer: ITypeContainer;
  let dataTypeContainer: ITypeContainer;
  let runtimeContainer: IRuntimeContainer; 
  let myCustomComponentA1: IComponent;
  let myCustomComponentB1: IComponent;

  beforeAll(() => {
    engine = new Engine();
    root = engine.getRootElement();
    componentTypeContainer = root.typesContainer.componentTypeContainer;
    dataTypeContainer = engine.getRootElement().typesContainer.dataTypeContainer;
    runtimeContainer = root.runtimeContainer;
  });


  it("should create first component", () => {



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
  });

  it("should create second component", () => {
    const myComponentBuilder2 = new CustomComponentBuilder(
      'my-component-B' as ElementName,
      [
        {
          name:'integer-input' as ElementName, 
          dataType: dataTypeContainer.getElementByName('integer' as ElementName) as DataTypeElement,
          initialValuePropertyName: 'value'
        }
      ],
      [],
      componentTypeContainer,
      evaluateFunction 
    );
    myCustomComponentB1 = runtimeContainer.createComponent(
      'my-component-B-1' as ElementName,
      myComponentBuilder2,
      {
        inputPins: {
          'integer-input' : { 'value': 5 },
        },
        outputPins : {
        }
      }
    );
  });

  it("should create a connexion between components", () => {
    const pinConnectionType = root.typesContainer.pinConnectionTypeContainer.getElementByName(PinConnectionTypeElementName) as ITypeElement;

    // TODO problème ici car pinConnections ne peut pas tester l'existence des composants
    const connection = runtimeContainer.createPinConnection(
      'my-component-A-1' as ComponentName, 'integer-output' as OutputPinName,
      'my-component-B-1' as ComponentName, 'integer-input' as InputPinName,
      pinConnectionType.factory as IPinConnectionFactory
    );

    expect (connection).to.be.instanceOf(Object);
    expect(connection).to.have.property('name', 'my-component-A-1:integer-output-my-component-B-1:integer-input');
    expect(connection).to.have.property('kind', 'pin-connection');
    expect(connection).to.have.property('path');
    expect(connection.path).to.deep.equal([ 'runtime', 'pinConnections', 'my-component-A-1:integer-output-my-component-B-1:integer-input' ]);

    expect(connection).to.have.property('sourceComponentName', 'my-component-A-1');
    expect(connection).to.have.property('sourcePinName', 'integer-output');
    expect(connection).to.have.property('targetComponentName', 'my-component-B-1');
    expect(connection).to.have.property('targetPinName', 'integer-input');
  });

  it("should not create the same connection", () => {
    const pinConnectionType = root.typesContainer.pinConnectionTypeContainer.getElementByName(PinConnectionTypeElementName) as ITypeElement;

    expect( () => {
      runtimeContainer.createPinConnection(
        'my-component-A-1' as ComponentName, 'integer-output' as OutputPinName,
        'my-component-B-1' as ComponentName, 'integer-input' as InputPinName,
        pinConnectionType.factory as IPinConnectionFactory
      );
    }).toThrow("Pin connection «my-component-A-1:integer-output-my-component-B-1:integer-input» already exists in container «/runtime»");
  });


  // TODO tester l'erreur de l'ajout d'une connexion sur une pin entrée déjà connectée
  // TODO tester l'erreur de l'ajout d'une connexion sur un composant source inexistant dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur un composant cible inexistant dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur une entrée cible inexistante dans le composant
  // TODO tester l'erreur de l'ajout d'une connexion sur une sortie source inexistante dans le composant

});
