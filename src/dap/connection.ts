import { Socket } from "net";

import { Event, Request, Response } from "./generated/debugAdapterProtocol";

const HOST = "localhost";
const PORT = 5678;

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

  constructor(host: string = HOST, port: number = PORT) {
    this.socket = new Socket();
    this.socket.connect(port, host);

    this.socket.on("data", (data: string | Buffer) => {
      String(data)
        ?.split(/Content-Length: [0-9]*\r\n\r\n/)
        ?.slice(1)
        .forEach((jsonData) => {
          const message = JSON.parse(jsonData ?? "{}");

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
    console.log(
      `sending: Content-Length: ${requestStr.length}\r\n\r\n${requestStr}`
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
