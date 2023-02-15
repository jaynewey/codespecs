import clientTemplate from "../src/dap/clientTemplate";
import * as schema from "./dapSchemaDraft04.json";

it("generates valid client", () => {
  const client = clientTemplate(schema);
  expect(client).toMatchSnapshot();
});
