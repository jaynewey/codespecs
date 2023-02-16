import { generateIncrementalIdStrategy } from "../src/dap/tracer/incrementalIdStrategy";

describe("generateIncrementalIdStrategy", () => {
	test("same evaluate name returns same ID", () => {
		const incrementalIdStrategy = generateIncrementalIdStrategy();
		const foo = { name: "foo", value: "bar", variablesReference: 0, evaluateName: "bar.foo" };
		const bar = { name: "bar", value: "bar", variablesReference: 0, evaluateName: "bar.bar" };
		expect(incrementalIdStrategy(foo)).toBe(0);
		expect(incrementalIdStrategy(foo)).toBe(0);
		expect(incrementalIdStrategy(bar)).toBe(1);
		expect(incrementalIdStrategy(foo)).toBe(0);
	});

	test("no evaluateName returns -1", () => {
		const incrementalIdStrategy = generateIncrementalIdStrategy();
		expect(incrementalIdStrategy({ name: "foo", value: "bar", variablesReference: 0 })).toBe(-1);
	});
});

