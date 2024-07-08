import { config } from "@/config";
import { createServer } from "@/server";

async function startServer() {
  const server = createServer();

  server.listen(config.SERVICE_PORT, () => {
    console.log(
      `🚀 started ${config.SERVICE_NAME} on [::]:${config.SERVICE_PORT}, url: http://localhost:${config.SERVICE_PORT}`
    );
  });

  return server;
}

startServer();
