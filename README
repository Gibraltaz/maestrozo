# Mestrozo

Mestrozo is a hierarchical, type-driven engine for building structured systems such as workflows,
simulations, document graphs, and automation pipelines.

At its core, Mestrozo provides a typed tree of elements where both data and types are first-class citizens.
On top of this foundation, an event-driven engine enable execution models based on components, pins, 
and message propagation.

---

## Core Concepts

### Element Tree

Everything in Mestrozo is an element stored in a hierarchical structure similar to a file system.

Each element has:

* a name
* a path
* a parent container
* a type
* optional properties

Example:

```text id="m1tree"
/
├── type
│    ├── data
│    │    ├── integer
│    │    ├── string 
│    │    └── boolean
│    └── components
│         ├── logic
│         │    ├── AND door
│         │    ├── OR door
│         │    └── …
│         ├── math
│         │    ├── Addition
│         │    ├── Substraction
│         │    └── …
│         └── …
│
└── runtime
```

---

### Types as Elements

Types are themselves elements stored under `/type`.

This means the type system is fully extensible and part of the data model.

Example:

```text id="m2types"
/type
  ├── component
  ├── container
  ├── document
  └── connection
```

Each type defines how elements of that type behave and are instantiated.

---

### Type Provider

Each type is associated with a **Type Provider** (Factory).

A Type Provider is responsible for:

* creating instances of elements
* handling behavior and message evaluation (when applicable)

Users can define custom types by providing:

* a path under `/type`
* a Type Provider implementation

---

### Public SDK

Users do not access internal classes directly.

Instead, they interact through a generic SDK:

```ts id="sdk1"
sdk.createElement({
  name: "step1",
  parent: "/project",
  type: "/type/component/custom"
});

sdk.createConnection({
  from: "/project/step1/output",
  to: "/project/step2/input"
});
```

The SDK exposes:

* element creation
* type registration
* tree navigation
* event dispatch

---

## Event Engine (Extension Layer)

The event engine is an optional layer built on top of the core model.

It introduces:

* components
* input/output pins
* connections between pins
* a timestamped message queue

It is **not part of the core model**, but a specialized execution system built using it.

---

### Message Queue

State changes are represented as timestamped messages.

Messages are processed in chronological order.

```text id="queue1"
T=10  ─ message A
T=20  ─ message B
T=30  ─ message C
```

---

### Execution Model

The engine executes messages explicitly through controlled steps.

```ts id="exec1"
engine.runOnce();
```

Only one message is processed per call, ensuring deterministic execution.

---

### Time System

The engine uses an injectable time function:

```ts id="time1"
engine.setTimeFunction(() => Date.now());
```

This enables:

* deterministic tests
* simulation of future events
* replayable execution

Example (tests):

```ts id="time2"
let t = 0;

engine.setTimeFunction(() => t);

t = 1000;
engine.runOnce();

t = 2000;
engine.runOnce();
```

---

## Design Goals

Mestrozo is designed around:

* strong separation between structure and execution
* full extensibility through user-defined types
* deterministic event processing
* reproducibility
* testability
* runtime independence

---

## Architecture Overview

```text id="arch1"
        Core System
     (Element Tree)
            ↓
     Type System (Provider)
            ↓
   Optional Event Engine
 (Components / Pins / Queue)
            ↓
   Workflows / Simulations
```

---

## License

Copyright (C) 2026 Your Company Name

Licensed under the GNU Lesser General Public License v3.0 or later (LGPL-3.0-or-later).

See LICENSE file for details.

