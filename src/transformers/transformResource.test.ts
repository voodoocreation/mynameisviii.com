import { camelizeKeys } from "humps";

import resources from "../../server/mocks/resources.json";
import transformResource from "./transformResource";

describe("[transformers] Resource", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;

    try {
      transformed = transformResource(camelizeKeys(resources.Items[0]));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets isActive to true correctly when 'y' is passed", () => {
    const transformed = transformResource({ isActive: "y" });
    expect(transformed.isActive).toEqual(true);
  });

  it("sets isActive to false correctly when 'n' is passed", () => {
    const transformed = transformResource({ isActive: "n" });
    expect(transformed.isActive).toEqual(false);
  });

  it("sets isActive to false correctly when undefined", () => {
    const transformed = transformResource({});
    expect(transformed.isActive).toEqual(false);
  });
});
