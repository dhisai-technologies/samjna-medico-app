import { createServer as createHttpServer } from "node:http";
import { config } from "@/config";
import { client, db } from "@/db";
import { createServer } from "@/server";
import { notifications, users } from "@packages/database";
import { eq } from "drizzle-orm";
import { Server } from "socket.io";
import { logConsumer, logger, notificationConsumer, notifier } from "./tools";

function startServer() {
  const server = createServer();

  const httpServer = createHttpServer(server);

  const io: Server = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket client with id: ", socket.id);
    socket.on("receive-notifications", async (email: string) => {
      console.log("Requested for notifications for: ", email);
      const user = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) return;
      socket.join(`notification-${user.id}`);
      const userNotifications = await db.select().from(notifications).where(eq(notifications.userId, user.id));
      socket.emit("notifications", userNotifications);
    });
    socket.on("receive-analytics", async (email: string) => {
      const user = await db.query.users.findFirst({ where: eq(users.email, email) });
      if (!user) return;
      socket.join(`analytics-${user.id}`);
    });
  });

  httpServer.listen(config.PORT, async () => {
    console.log(`🚀 started ${config.NAME} on [::]:${config.PORT}, url: http://localhost:${config.PORT}`);
    await client.connect();
    console.log("📦 connected to database");
    await logger.connect();
    await logConsumer.listen(db);
    await notifier.connect();
    await notificationConsumer.listen(db, io);
  });

  return io;
}

export const io: Server = startServer();
