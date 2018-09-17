import { camelizeKeys } from "humps";

import gallery from "../../server/mocks/gallery.json";
import transformGallery from "./transformGallery";

describe("[transformers] Gallery", () => {
  it("transforms API data correctly", () => {
    let isPassing = true;
    let transformed;

    try {
      transformed = transformGallery(camelizeKeys(gallery));
    } catch (error) {
      isPassing = false;
    }

    expect(transformed).toBeDefined();
    expect(isPassing).toBe(true);
  });

  it("sets title to parsed slug when `title` is undefined", () => {
    const transformed = transformGallery({ slug: "test-gallery-1" });
    expect(transformed.title).toEqual("Test Gallery 1");
  });

  it("sets title to parsed title when `title` is defined", () => {
    const transformed = transformGallery({
      slug: "test-gallery-1",
      title: "Test Gallery One"
    });
    expect(transformed.title).toEqual("Test Gallery One");
  });
});
