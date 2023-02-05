import { Socket } from "net";

import { Event, Request, Response } from "./generated/debugAdapterProtocol";

const HOST = "127.0.0.1";
const PORT = 5678;
const MAX_RETRIES = 10;
const RETRY_INTERVAL = 100;

type RawRequest = Omit<Request, "seq" | "type">;

/**
 * Base connection class for consuming socket-based protocols.
 * TODO: extract DAP specific behaviour from this class into DapClient
 */
export default class Connection {
  private socket: Socket;
  private responseHandlers = new Map<number, (response: Response) => void>();
  private eventHandlers = new Map<string, ((event: Event) => void)[]>();
  private seq = 0;
  private retries = 0;

  private buffer = "";

  constructor() {
    this.socket = new Socket();

    this.socket.on("data", (data: string | Buffer) => {
      const parts = (this.buffer + String(data))
        ?.split(/Content-Length: [0-9]*\r\n\r\n/)
        ?.slice(1);
      parts.forEach((part, i) => {
        let message: Response | Event | undefined = undefined;

        try {
          message = JSON.parse(part ?? "{}");
        } catch (err) {
          if (i === parts.length - 1) {
            this.buffer += part;
          }
          return;
        }

        switch (message?.type) {
          case "response":
            if (message?.request_seq !== undefined) {
              const handler = this.responseHandlers.get(message.request_seq);

              if (handler !== undefined) handler(message as Response);
            }
            break;
          case "event":
            if (message?.event !== undefined) {
              const handlers = this.eventHandlers.get(message.event);

              if (handlers !== undefined)
                handlers.forEach((handler) => handler(message as Event));
            }
            break;
        }
      });
    });
  }

  public connect(host: string = HOST, port: number = PORT): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.on("error", (error) => {
        if (this.retries >= MAX_RETRIES) {
          reject();
        }

        if ((error as any)?.code === "ECONNREFUSED") {
          setTimeout(() => this.socket.connect(port, host), RETRY_INTERVAL);
          this.retries += 1;
        }
      });

      this.socket.on("ready", () => resolve());

      this.socket.connect(port, host);
    });
  }

  public close() {
    this.socket.destroy();
  }

  /**
   * Sends a request and returns a Promise containing the response.
   */
  public request(rawRequest: RawRequest): Promise<Response> {
    this.seq += 1;
    const request = {
      ...rawRequest,
      ...{ seq: this.seq, type: "request" },
    } as Request;
    const requestStr = JSON.stringify(request);
    this.socket.write(
      `Content-Length: ${requestStr.length}\r\n\r\n${requestStr}`
    );

    return new Promise((resolve) => {
      this.responseHandlers.set(request.seq, (response) => {
        this.responseHandlers.delete(request.seq);
        resolve(response);
      });
    });
  }

  /**
   * Subscribes to the given event and runs the handler when an event is received.
   * Many handlers can be added to the same event.
   * TODO: add capability to remove event handlers
   */
  public onEvent(event: string, handler: (event: Event) => void) {
    const handlers = this.eventHandlers.get(event) ?? [];
    this.eventHandlers.set(event, [...handlers, handler]);
  }
}
