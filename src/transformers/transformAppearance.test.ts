import { camelizeKeys } from "humps";

import appearances from "../../server/mocks/appearances.json";
import transformAppearance from "./transformAppearance";

it("[transformers] appearance transformer works correctly", () => {
  let isPassing = true;
  let transformed;
  try {
    transformed = transformAppearance(camelizeKeys(appearances.Items[0]));
  } catch (error) {
    isPassing = false;
  }

  expect(transformed.isActive).toEqual(true);
  expect(isPassing).toBe(true);
});
