import { mount, render } from "enzyme";
import * as React from "react";

import Toast from "./Toast";

const setup = (fn: any, fromTestProps?: any) => {
  const props = {
    className: "TestToast",
    ...fromTestProps
  };

  return {
    actual: fn(<Toast {...props}>Test</Toast>),
    props
  };
};

describe("[presentation] <Toast />", () => {
  beforeEach(() => {
    window.setTimeout = jest.fn((fn: any) => {
      fn();
      return 1;
    });
    window.clearTimeout = jest.fn();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("closes when close button is clicked, then reopens when new props are passed", () => {
    const { actual } = setup(mount, { isVisible: true, hasAutoDismiss: false });

    expect(actual.find(".Toast")).toHaveLength(1);

    actual.find(".Toast-closeButton").simulate("click");
    expect(actual.find(".Toast")).toHaveLength(0);

    actual.setProps({ isVisible: true });
    expect(actual.find(".Toast")).toHaveLength(1);
  });

  it("dismisses automatically when hasAutoDismiss=true", () => {
    const { actual } = setup(mount, { isVisible: true });

    actual.setProps({ isVisible: true });

    expect(window.setTimeout).toHaveBeenCalledTimes(6);
    expect(window.clearTimeout).toHaveBeenCalledTimes(3);
  });
});
