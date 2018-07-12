import { render, shallow } from "enzyme";
import * as React from "react";

import ActListing from "./ActListing";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    genre: "genre",
    imageUrl: "imageUrl",
    location: {
      address: "location address",
      name: "location name",
      type: "location type",
      url: "location url"
    },
    name: "name",
    type: "type",
    url: "url",
    ...fromTestProps
  };

  return {
    actual: fn(<ActListing {...props} />),
    props
  };
};

describe("[components] <ActListing />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);
    expect(actual).toMatchSnapshot();
  });

  it("updates `isRendered` state after image has loaded", () => {
    const { actual } = setup(shallow);

    actual.find("img").simulate("load");
    expect(actual.state("isRendered")).toBe(true);
    expect(actual.render()).toMatchSnapshot();
  });

  it("triggers onLoad prop after image has loaded", () => {
    const { actual, props } = setup(shallow, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
  });

  it("updates `isRendered` state and triggers onLoad prop when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual, props } = setup(shallow, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");
    expect(props.onLoad).toHaveBeenCalled();
    expect(actual.state("isRendered")).toBe(true);
    expect(actual.render()).toMatchSnapshot();
  });
});
