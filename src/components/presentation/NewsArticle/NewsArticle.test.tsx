import { mount, render } from "enzyme";
import * as React from "react";

import NewsArticle from "./NewsArticle";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    author: "author",
    content: "<p>content</p>",
    createdAt: "2017-10-10T18:00:00",
    excerpt: "excerpt",
    imageUrl: "imageUrl",
    isActive: true,
    slug: "slug",
    title: "title",
    ...fromTestProps
  };

  return {
    actual: fn(<NewsArticle {...props} />),
    props
  };
};

describe("[presentation] <NewsArticle />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has loaded", () => {
    const { actual } = setup(mount);

    actual.find(".NewsArticle-image img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find(".NewsArticle-image img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });
});
