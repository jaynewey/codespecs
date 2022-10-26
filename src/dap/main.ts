import { arrayOrNone, objectOrNone } from "../utils";
import DapClient from "./generated/dapClient";

const client = new DapClient();

client
  .initialize({
    adapterID: "pydevd", // for debugpy - will need to be dynamic for arbitrary adapters
  })
  .then((response) => {
    console.log("received: " + JSON.stringify(response));
    client
      .attach({
        __restart: true,
      })
      .then((response) => {
        console.log("received: " + JSON.stringify(response));
      });
  });

client.onInitializedEvent((event) => {
  console.log("received: " + JSON.stringify(event));
  client
    .setBreakpoints({
      breakpoints: [{ line: 1 }],
      source: { path: "foo.py" },
    })
    .then((response) => {
      console.log("received: " + JSON.stringify(response));
      client.configurationDone();
    });
});

let threadId: number | null = null;
let frameId: number | null = null;
let variablesReference: number | null = null;

const next = () => {
  if (typeof variablesReference !== "number") {
    console.log("no variables ref");
    return;
  }
  client
    .variables({ variablesReference: variablesReference })
    .then((response) => {
      console.log("received: " + JSON.stringify(response));

      if (typeof threadId === "number") {
        client.next({ threadId: threadId });
      }
    });
};

client.onStoppedEvent((event) => {
  console.log("received: " + JSON.stringify(event));
  const body = objectOrNone(event?.body) ?? {};

  if (
    typeof threadId !== "number" ||
    typeof frameId !== "number" ||
    typeof variablesReference !== "number"
  ) {
    // need thread ID
    const newThreadId = body?.threadId;

    if (typeof newThreadId !== "number") {
      console.log("no thread id");
      client.close();
      return;
    }

    threadId = newThreadId;

    client.stackTrace({ threadId: threadId }).then((response) => {
      console.log("received: " + JSON.stringify(response));
      const body = objectOrNone(response?.body) ?? {};
      // need stack frame id
      frameId = (arrayOrNone(body?.stackFrames) ?? [])[0]?.id ?? undefined;

      if (typeof frameId !== "number") {
        console.log("no frame id");
        client.close();
        return;
      }

      client
        .scopes({ frameId: frameId })
        .then((response) => {
          console.log("received: " + JSON.stringify(response));
          const body = objectOrNone(response?.body) ?? {};
          // need variables reference
          variablesReference = body?.scopes?.[0]?.variablesReference;
        })
        .then(next);
    });
  } else {
    next();
  }
});

client.onTerminatedEvent(() => {
  console.log("\n*************terminated*****************\n");
  // close the connection when the adapter terminates
  client.close();
});
