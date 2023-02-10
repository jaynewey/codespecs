import { EventEmitter } from "node:events";

import { Language } from "../../languages";
import { arrayOrNone, objectOrNone } from "../../utils";
import DapClient from "../generated/dapClient";
import { Scope } from "../generated/debugAdapterProtocol";
import { ProgramTrace, VariableIncluder } from "./types";
import { getVariables } from "./variables";

export function addHandlers(
	client: DapClient,
	codePath: string,
	language: Language,
	includer?: VariableIncluder,
	eventEmitter?: EventEmitter
): Promise<ProgramTrace> {
	return new Promise((resolve, reject) => {
		const programTrace: ProgramTrace = {
			language: language,
			lines: [],
		};

		client.onInitializedEvent(() => {
			// once initialised, set breakpoints
			client
				.setBreakpoints({
					// want to stop at first line and step through each line
					breakpoints: [{ line: 1 }],
					source: { path: codePath },
				})
				.then(() => {
					// once breakpoints are set, tell the server we are done configuring
					client.configurationDone();
				});
		});

		client.onStoppedEvent((event) => {
			const body = objectOrNone(event?.body) ?? {};
			const threadId = body?.threadId;

			if (typeof threadId !== "number") {
				client.close();
				reject();
			}

			client.threads().then(() => {
				client.stackTrace({ threadId: threadId }).then((response) => {
					const body = objectOrNone(response?.body) ?? {};
					// NOTE: assumes that if the main file is not first in stackframe list
					// then we're in an internal function and should step out
					const stackFrame = (arrayOrNone(body?.stackFrames) ?? [])?.[0];
					// need stack frame id
					const frameId = stackFrame?.id;
					// get line number
					const lineNumber = stackFrame?.line ?? 0;

					if (typeof frameId !== "number" || stackFrame?.source?.path !== codePath) {
						client.stepOut({ threadId });
						return;
					}

					client.scopes({ frameId: frameId }).then((response) => {
						const body = objectOrNone(response?.body) ?? {};
						Promise.all(
							body?.scopes
								?.filter((scope: Scope) => !scope.expensive)
								?.map(async (scope: Scope) => {
									// need variables reference
									const variablesReference = scope?.variablesReference;
									return getVariables(client, variablesReference, includer);
								})
						).then((variables) => {
							const line = {
								lineNumber: lineNumber,
								variables: variables.flat(1),
								stdout: "", // TODO: support program output
							};
							programTrace.lines.push(line);
							eventEmitter?.emit("pushLine", line);

							if (typeof threadId === "number") {
								client.stepIn({ threadId: threadId, granularity: "line" });
							}
						});
					});
				});
			});
		});

		client.onTerminatedEvent(() => {
			// close the connection when the adapter terminates
			client.close();
			// the trace is finished, resolve the promise
			resolve(programTrace);
		});
	});
}
