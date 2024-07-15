import { Logger as LogConsumer, Notifier as NotificationConsumer } from "@packages/broker/consumers";
import { Logger, Notifier } from "@packages/broker/producers";
import { config } from "./config";

export const logConsumer = new LogConsumer(config.AMQP_URL);
export const logger = new Logger(config.AMQP_URL);
export const notificationConsumer = new NotificationConsumer(config.AMQP_URL);
export const notifier = new Notifier(config.AMQP_URL);
