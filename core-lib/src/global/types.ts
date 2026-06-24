/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type ElementName = string & { __brand: 'ElementName' };

type ElementKind = string & { __brand: 'ElementKind' };
type ElementPath = Array<ElementName>;

type ComponentName = ElementName & { __brand2: 'ComponentName' };
type ComponentPath = ElementPath & { __brand2: 'ComponentPath' };

type PinName = ElementName & { __brand2: 'Pin' };
type InputPinName = PinName & { __brand3: 'InputPin' };
type OutputPinName = PinName & { __brand3: 'OutputPin' };

type EvaluationResult = {
  setOutputs: Array<{
    pin: OutputPinName;
    value: unknown;
  }>;
};

type MessageTime = number & { __brand: 'msg_time' };

export { 
  ElementName,
  ElementKind,
  ElementPath,
  ComponentName,
  ComponentPath,
  PinName,
  InputPinName,
  OutputPinName,
  EvaluationResult,
  MessageTime
};
