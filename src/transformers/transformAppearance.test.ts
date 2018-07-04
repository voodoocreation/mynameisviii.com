import { camelizeKeys } from "humps";

import appearances from "../../server/mocks/appearances.json";
import transformAppearance from "./transformAppearance";

describe("[transformers] Appearance", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;
    try {
      transformed = transformAppearance(camelizeKeys(appearances.Items[0]));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets isActive to true correctly when 'y' is passed", () => {
    const transformed = transformAppearance({ isActive: "y" });
    expect(transformed.isActive).toEqual(true);
  });

  it("sets isActive to false correctly when 'n' is passed", () => {
    const transformed = transformAppearance({ isActive: "n" });
    expect(transformed.isActive).toEqual(false);
  });

  it("sets isActive to false correctly when undefined", () => {
    const transformed = transformAppearance({});
    expect(transformed.isActive).toEqual(false);
  });
});
