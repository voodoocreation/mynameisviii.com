import { camelizeKeys } from "humps";

import news from "../../server/mocks/news.json";
import transformNewsArticle from "./transformNewsArticle";

it("[transformers] news article transformer works correctly", () => {
  let isPassing = true;
  let transformed;
  try {
    transformed = transformNewsArticle(camelizeKeys(news.Items[0]));
  } catch (error) {
    isPassing = false;
  }

  expect(transformed.isActive).toEqual(true);
  expect(isPassing).toBe(true);
});
