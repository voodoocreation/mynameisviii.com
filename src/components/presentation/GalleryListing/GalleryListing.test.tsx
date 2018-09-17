import { mount, render } from "enzyme";
import * as React from "react";

import GalleryListing from "./GalleryListing";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    description: "description",
    imageUrl: "imageUrl",
    slug: "slug",
    title: "title",
    ...fromTestProps
  };

  return {
    actual: fn(<GalleryListing {...props} />),
    props
  };
};

describe("[presentation] <GalleryListing />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders correctly when `imageUrl` prop is not defined", () => {
    const { actual } = setup(render, { imageUrl: undefined });

    expect(actual).toMatchSnapshot();
  });

  it("updates `isRendered` state after image has loaded", () => {
    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers `onLoad` prop after image has loaded", () => {
    const { actual, props } = setup(mount, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
  });

  it("triggers `onLoad` prop after listing has rendered when `imageUrl` prop is not defined", () => {
    const { props } = setup(mount, {
      imageUrl: undefined,
      onLoad: jest.fn()
    });

    expect(props.onLoad).toHaveBeenCalled();
  });

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });
});
