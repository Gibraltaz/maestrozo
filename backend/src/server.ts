import express from 'express';
import type { Config } from './config.js';

const server = async (config: Config) => {
  const port = config.server.port;
  const app = express();
  app.use(express.json());
  app.get('/', (_req, res) => {
      res.json({
          name: config.general.name,
          description: config.general.description,
      });
  });
  app.listen(port, () => {
      console.log(`Maestrozo Backend is listening on port ${port}`);
  });
}

export { server };
