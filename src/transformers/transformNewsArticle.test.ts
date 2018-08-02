import { camelizeKeys } from "humps";

import news from "../../server/mocks/news.json";
import transformNewsArticle from "./transformNewsArticle";

describe("[transformers] News article", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;

    try {
      transformed = transformNewsArticle(camelizeKeys(news.Items[0]));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets isActive to true correctly when 'y' is passed", () => {
    const transformed = transformNewsArticle({ isActive: "y" });
    expect(transformed.isActive).toEqual(true);
  });

  it("sets isActive to false correctly when 'n' is passed", () => {
    const transformed = transformNewsArticle({ isActive: "n" });
    expect(transformed.isActive).toEqual(false);
  });

  it("sets isActive to false correctly when undefined", () => {
    const transformed = transformNewsArticle({});
    expect(transformed.isActive).toEqual(false);
  });
});
