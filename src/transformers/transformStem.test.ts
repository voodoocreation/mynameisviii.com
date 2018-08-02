import { camelizeKeys } from "humps";

import stems from "../../server/mocks/releases.json";
import transformStem from "./transformStem";

describe("[transformers] Stem", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;

    try {
      transformed = transformStem(camelizeKeys(stems.Items[0]));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets isActive to true correctly when 'y' is passed", () => {
    const transformed = transformStem({ isActive: "y" });
    expect(transformed.isActive).toEqual(true);
  });

  it("sets isActive to false correctly when 'n' is passed", () => {
    const transformed = transformStem({ isActive: "n" });
    expect(transformed.isActive).toEqual(false);
  });

  it("sets isActive to false correctly when undefined", () => {
    const transformed = transformStem({});
    expect(transformed.isActive).toEqual(false);
  });
});
