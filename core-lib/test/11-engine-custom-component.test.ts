import { describe, it, expect, beforeAll } from "vitest";
import { Engine } from '@/Engine';
import { EvaluateMessageFunction, PinDeclaration } from '@/components/CustomComponentBuilder';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { Message } from "@/global/messages";
import { ComponentName, ElementName, ElementPath } from "@/global/types";

describe("Engine customComponent", () => {
  let engine : Engine;

  beforeAll(() => {
    engine = new Engine();
  });


  it("should declare a custom component", () => {

    const componentEvaluateFunction : EvaluateMessageFunction = (_component: IComponent, _message: Message) => {
      const evalResult: EvaluationResult  = {} as EvaluationResult;
      return evalResult;
    } ;

    const typeContainer = engine.declareCustomComponent(
      'my-custom-component' as ElementName,
      [ 'types', 'components' ] as ElementPath,
      [] as PinDeclaration[],
      [] as PinDeclaration[],
      componentEvaluateFunction 
    );
    expect(typeContainer).to.be.instanceOf(Object);
    expect(typeContainer).to.have.property('name', 'my-custom-component');
    expect(typeContainer).to.have.property('kind', 'component-type');
    expect(typeContainer).to.have.property('path');
    expect(typeContainer.path).to.deep.equal([ 'types', 'components', 'my-custom-component' ]);
    expect(typeContainer).to.have.property('factory');
    expect(typeContainer.factory).to.be.instanceOf(Object);
    expect(typeContainer.factory).to.have.property('typeName', 'my-custom-component');

    expect(typeContainer.factory).to.have.property('inputPinDeclarations');
    expect(typeContainer.factory).to.have.property('outputPinDeclarations');

  });

  it("should instanciate a custom component", () => {

    const component = engine.createComponent(
      'my-component-01' as ComponentName,
      [ 'runtime' ] as ElementPath,
      [ 'types', 'components', 'my-custom-component' ] as ElementPath,
      {
        inputPins: {},
        outputPins: {}
      } as Record<string, any>
    );
    expect(component).to.be.instanceOf(Object);
    expect(component).to.have.property('name', 'my-component-01');
    expect(component).to.have.property('kind', 'component-type');
    expect(component).to.have.property('path');
    expect(component.path).to.deep.equal([ 'runtime', 'my-component-01' ]);

  });

  it("should find the new custom component", () => {
    const component = engine.getRootElement().findElementByPath(
      [ 'runtime', 'my-component-01' ] as ElementPath
    );
    expect(component).to.have.property('name', 'my-component-01');
    expect(component).to.have.property('kind', 'component-type');


  });

});
