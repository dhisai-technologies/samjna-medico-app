import type { logs } from "@packages/database";
import { AMQPConnection } from "../amqp-connection";
import { loggerConfig } from "../config";

export class Logger extends AMQPConnection {
  private exchange = loggerConfig.exchange;
  private type = loggerConfig.type;
  async connect() {
    await super.connect("Log producer");
    await this.assertExchange(this.exchange, this.type);
  }
  trace(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.TRACE,
      Buffer.from(JSON.stringify({ ...content, level: "TRACE" })),
    );
  }
  debug(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.DEBUG,
      Buffer.from(
        JSON.stringify({
          ...content,
          level: "DEBUG",
        }),
      ),
    );
  }
  info(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.INFO,
      Buffer.from(
        JSON.stringify({
          ...content,
          level: "INFO",
        }),
      ),
    );
  }
  warn(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.WARN,
      Buffer.from(
        JSON.stringify({
          ...content,
          level: "WARN",
        }),
      ),
    );
  }
  error(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.ERROR,
      Buffer.from(
        JSON.stringify({
          ...content,
          level: "ERROR",
        }),
      ),
    );
  }
  fatal(content: typeof logs.$inferInsert) {
    this.publish(
      this.exchange,
      loggerConfig.routingKeys.FATAL,
      Buffer.from(
        JSON.stringify({
          ...content,
          level: "FATAL",
        }),
      ),
    );
  }
}
