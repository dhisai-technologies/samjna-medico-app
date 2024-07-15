import type * as schema from "@packages/database";
import { notifications } from "@packages/database";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Server } from "socket.io";
import { AMQPConnection } from "../amqp-connection";
import { notifierConfig } from "../config";

export class Notifier extends AMQPConnection {
  private exchange = notifierConfig.exchange;
  private type = notifierConfig.type;
  async listen(db: NodePgDatabase<typeof schema>, io: Server) {
    await super.connect("Notifications consumer");
    await this.assertExchange(this.exchange, this.type);
    this.subscribe(
      this.exchange,
      async (message) => {
        if (!message) return;
        const notification = JSON.parse(message.content.toString()) as typeof notifications.$inferInsert;
        await db.insert(notifications).values(notification);
        io.to(`notification-${notification.userId}`).emit("notification", notification);
      },
      Object.values(notifierConfig.routingKeys),
    );
  }
}
