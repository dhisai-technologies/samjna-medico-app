import { S3Client } from "@aws-sdk/client-s3";
import { Logger as LogConsumer, Notifier as NotificationConsumer } from "@packages/broker/consumers";
import { Logger, Notifier } from "@packages/broker/producers";
import { config } from "./config";

console.log("URL: ", config.AMQP_URL);

export const logConsumer = new LogConsumer(config.AMQP_URL);
export const logger = new Logger(config.AMQP_URL);
export const notificationConsumer = new NotificationConsumer(config.AMQP_URL);
export const notifier = new Notifier(config.AMQP_URL);
export const s3Client = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});
