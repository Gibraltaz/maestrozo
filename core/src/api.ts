import { MtzEngine } from "./Engine";
import { MemoryStore } from "./store/MemoryStore";

type CreateEngineOptions = {
  name: string
};

const createEngine = async (options: CreateEngineOptions) => {
  let engine = new MtzEngine()
  console.log("create Engine", options.name);
  await engine.initialize(new MemoryStore());
};

export {
  createEngine
};

export type {
  CreateEngineOptions
};
