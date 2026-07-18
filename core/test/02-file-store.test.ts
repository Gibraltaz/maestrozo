/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { describe, it, expect, assert, beforeAll, afterAll } from "vitest";

import { StoreKey, StoreValue } from "@/store/MaestrozoStore";
import { FileStore } from "@/store/FileStore";

import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { rm } from "node:fs/promises";

const tmpFilePath = (prefix:string) =>join( tmpdir(), `${prefix}-${randomUUID()}.tmp`);

describe("File store", () => {

  let storePath: string;
  let fileStore1: FileStore | null;
  let fileStore2: FileStore | null;

  beforeAll( () => {
    storePath = tmpFilePath('maestrozo')
  });

  afterAll( async () => {
    await rm(storePath);
  });

  it("should create a first instance of file store", () => {
    fileStore1 = new FileStore(storePath);
  });

  it("should not be initialized", () => {
    assert (fileStore1 !== null);
    expect(fileStore1).to.have.property('initialized', false);
  });

  it("should initialize file store", async () => {
    assert (fileStore1 !== null);
    await fileStore1.initialize();
  });

  it("should be initialized", () => {
    assert (fileStore1 !== null);
    expect(fileStore1).to.have.property('initialized', true);
  });

  it("should write a first value", async () => {
    assert (fileStore1 !== null);
    await fileStore1.setItem('abc' as StoreKey, 'ABC' as StoreValue);
  });

  it("should write a second value", async () => {
    assert (fileStore1 !== null);
    await fileStore1.setItem('def' as StoreKey, 'DEF' as StoreValue);
  });

  it("should read an existing value from store", async () => {
    assert (fileStore1 !== null);
    const value = await fileStore1.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should free first instance of file store", () => {
    fileStore1 = null;
  });

  it("should create a create a second instance of file store with same file", () => {
    fileStore2 = new FileStore(storePath);
  });

  it("should not be initialized", () => {
    assert (fileStore2 !== null);
    expect(fileStore2).to.have.property('initialized', false);
  });

  it("should initialize file store", async () => {
    assert (fileStore2 !== null);
    await fileStore2.initialize();
  });

  it("should be initialized", () => {
    assert (fileStore2 !== null);
    expect(fileStore2).to.have.property('initialized', true);
  });

  it("should retrieve the first value from store", async () => {
    assert (fileStore2 !== null);
    const value = await fileStore2.getItem('abc' as StoreKey);
    expect(value).to.equal('ABC');
  });

  it("should retrieve the second value from store", async () => {
    assert (fileStore2 !== null);
    const value = await fileStore2.getItem('def' as StoreKey);
    expect(value).to.equal('DEF');
  });


});
