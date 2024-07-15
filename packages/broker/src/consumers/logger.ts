import type * as schema from "@packages/database";
import { logs } from "@packages/database";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { AMQPConnection } from "../amqp-connection";
import { loggerConfig } from "../config";

export class Logger extends AMQPConnection {
  private exchange = loggerConfig.exchange;
  private type = loggerConfig.type;
  async listen(db: NodePgDatabase<typeof schema>) {
    await super.connect("Log consumer");
    await this.assertExchange(this.exchange, this.type);
    this.subscribe(
      this.exchange,
      async (message) => {
        if (!message) return;
        const values = JSON.parse(message.content.toString()) as typeof logs.$inferInsert;
        await db.insert(logs).values(values);
      },
      Object.values(loggerConfig.routingKeys),
    );
  }
}
