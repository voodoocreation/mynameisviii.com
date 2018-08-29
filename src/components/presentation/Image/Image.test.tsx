import { mount, render } from "enzyme";
import * as React from "react";

import Image from "./Image";

const g: any = global;

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestImage",
    ...fromTestProps
  };

  return {
    actual: fn(<Image {...props} />),
    props
  };
};

describe("[presentation] <Image />", () => {
  beforeEach(() => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: false
    });
  });

  it("renders correctly with minimum props", () => {
    const { actual } = setup(render);

    expect(actual.find(".Loader")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("triggers `onClick` prop when `Enter` key is pressed on focused image", () => {
    const { actual, props } = setup(mount, { onClick: jest.fn() });

    actual.simulate("keypress", { key: "Enter" });

    expect(props.onClick).toHaveBeenCalled();
  });

  it("doesn't trigger `onClick` prop when a key other than `Enter` is pressed on focused image", () => {
    const { actual, props } = setup(mount, { onClick: jest.fn() });

    actual.simulate("keypress", { key: "ArrowLeft" });

    expect(props.onClick).not.toHaveBeenCalled();
  });

  it("updates `isRendered` state and triggers `onLoad` prop after image has loaded", () => {
    const { actual, props } = setup(mount, {
      onLoad: jest.fn()
    });

    actual.find("img").simulate("load");

    expect(props.onLoad).toHaveBeenCalled();
    expect(actual.find("Loader")).toHaveLength(0);
    expect(actual.render()).toMatchSnapshot();
  });

  it("updates `isRendered` state when image has previously been loaded", () => {
    Object.defineProperty(g.Image.prototype, "complete", {
      value: true
    });

    const { actual } = setup(mount);

    actual.find("img").simulate("load");

    expect(actual.find("Loader")).toHaveLength(0);
    expect(actual.render()).toMatchSnapshot();
  });
});
