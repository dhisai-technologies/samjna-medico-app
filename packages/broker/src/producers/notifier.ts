import type { notifications } from "@packages/database";
import { AMQPConnection } from "../amqp-connection";
import { notifierConfig } from "../config";

export class Notifier extends AMQPConnection {
  private exchange = notifierConfig.exchange;
  private type = notifierConfig.type;
  async connect() {
    await super.connect("Notification producer");
    await this.assertExchange(this.exchange, this.type);
  }
  default(
    content: typeof notifications.$inferInsert & {
      type: (typeof notifierConfig)["types"][number];
    },
  ) {
    this.publish(this.exchange, notifierConfig.routingKeys.DEFAULT, Buffer.from(JSON.stringify(content)));
  }
  important(
    content: typeof notifications.$inferInsert & {
      type: (typeof notifierConfig)["types"][number];
    },
  ) {
    this.publish(this.exchange, notifierConfig.routingKeys.IMPORTANT, Buffer.from(JSON.stringify(content)));
  }
}
