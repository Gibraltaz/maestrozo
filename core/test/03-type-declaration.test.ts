import { describe, it, expect } from "vitest";
import { ElementPath, Engine } from "@/Engine";
import { RawMemoryStore } from "@/store/RawMemoryStore";

describe("Maestrozo core", () => {
  let engine = new Engine(new RawMemoryStore());

  it("should find /types element", () => {
    const element = engine.getElement([ 'types' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'types');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal([]);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'container']);
  });

  it("should find /types/element", () => {
    const element = engine.getElement([ 'types', 'element' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'element');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'element']);
  });

  it("should find /types/container", () => {
    const element = engine.getElement([ 'types', 'container' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'container');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'element']);
  });

  it("should find /types/data", () => {
    const element = engine.getElement([ 'types', 'data' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'data');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'container']);
  });

  it("should find /types/data/integer", () => {
    const element = engine.getElement([ 'types', 'data', 'integer' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'integer');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'container']);
  });

  it("should find /types/data/string", () => {
    const element = engine.getElement([ 'types', 'data', 'string' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'string');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'container']);
  });

  it("should find /types/data/boolean", () => {
    const element = engine.getElement([ 'types', 'data', 'boolean' ] as ElementPath);
    expect(element).to.be.instanceof(Object);
    expect(element).to.have.property('elementName', 'boolean');
    expect(element).to.have.property('parentPath');
    expect(element.parentPath).to.deep.equal(['types', 'data']);
    expect(element).to.have.property('elementType');
    expect(element.elementType).to.deep.equal([ 'element', 'container']);
  });


 
});
