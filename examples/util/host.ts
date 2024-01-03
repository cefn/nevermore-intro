import { createServer, type Server } from "http";
import express, { type Application } from "express";

export interface Host {
  server: Server;
  origin: `http://${string}:${number}`;
  destroy: () => Promise<Error | undefined>;
}

export async function launchHost(
  addHandlers: (app: Application) => void,
): Promise<Host> {
  const app = express();
  addHandlers(app);
  const server = createServer(app);
  return await new Promise<Host>((resolve, reject) => {
    server.listen(0, () => {
      const addr = server.address();
      if (typeof addr === "string" || addr === null) {
        return reject("Address has no port");
      }
      const { port } = addr;
      resolve({
        server,
        origin: `http://localhost:${port}`,
        destroy: () => new Promise((resolve) => server.close(resolve)),
      });
    });
  });
}
