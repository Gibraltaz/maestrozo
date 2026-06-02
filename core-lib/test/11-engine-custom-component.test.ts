import { describe, it, expect } from "vitest";
import { Engine } from '@/Engine';
import { ElementName, ElementPath } from '@/interfaces/IElement';
import { EvaluateMessageFunction, PinDeclaration } from '@/components/CustomComponentBuilder';
import { EvaluationResult, IComponent } from '@/interfaces/IComponent';
import { Message } from "@/interfaces/MessageQueue";

describe("Engine customComponent", () => {

  it("should declare a custom component", () => {
    const engine = new Engine();

    const componentEvaluateFunction : EvaluateMessageFunction = (_component: IComponent, _message: Message) => {
      const evalResult: EvaluationResult  = {} as EvaluationResult;
      return evalResult;
    } ;

    const typeContainer = engine.declareCustomComponent(
      'my-custom-component' as ElementName,
      [ 'types', 'component' ] as ElementPath,
      [] as PinDeclaration[],
      [] as PinDeclaration[],
      componentEvaluateFunction 
    );
    expect(typeContainer).to.be.instanceOf(Object);
    expect(typeContainer).to.have.property('name', 'my-custom-component');
    expect(typeContainer).to.have.property('kind', 'component-type');
    expect(typeContainer).to.have.property('path');
    expect(typeContainer.path).to.deep.equal([ 'types', 'component', 'my-custom-component' ]);
    expect(typeContainer).to.have.property('factory');
    console.log(typeContainer.factory);
    expect(typeContainer.factory).to.be.instanceOf(Object);
    expect(typeContainer.factory).to.have.property('typeName', 'my-custom-component');

    expect(typeContainer.factory).to.have.property('inputPinDeclarations');
    expect(typeContainer.factory).to.have.property('outputPinDeclarations');

  });


});
