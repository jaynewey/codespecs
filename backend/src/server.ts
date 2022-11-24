import cors from "@fastify/cors";
import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";

const server: FastifyInstance = Fastify({});
server.register(cors, {
  origin: "*",
});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          hello: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/api/", opts, async () => {
  return { hello: "world" };
});

server.post("/api/run/", async () => {
  /*
   * Response for example python program:
   *
   *	array = [1, 2, 3]
   *
   *	number = 7
   *
   * 	string = "Hello, world!"
   *
   *	mapping = {
   *	    "a": "b",
   *	    "b": "c"
   *	}
   *
   *	print(string)
   */
  return {
    variables: [
      {
        name: "array",
        value: "[1, 2, 3]",
        children: [
          {
            name: "[0]",
            value: "1",
          },
          {
            name: "[1]",
            value: "2",
          },
          {
            name: "[2]",
            value: "3",
          },
        ],
      },
      {
        name: "number",
        value: "7",
        children: [],
      },
      {
        name: "string",
        value: "'Hello, world!'",
        children: [],
      },
      {
        name: "mapping",
        value: "{'a': 'b', 'c': 'd'}",
        children: [
          {
            name: "'a'",
            value: "'b'",
          },
          {
            name: "'b'",
            value: "'c'",
          },
        ],
      },
    ],
    stdout: "Hello, world!",
  };
});

const languages: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
};

server.get("/api/languages/", languages, async () => {
  return [
    "Python (3.8.1)",
    "Python (2.7.17)",
    "JavaScript (Node.js 12.14.0)",
    "Java (OpenJDK 13.0.1)",
  ];
});

const start = async () => {
  try {
    await server.listen({ port: 8081, host: "0.0.0.0" });
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};
start();
