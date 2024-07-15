import { createServer as createHttpServer } from "node:http";
import { config } from "@/config";
import { client, db } from "@/db";
import { createServer } from "@/server";
import { notifications, users } from "@packages/database";
import { eq } from "drizzle-orm";
import { Server } from "socket.io";
import { logConsumer, logger, notificationConsumer, notifier } from "./tools";

async function startServer() {
  await client.connect();

  console.log("📦 connected to database");

  const server = createServer();

  const httpServer = createHttpServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: config.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("receive-notifications", async (email: string) => {
      const user = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) return;
      socket.join(`notification-${user.id}`);
      console.log(`🙂 user joined room notification-${user.id}`);
      const userNotifications = await db.select().from(notifications).where(eq(notifications.userId, user.id));
      socket.emit("notifications", userNotifications);
    });
  });

  httpServer.listen(config.PORT, async () => {
    console.log(`🚀 started ${config.NAME} on [::]:${config.PORT}, url: http://localhost:${config.PORT}`);
    await logger.connect();
    await logConsumer.listen(db);
    await notifier.connect();
    await notificationConsumer.listen(db, io);
  });

  return server;
}

startServer();
