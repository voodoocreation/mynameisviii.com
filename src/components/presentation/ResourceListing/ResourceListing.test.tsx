import { mount, render } from "enzyme";
import * as React from "react";

import ResourceListing from "./ResourceListing";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    createdAt: "2017-10-10T18:00:00",
    description: "description",
    imageUrl: "imageUrl",
    isActive: true,
    slug: "slug",
    title: "title",
    type: "type",
    url: "url",
    ...fromTestProps
  };

  return {
    actual: fn(<ResourceListing {...props} />),
    props
  };
};

describe("[presentation] <ResourceListing />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly", () => {
    const { actual } = setup(render);

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

  it("updates `isImageLoaded` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find("img").simulate("load");
    expect(actual.render()).toMatchSnapshot();
  });
});
