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
    type: "type",
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

  it("renders action with internal route correctly", () => {
    const { actual, props } = setup(render, {
      action: {
        route: "route",
        text: "text"
      }
    });
    const action = actual.find(".NewsArticle-action a");

    expect(action).toHaveLength(1);
    expect(action.attr("href")).toBe(props.action.route);
    expect(action.attr("target")).toBeUndefined();
    expect(actual).toMatchSnapshot();
  });

  it("renders action with internal route correctly", () => {
    const { actual, props } = setup(render, {
      action: {
        text: "text",
        url: "url"
      }
    });
    const action = actual.find(".NewsArticle-action a");

    expect(action).toHaveLength(1);
    expect(action.attr("href")).toBe(props.action.url);
    expect(action.attr("target")).toBe("_blank");
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
