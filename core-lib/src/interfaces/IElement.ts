/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import { ElementKind, ElementName, ElementPath } from "@/global/types";

interface IElement {
  readonly name: ElementName;
  readonly kind: ElementKind;
  readonly path: ElementPath;
  get isContainer() : boolean;
}

export { IElement };
