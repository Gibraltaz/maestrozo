/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import {
  ElementData, ElementName, ElementPath, TypeDeclaration, 
  rootName, rootTypeContainerName, typeElementName,
  BuildElementDataCallback, BuildElementDataFunction
} from '@maestrozo/kernel';

import { pluginTypeName } from '../global.js';

enum PluginStatus {
  loading = 'Loading',
  error = 'Error',
  loaded = 'Loaded'
};

const buildElementDataFunction : BuildElementDataFunction = async (
  _elementName: ElementName,
  _parentPath: ElementPath,
  params:Record<string, any>
): Promise<ElementData> => {
  const pluginPath = params.pluginPath;
  if (pluginPath === undefined)
    throw new Error("Plugin path not defined");
  if (typeof(pluginPath) !== 'string')
    throw new Error("Plugin path is not a string");
  const status = PluginStatus.loading;
  return {
    pluginPath,
    status
  } as ElementData;
};

const pluginTypeDeclaration: TypeDeclaration = {
  elementName: pluginTypeName,
  parentPath: [rootName, rootTypeContainerName ] as ElementPath,
  elementType: [rootName, rootTypeContainerName, typeElementName] as ElementPath,
  isDerivable: false,
  isContainer: false,
  isVolatile: true,
  callbacks: [
    { name: BuildElementDataCallback, function: buildElementDataFunction }
  ]
};

export {
  pluginTypeDeclaration, PluginStatus 
};
