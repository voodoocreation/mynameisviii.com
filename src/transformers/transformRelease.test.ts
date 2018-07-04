import { camelizeKeys } from "humps";

import releases from "../../server/mocks/releases.json";
import transformRelease from "./transformRelease";

describe("[transformers] Release", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;
    try {
      transformed = transformRelease(camelizeKeys(releases.Items[0]));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets isActive to true correctly when 'y' is passed", () => {
    const transformed = transformRelease({ isActive: "y" });
    expect(transformed.isActive).toEqual(true);
  });

  it("sets isActive to false correctly when 'n' is passed", () => {
    const transformed = transformRelease({ isActive: "n" });
    expect(transformed.isActive).toEqual(false);
  });

  it("sets isActive to false correctly when undefined", () => {
    const transformed = transformRelease({});
    expect(transformed.isActive).toEqual(false);
  });
});
