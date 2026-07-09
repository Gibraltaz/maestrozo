/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect } from "vitest";
import {
  checkElementName,
  checkAbsoluteElementPath,
  checkRelativeElementPath,
  ElementName,
  isRootName,
  ElementPath
} from "@/path";

describe("Path utilities", () => {

  describe("Function checkElementName", () => {

    it("should accept valid name", () => {
      checkElementName('abc' as ElementName);
    });

    it("should detected undefined name", () => {
      //@ts-ignore
      expect( () => checkElementName(undefined as ElementName) )
      .to.throw("Element name is not defined");
    });

    it("should detected non-string name", () => {
      //@ts-ignore
      expect( () => checkElementName(123 as ElementName) )
      .to.throw("Element name is not a string");
    });

    it("should detected empty name", () => {
      expect( () => checkElementName('' as ElementName) )
      .to.throw("Element name can not be an empty string");
    });

    it("should detected invalid characters", () => {
      expect( () => checkElementName('ab/cd' as ElementName) )
      .to.throw("Element name «ab/cd» containts invalid characters");
      expect( () => checkElementName('ab#cd' as ElementName) )
      .to.throw("Element name «ab#cd» containts invalid characters");
    });
  });


  describe("Function isRootName", () => {

    it("should detect root name", () => {
      expect(isRootName('#' as ElementName)).to.equal(true);
    });

    it("should detect non-root name", () => {
      expect(isRootName('abc' as ElementName)).to.equal(false);
    });

    it("should detected undefined name", () => {
      //@ts-ignore
      expect( () => checkElementName(undefined as ElementName) )
        .to.throw("Element name is not defined");
    });

    it("should detected non-string name", () => {
      //@ts-ignore
      expect( () => checkElementName(123 as ElementName) )
      .to.throw("Element name is not a string");
    });
  });


  describe("Function checkAbsoluteElementPath", () => {

    it("should detected undefined path", () => {
      //@ts-ignore
      expect( () => checkAbsoluteElementPath(undefined as ElementPath) )
        .to.throw("Element path is not defined");
    });

    it("should detected non array path", () => {
      //@ts-ignore
      expect( () => checkAbsoluteElementPath('abc' as ElementPath) )
        .to.throw("Element path is not an array");
    });

    it("should detected empty path", () => {
      expect( () => checkAbsoluteElementPath([] as ElementPath) )
        .to.throw("Absolute path must start start with «#»");
    });

    it("should detected path not starting with «#»", () => {
      expect( () => checkAbsoluteElementPath(['abc'] as ElementPath) )
        .to.throw("Absolute path must start start with «#»");
    });

    it("should accept root path «#/»", () => {
      () => checkAbsoluteElementPath(['#'] as ElementPath);
    });

    it("should accept valid absolute paths «#/»", () => {
      () => checkAbsoluteElementPath(['#', 'abc'] as ElementPath);
      () => checkAbsoluteElementPath(['#', 'abc', 'def'] as ElementPath);
      () => checkAbsoluteElementPath(['#', 'abc', 'def', 'ghi'] as ElementPath);
    });

    it("should detected invalid absolute path ", () => {

      expect( () => checkAbsoluteElementPath(['#', ''] as ElementPath) )
        .to.throw("Element name can not be an empty string in path «/#/» at position 2");

      expect( () => checkAbsoluteElementPath(['#', 'a/b'] as ElementPath) )
        .to.throw("Element name «a/b» containts invalid characters in path «/#/a/b» at position 2");

      expect( () => checkAbsoluteElementPath(['#', 'abc', ''] as ElementPath) )
        .to.throw("Element name can not be an empty string in path «/#/abc/» at position 3");

      expect( () => checkAbsoluteElementPath(['#', 'abc', 'd/e'] as ElementPath) )
        .to.throw("Element name «d/e» containts invalid characters in path «/#/abc/d/e» at position 3");
    });

  });

  describe("Function checkRelativeElementPath", () => {

    it("should accept valid relative path", () => {
      checkRelativeElementPath(['abc'] as ElementPath);
      checkRelativeElementPath(['abc', 'def'] as ElementPath);
      checkRelativeElementPath(['abc', 'def', 'ghi'] as ElementPath);
    });

    it("should detect absolute path", () => {
      expect(() => checkRelativeElementPath(['#', 'abc'] as ElementPath))
        .to.throw("Relative path must start start with «#»");
      expect(() => checkRelativeElementPath(['#', 'abc'] as ElementPath))
        .to.throw("Relative path must start start with «#»");
      expect(() => checkRelativeElementPath(['#', 'abc', 'def'] as ElementPath))
        .to.throw("Relative path must start start with «#»");
    });

  });

});
