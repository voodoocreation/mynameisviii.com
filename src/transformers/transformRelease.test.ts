import { camelizeKeys } from "humps";

import releases from "../../server/mocks/releases.json";
import transformRelease from "./transformRelease";

it("[transformers] release transformer works correctly", () => {
  let isPassing = true;
  let transformed;
  try {
    transformed = transformRelease(camelizeKeys(releases.Items[0]));
  } catch (error) {
    isPassing = false;
  }

  expect(transformed.isActive).toEqual(true);
  expect(isPassing).toBe(true);
});
