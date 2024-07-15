import client, { type Connection, type Channel, type ConsumeMessage } from "amqplib";

export class AMQPConnection {
  url: string | client.Options.Connect;
  private connection!: Connection;
  private channel!: Channel;

  constructor(url: string | client.Options.Connect) {
    this.url = url;
  }

  async connect(message?: string) {
    if (this.channel) return;

    try {
      this.connection = await client.connect(this.url);
      console.log(`✅ ${message ? message : "Message queue"} connection is ready`);
      this.channel = await this.connection.createChannel();
    } catch (_) {
      console.error(`❌ ${message ? message : "Message queue"} connection failed`);
    }
  }

  protected async sendToQueue(
    queue: string,
    content: Buffer,
    assertQueueOptions: client.Options.AssertQueue = { durable: true },
    sendToQueueOptions: client.Options.Publish = {
      persistent: true,
    },
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      await this.channel.assertQueue(queue, assertQueueOptions);
      this.channel.sendToQueue(queue, content, sendToQueueOptions);
    } catch (error) {
      console.error(`💥 Error in sending to queue ${queue}: ${error}`);
    }
  }

  protected async consume(
    queue: string,
    callback: (message: ConsumeMessage | null) => void,
    assertQueueOptions: client.Options.AssertQueue = { durable: true },
    consumeFromQueueOptions: client.Options.Consume = { noAck: true },
    prefetchCount?: number,
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      await this.channel.assertQueue(queue, assertQueueOptions);
      if (prefetchCount) {
        this.channel.prefetch(prefetchCount);
      }
      this.channel.consume(queue, callback, consumeFromQueueOptions);
    } catch (error) {
      console.error(`💥 Error in consuming from queue: ${error}`);
    }
  }

  protected async assertExchange(
    exchange: string,
    type = "direct",
    options: client.Options.AssertExchange = { durable: true },
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      await this.channel.assertExchange(exchange, type, options);
    } catch (error) {
      console.error(`💥 Error in asserting exchange ${exchange}: ${error}`);
    }
  }

  protected async publish(exchange: string, routingKey: string, content: Buffer, options?: client.Options.Publish) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      this.channel.publish(exchange, routingKey, content, options);
    } catch (error) {
      console.error(`💥 Error in publishing to exchange: ${error}`);
    }
  }

  protected async subscribe(
    exchange: string,
    callback: (message: ConsumeMessage | null) => void,
    bindingKeys: string[],
    assertQueueOptions: client.Options.AssertQueue = { exclusive: true },
    consumeFromQueueOptions: client.Options.Consume = { noAck: true },
  ) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      const q = await this.channel.assertQueue("", assertQueueOptions);
      for (const key of bindingKeys) {
        await this.channel.bindQueue(q.queue, exchange, key);
      }
      this.channel.consume(q.queue, callback, consumeFromQueueOptions);
    } catch (error) {
      console.error(`💥 Error in subscribing from exchange ${exchange}: ${error}`);
    }
  }
}
