import { CustomComponent } from "./CustomComponent";
import { IComponentFactory } from "@/interfaces/IComponentFactory";
import { ElementName, ElementPath } from '@/interfaces/IElement';
import { IComponent } from '@/interfaces/IComponent';
import { ITypeContainer } from '@/interfaces/ITypeContainer';
import { DataTypeElement } from "@/DataTypeElement";
import { ComponentTypeElementKind } from '@/ComponentTypeElement';

type PinDeclaration = {
  name: ElementName;
  dataType: DataTypeElement;
  initialValuePropertyName: string; //FIXME mettre un type «PropertyName»
};


class CustomComponentBuilder implements IComponentFactory {
  typeName: ElementName;
  componentTypeContainer: ITypeContainer;
  private inputPinDeclarations: PinDeclaration[];
  private outputPinDeclarations: PinDeclaration[];

  constructor(
    typeName: ElementName,
    inputPinDeclarations: PinDeclaration[],
    outputPinDeclarations: PinDeclaration[],
    componentTypeContainer: ITypeContainer
  ) {
    this.componentTypeContainer = componentTypeContainer;
    this.typeName = typeName;
    componentTypeContainer.declareComponentType(this);
    this.inputPinDeclarations = inputPinDeclarations;
    this.outputPinDeclarations = outputPinDeclarations;
  }

  createInstance(componentName: ElementName, parentElementPath: ElementPath, params: Record<string, unknown>) : IComponent {
    const newComponent = new CustomComponent(componentName, ComponentTypeElementKind , parentElementPath, this);

    const inputPinsParamName = 'inputPins';
    const inputPinParams = params[inputPinsParamName] as Record<string, unknown>;
    if (inputPinParams === undefined)
      throw new Error(`The «${inputPinsParamName}» section is missing from params to create «${componentName}» component`);
    if (inputPinParams === null || typeof(inputPinParams) != 'object')
      throw new Error(`The «${inputPinsParamName}» section must be a key-value object while creating "${componentName}" component`);

    for (const pinDeclaration of this.inputPinDeclarations) {
      const pinParameters = inputPinParams[pinDeclaration.name] as Record<string, unknown>;
      if (! pinParameters)
        throw new Error(`Parameter section «${pinDeclaration.name}» is not defined in component «${this.typeName} factory»`);
      newComponent.inputPins.declareInputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    const outputPinsParamName = 'outputPins';
    const outputPinParams = params[outputPinsParamName] as Record<string, unknown>;
    if (outputPinParams === undefined)
      throw new Error(`The «${outputPinsParamName}» section is missing from params to create «${componentName}» component`);
    if (outputPinParams === null || typeof(outputPinParams) != 'object')
      throw new Error(`The «${outputPinsParamName}» section must be a key-value object while creating "${componentName}" component`);

    for (const pinDeclaration of this.outputPinDeclarations) {
      const pinParameters = outputPinParams[pinDeclaration.name] as Record<string, unknown>;
      if (! pinParameters)
        throw new Error(`Parameter section «${pinDeclaration.name}» is not defined in component «${this.typeName} factory»`);
      newComponent.outputPins.declareOutputPin(pinDeclaration.name, pinDeclaration.dataType, pinParameters );
    }

    return newComponent;
  }

}

export { CustomComponentBuilder, PinDeclaration };
